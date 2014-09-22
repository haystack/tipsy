'use strict';

describe('watcher', function() {
  it('can get basic page activity', function() {
    this.timeout(20000);

    var driver = this.extensionDriver;

    return driver.get('https://google.com/').then(function() {
      return new Promise(function(resolve, reject) {
        setTimeout(function() {
          driver.navigate('html/index.html#log').then(function() {
            console.log(driver.__proto__);
            return driver.execute(function() {
              var table = document.querySelector('table');
              return table.querySelectorAll('tr').length;
            }).then(function(length) {
              assert.equal(length, 1);
            });
          }).then(resolve, reject);
        }, 1000);
      });
    })
  });
});
