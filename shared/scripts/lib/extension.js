'use strict';

import { environment } from './environment';
import storage from './storage';
import { start, stop } from './activity';
import { getCurrentTab, tabs } from './tabs';

/**
 * Opens the extension in a new tab window.
 *
 * @param {Object} options
 */
export function createExtension(options) {
  if (environment === 'chrome') {
    chrome.browserAction.onClicked.addListener(function() {
      chrome.tabs.create({
        url: chrome.extension.getURL(options.indexUrl)
      }, function(tab) {
        options.scripts.forEach(function(url) {
          chrome.tabs.executeScript(tab.id, { file: url });
        });
      });
    });
  }
  else if (environment === 'firefox') {
    var buttons = require('sdk/ui/button/action');
    var tabs = require('sdk/tabs');
    var data = require('sdk/self').data;
    var engine = require('sdk/simple-storage');

    buttons.ActionButton({
      id: options.id,
      label: options.label,
      icon: options.icon,

      onClick: function(state) {
        tabs.open({
          url: data.url(options.indexUrl),

          onReady: function(tab) {
            var worker = tab.attach({
              contentScriptFile: options.scripts.map(data.url)
            });

            worker.port.on('storage.get', function(key) {
              worker.port.emit('storage.get', engine.storage[key]);
            });

            worker.port.on('storage.set', function(result) {
              engine.storage[result.key] = result.value;
              worker.port.emit('storage.set');
            });
          }
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
    var pageMod = require('sdk/page-mod');

    pageMod.PageMod({
      include: ['*'],
      contentScriptFile: data.url(path),

      // Send the content script a message inside onAttach
      onAttach: function(worker) {
        // Listen to all events piped from the contentScript and mimic what
        // happens in watcher.
        //
        // TODO Abstract so that the same code is used.
        worker.port.on('contentScript', function(resp) {
          resp = JSON.parse(resp);

          getCurrentTab().then(function(tab) {
            if (resp.name === 'author') {
              tabs[tab.id] = {
                author: resp.data,
                tab: tab
              };

              // Start the activity when the author information has been
              // discovered.
              start(tab);
            }
          });
        });
      }
    });
  }
}
