'use strict';

var assert = require('assert');
var path = require('path');

var webdriver = require('selenium-webdriver');
var RemoteDriver = require('selenium-webdriver/remote');
var FirefoxProfile = require('firefox-profile');
var profile = new FirefoxProfile();

var ExtensionDriver = require('./extension-driver');

var id = 'jid1-onbkbcx9o5ylwa-at-jetpack';

before(function(done) {
  this.timeout(20000);

  var test = this;

  // Load and normalize the paths to all the extensions.
  var extensions = [
    path.resolve('firefox-extension/dist/tipsy.xpi')
  ];

  profile.addExtensions(extensions, function() {
    var capabilities = webdriver.Capabilities.firefox();

    profile.encoded(function(encodedProfile) {
      capabilities.set('firefox_profile', encodedProfile);

      test.driver = new webdriver.Builder()
        .withCapabilities(capabilities)
        .build();

      done();
    });
  });
});

beforeEach(function() {
  this.timeout(20000);
  this.extensionDriver = new ExtensionDriver(this.driver, id);
  return this.extensionDriver.navigate('html/index.html');
});

afterEach(function() {
  return this.extensionDriver.quit();
});

describe('extension', function() {
  it('loads', function() {
    return this.extensionDriver.getTitle().then(function(title) {
      assert.equal(title, 'Tipsy');
    });
  });
});
