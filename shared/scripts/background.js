(function(window) {
  'use strict';

  // Open the extension in a new tab instead of a new window or popup.
  chrome.browserAction.onClicked.addListener(function(tab) {
    chrome.tabs.create({
      url: chrome.extension.getURL('html/index.html')
    });
  });
})(this);
