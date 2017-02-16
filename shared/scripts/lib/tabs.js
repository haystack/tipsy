'use strict';

import { environment } from './environment';

// A global cache of all tabs that are currently being monitored.
export var tabs = {};

// Last accessed tab.
tabs.lastAccessed = null;

/**
 * Finds and normalizes the current active tab into a consumable object.
 *
 * @return {Promise} resolves with normalized tab object.
 */
export function getCurrentTab() {
  // The normalized tab object to use.  Contains two properties: `id` and
  // `url`.
  var tab = {};

  return new Promise(function(resolve, reject) {
    var tabs = null;

    chrome.tabs.query({
      windowId: chrome.windows.WINDOW_ID_CURRENT,
      active: true
    }, function(activeTabs) {
      tab.id = activeTabs[0].id;
      tab.url = activeTabs[0].url;

      resolve(tab);
    });
  });
}
