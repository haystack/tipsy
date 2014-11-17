'use strict';

import { environment } from './lib/environment';
import { selectAll } from './lib/dom';

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
messageBody.list = links.filter(function(link) {
  return link.rel === 'author';
}).map(function(link) {
  var author = {};

  // Personal identification.
  author.name = link.getAttribute('name');
  author.href = link.getAttribute('href');
  author.gravatar = link.getAttribute('gravatar');

  // Payment information.
  author.dwolla = link.getAttribute('dwolla');
  author.bitcoin = link.getAttribute('bitcoin');
  author.paypal = link.getAttribute('paypal');
  author.stripe = link.getAttribute('stripe');

  return author;
});

// Send this message body back to the extension.
postMessage({
  name: 'author',
  data: messageBody
});

// Makes it easier to denote what the current page idle is.  Binds multiple
// events to an element and then passes along what the state should be.
//
// FIXME Should use an inherent debounce here.
var addEvent = function(element, events, state) {
  // Allow multiple events to be bound.
  events.split(' ').forEach(function(event) {
    element.addEventListener(event, function() {
      postMessage({
        name: 'isIdle',
        data: state
      });
    }, true);
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
