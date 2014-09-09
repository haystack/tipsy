'use strict';

import { environment } from './environment';
import { select, selectAll } from './dom';
import settings from './settings';

/**
 * Sets the current tab in the extension.
 */
function setTab() {
  // When opening the extension without a hash determine where to route based
  // on if the end user has already configured the getting started page or not.
  if (!location.hash) {
    location.href = settings.showGettingStarted ? '#getting-started' : '#log';
  }

  // If we're on the getting started page, disable the links and don't worry
  // about active classes.
  if (location.hash === '#getting-started') {
    selectAll('nav a').forEach(function(link) {
      link.removeAttribute('href');
      link.classList.add('disabled');
    });
  }

  else {
    // Remove all existing active classes.
    selectAll('nav a').forEach(function(link) {
      link.classList.remove('disabled');
      link.classList.remove('active');
    });

    // Add the new class to the tab link.
    select('nav a[href="' + location.hash + '"]').classList.add('active');
  }
}

// Set the correct active tab.
setTab();

// Ensure that the tab is changed whenever the hash value is updated.
window.addEventListener('hashchange', setTab, true);
