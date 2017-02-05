'use strict';

var FirefoxProfile = require('firefox-profile');
var profile = new FirefoxProfile();

ExtensionDriver.prototype.navigate = function(url) {
  return this._driver.get('resource://' + this._id + '/tipsy/data/' + url);
};

var id = 'jid1-onbkbcx9o5ylwa-at-jetpack';

before(function(done) {
  this.timeout(20000);
  this.environment = 'firefox';

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

      test.extensionDriver = new ExtensionDriver(test.driver, id);
      test.extensionDriver.navigate('html/index.html').then(done);
    });
  });
});
