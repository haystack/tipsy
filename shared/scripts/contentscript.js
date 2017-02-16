'use strict';

import { environment } from './lib/environment';
import { selectAll } from './lib/dom';
import { domains } from './lib/hardcoded-doms';
import { parseTxt } from './lib/utils/tipsy-txt-parser';

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

// Place little dom node to let page know tipsy is installed. This is 
// how it should be done according to google:
// https://developer.chrome.com/webstore/inline_installation
var isInstalledNode = document.createElement('div');
isInstalledNode.id = 'tipsy-is-installed';
document.body.appendChild(isInstalledNode);
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

// Build up an object with page and author details for the extension.
var messageBody = {
  hostname: findDomain(),
  list: []
};


// Enforce HTTPS requirement for parsing payment info from page. Page
// can still be HTTP, but then /tipsy.txt must be served over HTTPS.
if (document.location.protocol == 'https:') {

  // Find all links on the page.
  var links = selectAll('link');

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
  if (messageBody.list.length === 0) {
    messageBody.list = parseTxt();
  }
} else {
  // Page loaded over HTTP, but give /tipsy.txt a shot (also requires HTTPS)
  messageBody.list = parseTxt();
}


//console.log(messageBody)


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
