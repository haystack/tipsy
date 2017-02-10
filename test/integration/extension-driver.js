'use strict';

var webdriver = require('selenium-webdriver');

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

ExtensionDriver.prototype.execute = function(fn, arg1) {
  return this._driver.executeScript(fn, arg1);
};

ExtensionDriver.prototype.back = function() {
  return this._driver.navigate().back();
};

ExtensionDriver.prototype.get = function(url) {
  return this._driver.get(url);
};

ExtensionDriver.prototype.click = function(selector) {
  var driver = this._driver;

  return this.wait(function(selector) {
    return document.querySelectorAll(selector).length;
  }, selector).then(function() {
    return driver.findElement(webdriver.By.css(selector)).click();
  });
};

ExtensionDriver.prototype.wait = function(fn, arg1) {
  return this._driver.wait(function() {
    return this.execute(fn, arg1);
  }.bind(this));
};
