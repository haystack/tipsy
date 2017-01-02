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

  var service = new chrome.ServiceBuilder(chromeDriver.path).build();
  chrome.setDefaultService(service);

  var options = new chrome.Options();
  options.addExtensions(path.resolve('chrome-extension/dist/tipsy.crx'));

  var driver = new chrome.Driver(options, service);

  driver.manage().timeouts().implicitlyWait(10000);
  this.extensionDriver = new ExtensionDriver(driver, id);

  return this.extensionDriver.navigate('html/index.html');
});
