'use strict';

import { select, selectAll } from './dom';
import './environment';

/**
 * Sets the current tab in the extension.
 */
function setTab() {
  // Default to the log page if none was specified.
  if (!location.hash) {
    location.href = '#log';
  }

  // Remove all existing active classes.
  selectAll('nav a').forEach(function(link) {
    link.classList.remove('active');
  });

  // Add the new class to the tab link.
  select('nav a[href="' + location.hash + '"]').classList.add('active');
}

// Set the correct active tab.
setTab();

// Ensure that the tab is changed whenever the hash value is updated.
window.addEventListener('hashchange', setTab, true);
