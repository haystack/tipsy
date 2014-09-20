'use strict';

import { environment } from './environment';
import storage from './storage';
import { tabs } from './tabs';

/**
 * Ensures that the log key exists for querying and saving.
 */
export function initialize() {
  return storage.get('log').then(function(log) {
    log = log || {};

    return storage.set('log', log);
  });
}

/**
 * start
 *
 * @param {Object} tab - A tab to monitor.
 */
export function start(tab) {
  // Ensure we're working with a tab object, which may or may not already
  // exist.
  var currentTab = tabs[tab.id] || {};

  // Add the tab object and current access time.
  currentTab.accessTime = Date.now();
  currentTab.tab = currentTab.tab || tab;

  tabs[tab.id] = currentTab;
}

/**
 * stop
 *
 * @param {Object} tab - A tab to monitor.
 * @return {Promise} resolves when log has been written to storage engine.
 */
export function stop(tab) {
  // Open access to the current log so that we can append the latest tab entry
  // into it.
  return storage.get('log').then(function(log) {
    // Ensure we're working with a real tab object.
    if (!tab) {
      return;
    }

    // Make sure we've started this tab, otherwise this is an invalid state.
    if (!tabs[tab.id] || !tabs[tab.id].author) {
      return;
    }

    // Only work with HTTP links for now, omits weird `chrome://` urls.
    if (tab.url.indexOf('http') !== 0) {
      return;
    }

    var host = tabs[tab.id].author.hostname;

    // Ensure that the log for this url is an array of entries.
    log[host] = Array.isArray(log[host]) ? log[host] : [];

    // Add the information necessary to render the log and payments correctly.
    log[host].push({
      author: tabs[tab.id].author,
      tab: tab,
      accessTime: tabs[tab.id].accessTime,
      timeSpent: Date.now() - tabs[tab.id].accessTime
    });

    // Write log updates back to the storage engine.
    return storage.set('log', log).then(function() {
      // Remove the tab from the list to monitor.
      delete tabs[tab.id];
    });
  });
}
