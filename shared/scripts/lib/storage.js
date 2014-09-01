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
 * engine
 *
 * @return
 */
storage.engine = function() {
  return this.sync ? chrome.storage : window.localStorage;
};

/**
 * get
 *
 * @param keyPath
 * @return
 */
storage.get = function(keyPath) {

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
