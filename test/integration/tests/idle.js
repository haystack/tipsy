'use strict';

describe('idle', function() {
  before(function() {
    return this.extensionDriver.navigate(this.backgroundPage);
  });

  it('can get basic page activity', function() {
    this.timeout(20000);

    return this.extensionDriver.navigateExternal();
  });
});
