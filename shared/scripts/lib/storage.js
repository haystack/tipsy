'use strict';

import environment from './environment';

var storage = {};

/**
 * setSync
 *
 * @param sync
 * @return
 */
storage.setSync = function(sync) {
  this.sync = Boolean(sync);
};

/**
 * Ensure that we are always dealing with an Object from the storage engine.
 */
storage._normalizeObject = function(value) {

};

/**
 * Breaks down the dot-notation into parts and finds the deepest value.
 *
 * @param {string} key - In dot-notation or singular top level.
 */
storage._findValue = function(keyPath) {
  var engine = this._engine();
  var parts = keyPath.split('.');

  // No dot-notation in this key.
  if (parts.length === 1) {
    return engine[keyPath];
  }

  return parts.slice(1).reduce(function(previous, current) {
    if (current in previous) {
      return previous[current];
    }
    
    return null;
  }, engine[parts[0]]);
};

/**
 * Inspects the environment and synchronization settings to determine which
 * object to return for client side storage.
 *
 * @return {Object} storage engine.
 */
storage._engine = function() {
  if (this.sync && environment === 'chrome') {
    return chrome.storage;
  }
  
  return window.localStorage;
};

/**
 * Gets a value or entire object from the storage engine.
 *
 * @param {string} keyPath - Key to look up, can be dot-notation.
 * @return {*} value from storage engine.
 */
storage.get = function(keyPath) {
  var engine = this._engine();

  if (!keyPath) {
    throw new Error('Missing a valid keypath.');
  }

  return this._findValue(keyPath);
};

/**
 * set
 *
 * @param keyPath
 * @param value
 * @return
 */
storage.set = function(keyPath, value) {

};

export default storage;
