'use strict';

import { selectAll } from './lib/dom';
import { postMessage } from './lib/extension';

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
  hostname: findDomain()
};

// Iterate over all links and filter down to the last link that contains the
// correct metadata.
links.filter(function(link) {
  return link.rel === 'author';
}).slice(-1).forEach(function(link) {
  // Personal identification.
  messageBody.name = link.getAttribute('name');
  messageBody.gravatar = link.getAttribute('gravatar');

  // Payment information.
  messageBody.bitcoin = link.getAttribute('bitcoin');
  messageBody.paypal = link.getAttribute('paypal');
  messageBody.stripe = link.getAttribute('stripe');

  // TODO Allow an organization link author to be referenced.
  //messageBody.organization = link.getAttribute('organization');
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

addEvent(document.body, 'scroll mousemove', false);

// Loop through all media types and bind to their respective state events to
// update the idle state.
selectAll('audio, video').forEach(function(media) {
  addEvent(media, 'abort pause', true);
  addEvent(media, 'playing', false);
});
