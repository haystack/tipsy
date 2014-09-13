'use strict';

import { environment } from './environment';
import storage from './storage';
import { start, stop } from './activity';

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
function updateIdle(state) {
  // If the state is unchanged, don't bother doing anything.
  if (idle.isIdle === state) {
    return;
  }

  return idle.isIdle ? stop() : start();
}

// Chrome extension have access to the `idle` API which determines if users
// are interacting with the page or not.
if (environment === 'chrome') {
  chrome.idle.setDetectionInterval(idle.seconds);

  // Monitor whether or not the page is considered idle.
  chrome.idle.onStateChanged.addListener(function(newState) {
    updateIdle(newState === 'locked' || newState === 'idle');
  });

  // Monitor whether or not the content script has detected media idle.
  chrome.runtime.onMessage.addListener(function(req, sender, resp) {
    if (req.name === 'isIdle') {
      updateIdle(req.data);
    }
  });
}
else if (environment === 'firefox') {
  var queryService = require('chrome').Cc['@mozilla.org/widget/idleservice;1'];
  var idleService = queryService.getService(chrome.Ci.nsIIdleService);

  // Doesn't have any decent way to detect idle other than this.
  idle.timeout = setInterval(function() {
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
