import storage from './storage';

var defaults = {
  method: null,
  threshold: null,
  maxPayment: null,
  metricAmount: null,
  metricTimeSpan: null,
  calculateSince: null,
  remindMeNum: null,
  remindMePeriod: null,
  reached: false
};

/**
 * Hooks up a meta property to the settings object that is completely dynamic
 * and proxies into the storage engine.
 *
 * @param key
 * @param memo
 * @return
 */
function proxySettings(memo, key) {
  Object.defineProperty(memo, key, {
    get: function() {
      return storage.get('setting.' + key) || defaults[key];
    },

    set: function(value) {
      storage.set('setting.' + key, value);
    }
  });

  return memo;
}

export default Object.keys(defaults).reduce(proxySettings, {});
