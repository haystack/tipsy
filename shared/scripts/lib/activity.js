'use strict';

import { environment } from './environment';
import storage from './storage';

// This is a global, because we only work with a single url at a time.  If the
// url changes, it is the responsibility of the consumer of this code to ensure
// that stop was called to write out the value to the storage engine.
var currentUrl;

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
