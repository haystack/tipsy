/**
* contentscript.js (https://developer.chrome.com/extensions/content_scripts)
* to parse the payment information.
* -- Philippe Schiff
*/
(function(window) {
  'use strict';

  // Find all links on the page.
  var links = document.getElementsByTagName('link');

  // Ensure we're working with a NodeList that inherits Array.prototype.
  links.__proto__ = Array.prototype;

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
  chrome.runtime.sendMessage(body);
})(this);
