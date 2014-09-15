'use strict';

import { environment } from './environment';
import { start, stop } from './activity';
import { getCurrentTab, tabs } from './tabs';
import storage from './storage';

// Tracks the current pages open in tabs.  Whenever a tab is closed, remove
// from the list.
var idle = {
  seconds: 20,

  // Idle is a global concept.
  isIdle: false
};

/**
 * Updates the idle state and triggers appropriate actions depending on that
 * state.
 *
 * @param state
 */
function updateIdle(state, tab) {
  // If the state is unchanged, don't bother doing anything.
  if (idle.isIdle === state) {
    return;
  }

  return idle.isIdle ? stop(tab) : start(tab);
}

// Chrome extension have access to the `idle` API which determines if users
// are interacting with the page or not.
if (environment === 'chrome') {
  chrome.idle.setDetectionInterval(idle.seconds);

  // Monitor whether or not the page is considered idle.
  chrome.idle.onStateChanged.addListener(function(newState) {
    getCurrentTab().then(function(tab) {
      updateIdle(newState === 'locked' || newState === 'idle', tab );
    });
  });

  // Monitor whenever the tab is updated to detect for url changes.
  chrome.tabs.onUpdated.addListener(function(tabId, changeInfo) {
    if (tabs[tabId] && tabs[tabId].tab.url !== changeInfo.url) {
      stop(tabs[tabId].tab);
    }
  });

  // Monitor whether or not the content script has detected media idle.
  chrome.runtime.onMessage.addListener(function(req, sender, resp) {
    req = typeof req === 'string' ? JSON.parse(req) : req;

    // Find the current tab, the extension abstraction provides a normalized
    // `tab` object that can be used as the source of truth about the current
    // page.
    getCurrentTab().then(function(tab) {
      if (req.name === 'isIdle') {
        updateIdle(req.data, tab);
      }

      if (req.name === 'author') {
        tabs[tab.id] = {
          author: req.data,
          tab: tab
        };

        // Start the activity when the author information has been discovered.
        start(tab);
      }
    });
  });
}
else if (environment === 'firefox') {
  var queryService = require('chrome').Cc['@mozilla.org/widget/idleservice;1'];
  var idleService = queryService.getService(require('chrome').Ci.nsIIdleService);

  // Doesn't have any decent way to detect idle other than this.
  idle.timeout = require('timer').setInterval(function() {
    // Wait for the idle time to reach the designatd threshold before changing
    // the state.
    if (idleService.idleTime >= (idle.seconds * 1000)) {
      updateIdle(true);
    }
    else {
      updateIdle(false);
    }
  }, 1000);
}

export default idle;
