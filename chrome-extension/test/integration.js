'use strict';

var assert = require('assert');
var path = require('path');

var webdriver = require('selenium-webdriver');
var chrome = require('selenium-webdriver/chrome');
var chromeDriver = require('selenium-chromedriver');

var ExtensionDriver = require('./extension-driver');

var id = 'bpngoepojmffegnjicpfjcakgajpmenk';

beforeEach(function() {
  this.timeout(20000);

  chrome.setDefaultService(
    new chrome.ServiceBuilder(chromeDriver.path).build()
  );

  var options = new chrome.Options();
  options.addExtensions(path.resolve('chrome-extension/dist/tipsy.crx'));

  var driver = chrome.createDriver(options);

  driver.manage().timeouts().implicitlyWait(1000);
  this.extensionDriver = new ExtensionDriver(driver, id);
  return this.extensionDriver.navigate('html/logPage.html');
});

afterEach(function() {
  return this.extensionDriver.quit();
});

describe('extension', function() {
  it('works', function() {
    return this.extensionDriver.getTitle().then(function(title) {
      assert.equal(title, 'Tipsy');
    });
  });
});
