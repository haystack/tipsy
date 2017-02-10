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

/**
 * Sets the current tab in the extension.
 */
function setTab() {
  var hash = location.hash;
  var page = pages[hash];
  var params = {};

  // Used for payment redirection.
  var host = localStorage.host;
  var url = localStorage.url;

  // When opening the extension without a hash determine where to route based
  // on if the end user has already configured the getting started page or not.
  if (!hash) {
    if (!location.search) {
      return storage.get('settings').then(function(settings) {
        // Update the hash fragment to change pages.
        location.href = settings.showLog ? '#donations' : '#getting-started';
      });
    }

    params = deparam(location.search.slice(1));

    delete window.localStorage.url;
    delete window.localStorage.host;

    // Coerce to an array, since error sometimes comes back as an array.
    if ([].concat(params.error).indexOf('failure') > -1) {
      // Remove the query string from the url.
      history.replaceState({}, "", location.href.split("?")[0]);

      // Display the error.
      window.alert(params.error_description);

      // Redirect to donations.
      location.href = '#donations';

      return;
    }

    // Otherwise we can assume the payment was successful.  We can now
    // remove all the items from the storage.
    return storage.get('settings').then(function(settings) {
      return storage.get('log').then(function(resp) {
        // Filter out these items.

        resp[host].map(function(entry) {
          if (entry.tab && entry.tab.url === url) {
            entry.paid = true;
          }
        });

        return storage.set('log', resp).then(function() {
          // Remove the query string from the url.
          history.replaceState({}, "", location.href.split("?")[0]);
      
          var amount = Number(params.amount.slice(1));
          settings.totalPaid = settings.totalPaid + amount;
          storage.set('settings', settings);
          
          // Display a success message.
          window.alert('Payment of ' + params.amount + ' to ' + params.email +
            ' was successful');

          // Redirect to donations.
          location.href = '#donations';
        });
      });
    }).catch(function() {
      // Remove the query string from the url.
      history.replaceState({}, "", location.href.split("?")[0]);

      // Redirect to donations.
      location.href = '#donations';
    });
  }
  else {
    // Render the page we're currently on, if we haven't already.
    if (!page.__rendered__) {
      // Mark this page as rendered, so that we do not re-render.
      page.__rendered__ = true;
      page.render();
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

// Use a more precise formatter for huamanize.
// https://github.com/moment/moment/issues/348#issuecomment-6535794
moment.lang('precise-en', {
  relativeTime : {
    future : "in %s",
    past : "%s ago",
    // See: https://github.com/timrwood/moment/pull/232#issuecomment-4699806
    s : "%d seconds",
    m : "a minute",
    mm : "%d minutes",
    h : "an hour",
    hh : "%d hours",
    d : "a day",
    dd : "%d days",
    M : "a month",
    MM : "%d months",
    y : "a year",
    yy : "%d years"
  }
});

// Set this precise formatter globally.
moment.lang('precise-en');
