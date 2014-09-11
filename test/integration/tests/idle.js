'use strict';

describe('idle', function() {
  before(function() {
    return this.extensionDriver.navigate(this.backgroundPage);
  });

  it('works', function() {
    this.extensionDriver.execute(function() {
      return localStorage.test;
    }).then(function(value) {
      assert.equal(value, "true");
    });
  });
});
