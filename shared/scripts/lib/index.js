'use strict';

import { environment } from './environment';
import { select, selectAll } from './dom';
import storage from './storage';

// Stop the links from being active.
var disabledEvent = function(ev) {
  ev.preventDefault();
};

/**
 * Sets the current tab in the extension.
 */
function setTab() {
  // When opening the extension without a hash determine where to route based
  // on if the end user has already configured the getting started page or not.
  if (!location.hash) {
    storage.get('settings').then(function(settings) {
      settings = settings || {};
      location.href = settings.showLog ? '#log' : '#getting-started';
    });
  }

  selectAll('nav a').forEach(function(link) {
    link.classList.remove('active', 'disabled');

    // If we're on the getting started page, disable the links.
    if (location.hash === '#getting-started') {
      link.classList.add('disabled');
      link.addEventListener('click', disabledEvent, true);
    }

    // Otherwise, remove all previous bound event listeners and ensure that the
    // active class is correctly applied.
    else {
      link.removeEventListener('click', disabledEvent, true);

      // Add the new class to the tab link.
      if (link.hash === location.hash) {
        link.classList.add('active');
      }
    }
  });
}

// Set the correct active tab.
setTab();

// Ensure that the tab is changed whenever the hash value is updated.
window.addEventListener('hashchange', setTab, true);

// Test code to ensure parity between client and background scripts.
select('button').addEventListener('click', function(ev) {
  ev.stopPropagation();
  ev.preventDefault();

  storage.get('settings').then(function(settings) {
    settings = settings || {};

    settings.showLog = !settings.showLog;
    storage.set('settings', settings);
    console.log('changed', settings);
  });
}, true);
