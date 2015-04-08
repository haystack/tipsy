'use strict';

import { environment } from './lib/environment';
import { selectAll } from './lib/dom';
import { domains } from './lib/hardcoded-doms';

/**
 * Allows communication between content script and background script.
 *
 * @param {Object} body - the message payload.
 */
function postMessage(body) {
  body = JSON.stringify(body);

  if (environment === 'chrome') {
    chrome.runtime.sendMessage(body);
  }
  else if (environment === 'firefox') {
    self.port.emit('contentScript', body);
  }
}


/**
 * Debounce a function to not thrash the message passing.
 *
 * @param {Function} fn - A function to debounce.
 * @param {number} delay - How long to wait.
 * @return {Function} A new function that will be used in place and debounced.
 */
function debounce(fn, delay) {
  // Close around this variable so that subsequent calls will always reference
  // the same timer.
  var timeout;

  return function() {
    var args = arguments;

    // Always clear the timeout.
    clearTimeout(timeout);

    // Set a new timeout.
    timeout = setTimeout(function() {
      fn.apply(this, args);
    }.bind(this), delay);
  };
}

/**
 * Find the current domain name.
 *
 * Technique from:
 * http://rossscrivener.co.uk/blog/javascript-get-domain-exclude-subdomain
 *
 * @return {string} the domain name
 */
function findDomain() {
  var i = 0;
  var domain = document.domain;
  var p = domain.split('.');
  var s = '_gd' + (new Date()).getTime();

  // Detect if the cookie has already been set, otherwise attempt setting.
  while (i < (p.length - 1) && document.cookie.indexOf(s + '=' + s) == -1) {
    domain = p.slice(-1 - (++i)).join('.');

    // Test setting a cookie.
    document.cookie = s + "=" + s + ";domain=" + domain + ";";
  }

  // Remove the cookie.
  document.cookie = s + "=;expires=Thu, 01 Jan 1970 00:00:01 GMT;domain=" +
    domain + ";";

  // Modifying here to remove the leading `www.`.
  if (domain.indexOf('www.') === 0) {
    domain = domain.slice(4);
  }

  return domain;
}

// Find all links on the page.
var links = selectAll('link');

// Build up an object with page and author details for the extension.
var messageBody = {
  hostname: findDomain(),
  list: []
};

// Iterate over all links and filter down to the last link that contains the
// correct metadata.

if (!domains[messageBody.hostname]) {

  messageBody.list = links.filter(function(link) {
    return link.rel === 'author';
  }).map(function(link) {
    var author = {};

    // Personal identification.
    author.name = link.getAttribute('name');
    author.href = link.getAttribute('href');
    author.gravatar = link.getAttribute('gravatar');

   // Payment information.
    author.dwolla = link.getAttribute('dwolla') || link.getAttribute('data-dwolla');
    author.bitcoin = link.getAttribute('bitcoin') || link.getAttribute('data-bitcoin');
    author.paypal = link.getAttribute('paypal') || link.getAttribute('data-paypal'); 
    author.stripe = link.getAttribute('stripe') || link.getAttribute('data-stripe');
    return author;
  });
  
} else {
  var newArray = [];
  newArray[0] = domains[messageBody.hostname];
  var author = newArray;
  messageBody.list = author;
}

// if nothing, check for tipsy.txt
if (messageBody.list.length == 0) {

  var info = localStorage.getItem(document.domain);
  var cacheDuration;
  var amount;
  var unit;
  
  var shouldRenew = false;
  if (info != null) {
    cacheDuration = info.split("\n")[2];
    console.log("dur ", cacheDuration);
    cacheDuration = cacheDuration.split(" ");
    amount = cacheDuration[0];
    unit = cacheDuration[1];
    
    var diff = Date.now() - Number(info[0]);
    var ms;
    if (unit == 'h') {
      ms = 3600000;
    } else if (unit == 'd') {
      ms = 86400000;
    } else if (unit == 'w') {
      ms = 604800000;
    }
    
    if (diff > ms * Number(amount)) {
      shouldRenew == true
    }    
  }
  
  if (info == null || shouldRenew) {
    var req = new XMLHttpRequest();  
    req.open('GET', "/tipsy.txt", false);   
      req.send(null);  

    if (req.status == 200) {  
      info = Date.now().toString() + "\n" + req.responseText;
      localStorage.setItem(document.domain, info);
    }
  } else {
    info = localStorage.getItem(document.domain)
  }
  if (info != null) {
    var splitted = info.split("\n");
    var name;
    var paypal;
    var dwolla;
    
    var newArray = [];
    var tipsyInfo = splitted.slice(3,splitted.length);
    for (var i =  0; i < tipsyInfo.length; i++) {
      if (tipsyInfo[i].length > 1) {
        var entry = tipsyInfo[i].split(" ");
        var urlPrefix = entry[0]
        var paymentInfos = entry[1]
        var author = entry[2];

        var currentPrefix = document.documentURI.substring(document.documentURI.indexOf(document.domain) + document.domain.length + 1, document.documentURI.length);
        
         if (currentPrefix == " " || currentPrefix == "") {
           currentPrefix = "*";
         }
         
         if (currentPrefix == urlPrefix) {
           if (!newArray[0]) {
             newArray[0] = {};
           }
           
           var splittedProcessors = paymentInfos.split("|");
           for (var j = 0; j < splittedProcessors.length; j++) {
              var splitEntry = splittedProcessors[j].split("=");
              switch(splitEntry[0]){
                case "paypal":
                  newArray[0].paypal = splitEntry[1]
                case "dwolla":
                  newArray[0].dwolla = splitEntry[1]
              }
           }
           
           if (author && author.length > 1) {
             newArray[0].name = author;
           }
         }
      }
    }
   var author = newArray;
   messageBody.list = author;
  }
}


console.log(document.domain)
console.log(messageBody)
// Send this message body back to the extension.
postMessage({
  name: 'author',
  data: messageBody
});

// Makes it easier to denote what the current page idle is.  Binds multiple
// events to an element and then passes along what the state should be.
var addEvent = function(element, events, state) {
  // Allow multiple events to be bound.
  events.split(' ').forEach(function(event) {
    element.addEventListener(event, debounce(function() {
      postMessage({
        name: 'isIdle',
        data: state
      });
    }, 500), true);
  });
};

// Whenever the mouse moves or the page scrolls, set the state to `false`.
addEvent(document.body, 'scroll mousemove', false);

// Loop through all media types and bind to their respective state events to
// update the idle state.
selectAll('audio, video').forEach(function(media) {
  addEvent(media, 'abort pause', true);
  addEvent(media, 'playing', false);
});
