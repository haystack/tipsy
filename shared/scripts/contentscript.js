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

var addEvent = function(elements, event, state) {
  // Allow multiple events to be bound.
  elements.split(' ').forEach(function(element) {
    element.addEventListener(event, function() {
      postMessage({
        name: 'isIdle',
        data: state
      });
    }, true);
  });
};

// Loop through all media types and bind to their respective state events to
// update the idle state.
selectAll('audio, video').forEach(function(media) {
  addEvent(media, 'abort pause', true);
  addEvent(media, 'playing', false);
});

addEvent(document.body, 'scroll mousemove', false);
