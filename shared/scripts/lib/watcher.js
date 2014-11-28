'use strict';

import { environment } from './environment';
import { start, stop } from './activity';
import { getCurrentTab, tabs } from './tabs';
import storage from './storage';

// Tracks the current pages open in tabs.  Whenever a tab is closed, remove
// from the list.
var idle = {
  // A good default threshold timeout.
  seconds: 20,

  // Idle is a global concept.
  isIdle: false,

  // Updates the idle state and triggers appropriate actions depending on that
  // state.
  update: function(state, tab) {
    // If the state is unchanged, don't bother doing anything.
    if (this.isIdle === state) {
      return;
    }

    // Always update the current tab based on the idle access.
    tabs.lastAccessed = tab.id;

    return this.isIdle ? stop(tab) : start(tab);
  }
};

// Chrome extension have access to the `idle` API which determines if users
// are interacting with the page or not.
if (environment === 'chrome') {
  chrome.idle.setDetectionInterval(idle.seconds);

  // Monitor whether or not the page is considered idle.
  chrome.idle.onStateChanged.addListener(function(newState) {
    getCurrentTab().then(function(tab) {
      idle.update(newState === 'locked' || newState === 'idle', tab);
    });
  });

  // Called when focus is moved to a new tab.
  chrome.tabs.onActivated.addListener(function(tabInfo) {
    var tabId = tabInfo.tabId;

    // If we are currently idle, do nothing.
    if (idle.isIdle) {
      return;
    }

    // Fetch the tab information from Chrome.
    chrome.tabs.get(tabId, function(tab) {
      if (tabs[tabId] && tabId !== tabs.lastAccessed) {
        stop(tabs[tabs.lastAccessed].tab);
      }

      // If this tab is not already being tracked, start it.
      if (!tabs[tabId]) {
        start(tab);
      }

      tabs.lastAccessed = tabId;
    });
  });

  // Monitor whenever the tab is updated to detect for url changes.
  chrome.tabs.onUpdated.addListener(function(tabId, changeInfo) {
    // If we are currently idle, do nothing.
    if (idle.isIdle) {
      return;
    }

    // If there is a previous tab we were tracking, and it differs from this
    // one, stop that one in favor of the current.
    if (tabId !== tabs.lastAccessed && tabs[tabs.lastAccessed]) {
      stop(tabs[tabId].tab);
    }

    else if (tabs[tabId] && changeInfo.url) {
      stop(tabs[tabId].tab);
    }
  });

  // When the tab is removed, stop the timer.
  chrome.tabs.onRemoved.addListener(function(tabId, changeInfo) {
    if (tabs[tabId] && tabs[tabId].tab.url !== changeInfo.url) {
      stop(tabs[tabId].tab);
    }
  });

  // Called when the window has changed.
  // Has two cases:
  //
  // 1) left chrome: must update last visited time spent.
  // 2) opened window: must create or update new entry.
  //
  // Edit: This actually triggers more often that the previous two assertions.
  // This triggers whenever the focus changes, so if you move your mouse in and
  // out of a window it will trigger.
  chrome.windows.onFocusChanged.addListener(function(winId) {
    // If we are currently idle, do nothing.
    if (idle.isIdle) {
      return;
    }

    // Stop the last accessed tab if the window is closed.
    if (winId === chrome.windows.WINDOW_ID_NONE) {
      return stop(tabs[tabs.lastAccessed].tab);
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
        console.log('hit');
        idle.update(req.data, tab);
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
  require('sdk/tabs').on('ready', function(tab) {
    var id = tab.id;

    if (tabs[id] && tabs[id].tab.url !== tab.url) {
      stop(tabs[id].tab);
    }

    if (tabs[tab.id]) {
      start(tabs[id].tab);
    }

    tab.on('locationChange', function() {
      stop(tabs[id].tab);
    });

    tab.on('close', function() {
      stop(tabs[id].tab);
    });
  });

  var queryService = require('chrome').Cc['@mozilla.org/widget/idleservice;1'];
  var idleService = queryService.getService(require('chrome').Ci.nsIIdleService);

  // Doesn't have any decent way to detect idle other than this.
  idle.timeout = require('sdk/timers').setInterval(function() {
    getCurrentTab().then(function(tab) {
      // Wait for the idle time to reach the designatd threshold before
      // changing the state.
      if (idleService.idleTime >= (idle.seconds * 1000)) {
        idle.update(true, tab);
      }
      else {
        idle.update(false, tab);
      }
    });
  }, 1000);
}
