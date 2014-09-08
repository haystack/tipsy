'use strict';

import { environment } from './environment';

/**
 * Initializes the library to handle the extension abstraction.
 *
 * @param {Object} options - The options to configure the extension with.
 */
function Extension(options) {
  this.options = options;
  this.options.__proto__ = {
    indexUrl: 'about:blank'
  };
}

/**
 * Opens the extension in a new tab window.
 */
Extension.prototype.addTrayIcon = function(iconOptions) {
  var options = this.options;

  if (environment === 'chrome') {
    chrome.browserAction.onClicked.addListener(function(tab) {
      chrome.tabs.create({
        url: chrome.extension.getURL(options.indexUrl)
      });

      if (iconOptions.onClick) {
        iconOptions.onClick(tab);
      }
    });
  }

  else if (environment === 'firefox') {
    var buttons = require('sdk/ui/button/action');
    var tabs = require('sdk/tabs');
    var data = require("sdk/self").data;

    this.mozTrayIcon = buttons.ActionButton({
      id: iconOptions.id,
      label: iconOptions.label,
      icon: iconOptions.icon,
      onClick: function(state) {
        tabs.open(data.url(options.indexUrl));

        if (iconOptions.onClick) {
          iconOptions.onClick(state);
        }
      }
    });
  }
};

export default Extension;
