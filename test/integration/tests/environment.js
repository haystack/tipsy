'use strict';

describe('Environment', function() {
  it('can correctly identify', function() {
    var expectedEnvironment = this.environment;

    return this.extensionDriver.getEnvironment().then(function(environment) {
      assert.equal(environment, expectedEnvironment);
    });
  });
});
