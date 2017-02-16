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
    //setDefaults();
    giveUniqueIdentifier();
    chrome.browserAction.onClicked.addListener(function() {
      chrome.tabs.create({
        url: chrome.extension.getURL(options.indexUrl)
      });
    });
  }
}
