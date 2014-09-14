'use strict';

import { environment } from './environment';
import storage from './storage';

// This is a global, because we only work with a single url at a time.  If the
// url changes, it is the responsibility of the consumer of this code to ensure
// that stop was called to write out the value to the storage engine.
var currentUrl;

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
 */
export function start(url) {
  currentUrl = url;
}

/**
 * stop
 */
export function stop() {
  storage.set('log', {
    
  });
}
