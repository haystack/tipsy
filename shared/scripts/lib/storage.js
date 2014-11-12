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
          if (!result[key]) {
            callback({});
          }
          else {
            callback(result[key]);
          }
        });
      },

      // Use the default implementation of `chrome.storage.set`.
      set: engine.set.bind(engine),

      // Whenever the engine has data updated trigger the callback.
      onChange: function(callback) {
        chrome.storage.onChanged.addListener(callback);
      }
    };
  }
  else if (environment === 'firefox') {
    try {
      engine = require('sdk/simple-storage');
    }
    catch (unhandledException) {}

    return {
      get: function(key, callback) {
        if (typeof self === 'undefined' || !self.port) {
          return callback(engine.storage[key] || {});
        }

        self.port.emit('storage.get', key);
        self.port.once('storage.get', function(result) {
          callback(result || {});
        });
      },

      set: function(object, callback) {
        // The only key is the actual key name.
        var key = Object.keys(object)[0];

        if (typeof self === 'undefined' || !self.port) {
          engine.storage[key] = object[key];
          return callback();
        }

        self.port.emit('storage.set', { key: key, value: object[key] });
        self.port.once('storage.set', callback);

        if (this.onChangeCallback) {
          this.onChangeCallback();
        }
      },

      // At the moment we can know if data is updated when set is called.
      onChange: function(callback) {
        this.onChangeCallback = callback;
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
storage.get = function(key) {
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

/**
 * Trigger a callback when the storage changes.
 *
 * @param callback
 * @return
 */
storage.onChange = function(callback) {
  this.engine().onChange(callback);
};

export default storage;
