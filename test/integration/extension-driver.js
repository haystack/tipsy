'use strict';

function ExtensionDriver(driver, id) {
  this._driver = driver;
  this._id = id;
}

module.exports = ExtensionDriver;

/**
 * Refresh the current page.
 *
 * @returns {Promise}
 */
ExtensionDriver.prototype.refresh = function() {
  var driver = this._driver;

  return driver.getCurrentUrl().then(function(url) {
    return driver.get(url);
  });
};

/**
 * Quit the current browsing session. The Todo instance will no longer be valid
 * after this command completes.
 *
 * @returns {Promise}
 */
ExtensionDriver.prototype.quit = function() {
  return this._driver.quit();
};

ExtensionDriver.prototype.getTitle = function() {
  return this._driver.getTitle();
};

ExtensionDriver.prototype.getEnvironment = function() {
  return this.execute(function() {
    return navigator.environment;
  });
};

ExtensionDriver.prototype.execute = function(fn) {
  return this._driver.executeScript(fn);
};

ExtensionDriver.prototype.back = function() {
  return this._driver.navigate().back();
};

ExtensionDriver.prototype.get = function(url) {
  return this._driver.get(url);
};

ExtensionDriver.prototype.wait = function(fn) {
  return this._driver.wait(function() {
    return this.execute(fn);
  }.bind(this));
};
