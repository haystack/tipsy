'use strict';

global.assert = require('assert');
global.path = require('path');
global.webdriver = require('selenium-webdriver');
global.ExtensionDriver = require('./extension-driver');

after(function() {
  return this.extensionDriver.quit();
});
