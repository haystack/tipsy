'use strict';

import { selectAll } from './lib/dom';
import { postMessage } from './lib/extension';

// Find all links on the page.
var links = selectAll('link');

// Build up an object with page and author details for the extension.
var messageBody = {
  hostname: window.location.hostname
};

// Iterate over all links and filter down to the last link that contains the
// correct metadata.
links.filter(function(link) {
  return link.rel === 'author';
}).slice(-1).forEach(function(link) {
  messageBody.bitcoinId = link.getAttribute('bitcoinid');
  messageBody.paypalId = link.getAttribute('paypalid');
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
