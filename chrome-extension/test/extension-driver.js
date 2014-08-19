'use strict';

var webdriver = require('selenium-webdriver');

function ExtensionDriver(driver, id) {
  this._driver = driver;
  this._id = id;
}

module.exports = ExtensionDriver;

/**
 * Open the application index page.
 *
 * @returns {Promise}
 */
ExtensionDriver.prototype.navigate = function(url) {
  return this._driver.get('chrome-extension://' + this._id + '/' + url);
};

/**
 * Refresh the current page.
 *
 * @returns {Promise}
 */
ExtensionDriver.prototype.refresh = function() {
  var driver = this._driver;

  return driver.getCurrentUrl()
    .then(function(url) {
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
