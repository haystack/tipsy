'use strict';

describe('idle', function() {
  it('can get basic page activity', function() {
    this.timeout(20000);

    var driver = this.extensionDriver;

    return driver.get('https://google.com/').then(function() {
      return new Promise(function(resolve, reject) {
        setTimeout(function() {
          driver.back().then(function() {
            return driver.execute(function() {
              return document.querySelector('table').querySelectorAll('td').length;
            }).then(function(length) {
              assert.equal(length, 1);
            });
          }).then(resolve, reject);
        }, 4000);
      });
    })
  });
});
