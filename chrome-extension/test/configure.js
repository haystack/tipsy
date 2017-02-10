'use strict';

var chrome = require('selenium-webdriver/chrome');
var chromeDriver = require('chromedriver');

ExtensionDriver.prototype.navigate = function(url) {
  return this._driver.get('chrome-extension://' + this._id + '/' + url);
};

var id = 'bpngoepojmffegnjicpfjcakgajpmenk';

before(function() {
  this.timeout(20000);
  this.environment = 'chrome';

  chrome.setDefaultService(
    new chrome.ServiceBuilder(chromeDriver.path).build()
  );

  var options = new chrome.Options();
  options.addExtensions(path.resolve('chrome-extension/dist/tipsy.crx'));

  var driver = chrome.createDriver(options);

  driver.manage().timeouts().implicitlyWait(10000);
  this.extensionDriver = new ExtensionDriver(driver, id);

  return this.extensionDriver.navigate('html/index.html');
});
