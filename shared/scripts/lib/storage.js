'use strict';

import { environment } from './environment';

var storage = {
  sync: false
};

/**
 * Sets the synchronization and always coerces to a Boolean.
 *
 * @param {*} sync - Any value that will determine if storage should sync.
 */
storage.setSync = function(sync) {
  this.sync = Boolean(sync);
};

/**
 * Inspects the environment and synchronization settings to determine which
 * object to return for client side storage.
 *
 * @return {Object} storage engine.
 */
storage.engine = function() {
  var engine = null;

  if (environment === 'chrome') {
    engine = chrome.storage[this.sync ? 'sync' : 'local'];

    return {
      // Override the default implementation of `chrome.storage.get`.
      get: function(key, callback) {
        engine.get(key, function(result) {
          callback(result[key]);
        });
      },

      // Use the default implementation of `chrome.storage.set`.
      set: engine.set.bind(engine)
    };
  }
  else if (environment === 'firefox') {
    engine = require('sdk/simple-storage').storage;
 
    return {
      get: function(key, callback) {
        callback(engine[key]);
      },

      set: function(key, value, callback) {
        callback(engine[key] = value);
      }
    };
  }
};

/**
 * Converts an object into a string when being saved.
 *
 * @param {*} subValue
 * @return {*} stringified, only if necessary.
 */
storage.stringify = function(value) {
  if (typeof value !== 'string' && this._serialize) {
    return JSON.stringify(value);
  }

  return value;
};

/**
 * Gets a value or entire object from the storage engine.
 *
 * @param {string} keyPath - Key to look up, can be dot-notation.
 * @return {*} value from storage engine.
 */
storage.get = function(key, callback) {
  var engine = this.engine();

  return new Promise(function(callback) {
    engine.get(key, callback);
  });
};

/**
 * Sets an object into the storage engine.
 *
 * @param key
 * @param value
 * @return
 */
storage.set = function(key, val) {
  var engine = this.engine();
  var store = {};

  store[key] = val;

  return new Promise(function(callback) {
    engine.set(store, callback);
  });
};

export default storage;
