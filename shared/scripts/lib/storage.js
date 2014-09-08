'use strict';

import environment from './environment';

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
 * Ensure that we are always dealing with an Object from the storage engine.
 *
 * @param {*} value - Extracted from engine per key.
 * @return {Object} a normalized object.
 */
storage._parse = function(value) {
  if (typeof value === 'string') {
    return JSON.parse(value);
  }

  return value;
};

/**
 * Converts an object into a string when being saved.
 *
 * @param {*} subValue
 * @return {*} stringified, only if necessary.
 */
storage._stringify = function(value) {
  if (typeof value !== 'string' && this._serialize) {
    return JSON.stringify(value);
  }

  return value;
};

/**
 * Breaks down the dot-notation into parts and finds the deepest value.
 *
 * @param {string} key - In dot-notation or singular top level.
 */
storage._findValue = function(keyPath) {
  var engine = this._engine();
  var parts = keyPath.split('.');
  var firstKey = parts[0];
  var lastKey = parts[parts.length - 1];

  // Ensure that we are always dealing with a top level object.
  var root = this._parse(engine[firstKey]);

  // Grab a subset of keys up to the second-to-last key.  This allows this
  // function to be reusable for serialization.
  var secondToLast = parts.slice(1, -1).reduce(function(previous, current) {
    return current in previous ? previous[current] : null;
  }, root);

  return {
    // Grab the last value used for parsing, either the second to last or the
    // root value.
    finalValue: parts.length > 1 ? secondToLast[lastKey] : root,

    // Send this back as the reference necessary to top level serialize.
    root: root,

    // Send back the second-to-last value for assignment pre-serialization.
    secondToLast: secondToLast,

    // This is necessary to serialize the top level.  No need to reparse.
    firstKey: firstKey,

    // This is necessary to assign the value inside `set`.  No need to reparse.
    lastKey: lastKey
  };
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

  // LocalStorage does not handle object values, so we need a value to
  // determine whether or not to stringify later.
  this._serialize = true;

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

  var state = this._findValue(keyPath);
  return state ? state.finalValue : state;
};

/**
 * set
 *
 * @param keyPath
 * @param value
 * @return
 */
storage.set = function(keyPath, value) {
  var engine = this._engine();

  if (!keyPath) {
    throw new Error('Missing a valid keypath.');
  }

  // Get the current state of the object.
  var state = this._findValue(keyPath);
  // Need to modify the second-to-last key in order to make the assignment.
  var secondToLast = state.secondToLast;

  if (secondToLast) {
    // Set the state of the object.
    secondToLast[state.lastKey] = value;
  }

  // Serialize the root value back to the top level key, or the value if there
  // was no nested value.
  engine[state.firstKey] = this._stringify(secondToLast ? state.root : value);
};

export default storage;
