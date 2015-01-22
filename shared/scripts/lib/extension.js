'use strict';

import { environment } from './environment';
import storage from './storage';
import { start, stop } from './activity';
import { listen } from './notifications';
import { getCurrentTab, tabs } from './tabs';
import { setDefaults } from './defaults';
import { giveUniqueIdentifier } from './identifier';

/**
 * Opens the extension in a new tab window.
 *
 * @param {Object} options - to specify configuration.
 */
export function createExtension(options) {
  // In Chrome we only need to set up the icon click event to open the
  // extension.
  
  //console.log(defaults);
  if (environment === 'chrome') {
    // Listen for notifications.
    listen();
    //console.log(defaults);
    setDefaults();
    giveUniqueIdentifier();
    chrome.browserAction.onClicked.addListener(function() {
      chrome.tabs.create({
        url: chrome.extension.getURL(options.indexUrl)
      });
    });
  }
  // In Firefox it's a bit more complicated and involves setting up a message
  // proxy to communicate storage and notifications.
  else if (environment === 'firefox') {
    var buttons = require('sdk/ui/button/action');
    var tabs = require('sdk/tabs');
    var data = require('sdk/self').data;
    var engine = require('sdk/simple-storage');

    // Hooks up the content script once the tab has been loaded.  This also
    // sets up the messaging bridge.
    var attachScripts = function(tab) {
      var worker = tab.attach({
        contentScriptFile: options.scripts.map(data.url)
      });

      // Pass in the worker to allow notifications to set the listener.
      listen(worker);

      // Proxy getting a value from the storage engine.
      worker.port.on('storage.get', function(key) {
        worker.port.emit('storage.get', engine.storage[key]);
      });

      // Proxy setting a value in the storage engine.
      worker.port.on('storage.set', function(result) {
        engine.storage[result.key] = result.value;
        worker.port.emit('storage.set');
      });
    };

    // Once the tab emits it's `ready` event and we're on the extension url,
    // attach and hook up the scripts and messaging bus.
    tabs.on('ready', function(tab) {
      if (tab.url.indexOf('resource://jid1-onbkbcx9o5ylwa-at-jetpack') === 0) {
        attachScripts(tab);
      }
    });

    // Hook into the icon to display the extension.
    buttons.ActionButton({
      id: options.id,
      label: options.label,
      icon: options.icon,

      onClick: function(state) {
        tabs.open({
          url: data.url(options.indexUrl),
          onReady: function(tab) {
            attachScripts(tab);
          }
        });
      }
    });
  }
}

/**
 * Hooks in the content script to Firefox and listens for events.
 *
 * @param {string} path - to the content script.
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
