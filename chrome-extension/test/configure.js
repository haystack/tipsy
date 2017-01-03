'use strict';

var chrome = require('selenium-webdriver/chrome');
var chromeDriver = require('chromedriver');

ExtensionDriver.prototype.navigate = function(url) {
  return this._driver.get('chrome-extension://' + this._id + '/' + url);
};

var id = 'bpngoepojmffegnjicpfjcakgajpmenk';

before(function(done) {
  this.timeout(20000);
  this.environment = 'chrome';

  var test = this;

  var service = new chrome.ServiceBuilder(chromeDriver.path).build();
  chrome.setDefaultService(service);

  var options = new chrome.Options();
  options.addExtensions(path.resolve('chrome-extension/dist/tipsy.crx'), function() {
    test.driver = new chrome.Driver(options, service);
    //driver.manage().timeouts().implicitlyWait(1000);
    test.extensionDriver = new ExtensionDriver(test.driver, id);
    test.extensionDriver.navigate('html/index.html').then(done);
  });
});
