'use strict';

import { environment } from './environment';
import { start, stop } from './activity';
import { getCurrentTab, tabs } from './tabs';
import storage from './storage';
import { defaults } from './defaults';

// Tracks the current pages open in tabs.  Whenever a tab is closed, remove
// from the list.
var idle = {
  // A good default threshold timeout.
  seconds: defaults.idle,

  // Idle is a global concept.
  isIdle: false,

  // Updates the idle state and triggers appropriate actions depending on that
  // state.
  update: function(state, tab) {
    // If the state is unchanged, don't bother doing anything.
    if (this.isIdle === state) {
      return;
    }

    this.isIdle = state;

    // Always update the current tab based on the idle access.
    tabs.lastAccessed = tab.id;

    return this.isIdle ? stop(tab) : start(tab);
  }
};

// Chrome extension have access to the `idle` API which determines if users
// are interacting with the page or not.
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

  // If we are currently idle, do nothing.  If there is no `tabId` do not
  // attempt to make a get call.
  if (idle.isIdle || !tabId) {
    return;
  }

  // Fetch the tab information from Chrome.
  chrome.tabs.get(tabId, function(tab) {
    var lastAccessed = tabs[tabs.lastAccessed];

    // If we have changed the tab from a previous tab, stop tracking on that
    // previous tab.
    if (lastAccessed && tabId !== tabs.lastAccessed) {
      stop(lastAccessed.tab);
    }

    // If this tab is not already being tracked, start it.
    start(tab);

    tabs.lastAccessed = tabId;
  });
});

// Monitor whenever the tab is updated to detect for url changes.
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo) {
  if (idle.isIdle) {
    return;
  }

  // If there is a previous tab we were tracking, and it differs from this
  // one, stop that one in favor of the current.
  if (tabId !== tabs.lastAccessed && tabs[tabs.lastAccessed]) {
    stop(tabs[tabs.lastAccessed].tab);
  }

  else if (tabs[tabId] && changeInfo.url) {
    stop(tabs[tabId].tab);
  }

  else if (tabs[tabId]) {
    start(tabs[tabId]);
  }
});

// When the tab is removed, stop the timer.
chrome.tabs.onRemoved.addListener(function(tabId, changeInfo) {
  var currentAccessed = tabs[tabId];

  if (currentAccessed && currentAccessed.tab && currentAccessed.tab.url !== changeInfo.url) {
    stop(currentAccessed.tab);
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

  var lastAccessed = tabs[tabs.lastAccessed];

  // Stop the last accessed tab if the window is closed.
  if (winId === chrome.windows.WINDOW_ID_NONE) {
    if (lastAccessed) {
      return stop(lastAccessed.tab);
    }
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
