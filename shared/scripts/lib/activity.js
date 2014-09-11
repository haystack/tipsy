'use strict';

import { environment } from './environment';

// Chrome extension have access to the `idle` API which determines if users
// are interacting with the page or not.
if (environment === 'chrome') {
  chrome.idle.onStateChanged.addListener(function(newState) {
    //return isIdle(newState === 'locked' || newState === 'idle');
  });
}
