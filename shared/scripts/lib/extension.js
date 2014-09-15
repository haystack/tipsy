'use strict';

import { environment } from './environment';

/**
 * Opens the extension in a new tab window.
 *
 * @param {Object} options
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
    var data = require('sdk/self').data;

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
 * addContentScript
 *
 * @param {string} path - ...
 */
export function addContentScript(path) {
  // Chrome handles the contentscript via the manifest.  In FireFox you
  // programmatically instrument the page to load the script.
  if (environment === 'firefox') {
    var data = require('sdk/self').data;
    var tabs = require('sdk/tabs');

    tabs.activeTab.attach({
      contentScriptFile: data.url(path)
    });
  }
}

/**
 * postMessage
 *
 * @param body
 */
export function postMessage(body) {
  body = JSON.stringify(body);

  if (environment === 'chrome') {
    chrome.runtime.sendMessage(body);
  }

  else if (environment === 'firefox') {
    self.port.emit('contentScript', body);
  }
}
