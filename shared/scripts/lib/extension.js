'use strict';

import { environment } from './environment';

/**
 * Opens the extension in a new tab window.
 */
export function addTrayIcon(options) {
  if (environment === 'chrome') {
    chrome.browserAction.onClicked.addListener(function(tab) {
      chrome.tabs.create({
        url: chrome.extension.getURL(options.indexUrl)
      });

      if (options.onClick) {
        options.onClick(tab);
      }
    });
  }

  else if (environment === 'firefox') {
    var buttons = require('sdk/ui/button/action');
    var tabs = require('sdk/tabs');
    var data = require("sdk/self").data;

    buttons.ActionButton({
      id: options.id,
      label: options.label,
      icon: options.icon,
      onClick: function(state) {
        tabs.open(data.url(options.indexUrl));

        if (options.onClick) {
          options.onClick(state);
        }
      }
    });
  }
}

/**
 * Initializes the library to handle the extension abstraction.
 *
 * @param {Object} options - The options to configure the extension with.
 */
function Extension(options) {
  this.options = options || {};
  this.options.__proto__ = {
    indexUrl: 'about:blank'
  };
}

/**
 * postMessage
 *
 * @param body
 * @return
 */
Extension.prototype.postMessage = function(body) {
  body = JSON.stringify(body);

  if (environment === 'chrome') {
    chrome.runtime.sendMessage(body);
  }

  else if (environment === 'firefox') {
    self.port.emit('contentScript', body);
  }
};

export default Extension;
