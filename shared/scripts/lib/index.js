'use strict';

import { environment } from './environment';
import { listen } from './notifications';
import storage from './storage';
import Component from './component';

// Pages.
import GettingStartedPage from './pages/getting-started/getting-started';
import LogPage from './pages/log/log';
import SettingsPage from './pages/settings/settings';
import DonationsPage from './pages/donations/donations';

// Register all pages.
var pages = {
  '#getting-started': GettingStartedPage,
  '#log': LogPage,
  '#settings': SettingsPage,
  '#donations': DonationsPage
};

// Register each page, and swap the pages object value from constructor to
// instance.
Object.keys(pages).forEach(function(selector) {
  pages[selector] = Component.registerPage(selector, pages[selector]);
});

// Start listening for notifications.
listen();

/**
 * Sets the current tab in the extension.
 */
function setTab() {
  var hash = location.hash;
  var page = pages[hash];

  // When opening the extension without a hash determine where to route based
  // on if the end user has already configured the getting started page or not.
  if (!hash) {
    storage.get('settings').then(function(settings) {
      // Update the hash fragment to change pages.
      location.href = settings.showLog ? '#donations' : '#getting-started';
    });
  }
  else {
    // Render the page we're currently on, if we haven't already.
    if (!page.__rendered__) {
      page.render();

      // Mark this page as rendered, so that we do not re-render.
      page.__rendered__ = true;
    }

    // Augment the navigation depending on which page we're on.
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
        $('body').addClass('intro');
      }
    });
  }
}

// Set the correct active tab on load.
setTab();

// Ensure that the tab is changed whenever the hash value is updated.
window.addEventListener('hashchange', setTab, true);
