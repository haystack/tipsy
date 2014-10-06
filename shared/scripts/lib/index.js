'use strict';

import { environment } from './environment';
import storage from './storage';
import Component from './component';

// Pages.
import GettingStartedPage from './pages/getting-started/getting-started';
import LogPage from './pages/log/log';
import SettingsPage from './pages/settings/settings';
import DonationsPage from './pages/donations/donations';

// Register all pages.
Component.register('#getting-started', GettingStartedPage);
Component.register('#log', LogPage);
Component.register('#settings', SettingsPage);
Component.register('#donations', DonationsPage);

/**
 * Sets the current tab in the extension.
 */
function setTab() {
  var hash = location.hash;

  // When opening the extension without a hash determine where to route based
  // on if the end user has already configured the getting started page or not.
  if (!hash) {
    storage.get('settings').then(function(settings) {
      // Update the hash fragment to change pages.
      location.href = settings.showLog ? '#log' : '#getting-started';
    });
  }
  else {
    $('nav a').each(function() {
      var link = $(this);
      var body = $('body');
      link.removeClass('active');

      if (hash.trim() !== '#getting-started') {
        body.removeClass('intro');

        // Add the new class to the tab link.
        if (link[0].hash === hash) {
          link.addClass('active');
        }
      }
      else {
        $('body').classList.add('intro');
      }
    });
  }
}

// Set the correct active tab.
setTab();

// Ensure that the tab is changed whenever the hash value is updated.
window.addEventListener('hashchange', setTab, true);
