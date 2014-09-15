'use strict';

import { environment } from './environment';
import storage from './storage';

/**
 * Opens the extension in a new tab window.
 *
 * @param {Object} options
 */
export function addTrayIcon(options) {
  if (environment === 'chrome') {
    chrome.browserAction.onClicked.addListener(function() {
      chrome.tabs.create({
        url: chrome.extension.getURL(options.indexUrl)
      });
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
        tabs.open({
          url: data.url(options.indexUrl),
        });

        var engine = require('sdk/simple-storage');

        tabs.activeTab.on('ready', function(tab) {
          var worker = tab.attach({
            contentScriptFile: data.url('js/tipsy.js')
          });

          worker.port.on('storage.get', function(key) {
            worker.port.emit('storage.get', engine.storage[key]);
          });

          worker.port.on('storage.set', function(result) {
            engine.storage[result.key] = result.value;
            worker.port.emit('storage.set');
          });
        });
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
