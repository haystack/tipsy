function Storage() {

}

/**
 * setSync
 *
 * @param sync
 * @return
 */
Storage.prototype.setSync = function(sync) {
  this.sync = Boolean(sync);
};

/**
 * engine
 *
 * @return
 */
Storage.prototype.engine = function() {
  return this.sync ? chrome.storage : window.localStorage;
};

/**
 * get
 *
 * @param keyPath
 * @return
 */
Storage.prototype.get = function(keyPath) {

};

/**
 * set
 *
 * @param keyPath
 * @param value
 * @return
 */
Storage.prototype.set = function(keyPath, value) {

};

export default Storage;
