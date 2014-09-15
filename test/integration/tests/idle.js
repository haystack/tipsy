'use strict';

describe('idle', function() {
  it('can get basic page activity', function() {
    this.timeout(20000);

    return this.extensionDriver.get('https://google.com/').then(function() {
      //setTimeout(function() {
      //  extension._driver.navigate().back().then(resolve, reject);
      //}, 4000);
    })
  });
});
