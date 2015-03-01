'use strict';
var Promise = require('promise');

describe('watcher', function() {
  // Within a certain amount of seconds.
  var within = function(actual, expected, seconds) {
    return Math.abs(actual - expected) <= seconds;
  };

  it('can get basic page activity', function() {
    this.timeout(20000);

    var driver = this.extensionDriver;

    return driver.get('https://google.com/').then(function() {
      return new Promise(function(resolve, reject) {
        setTimeout(function() {
          driver.navigate('html/index.html#log')
            .then(function() {
              return driver.refresh();
            })
            .then(function() {
              return driver.click('.show.author');
            })
            .then(function() {
              return driver.execute(function() {
                return document.querySelectorAll('table tr.no-author').length;
              });
            }).then(function(length) {
              assert.equal(length, 1);
            }).then(resolve, reject);
        }, 1000);
      });
    })
  });

  it('can detect author information', function() {
    this.timeout(20000);

    var driver = this.extensionDriver;

    return driver.get('http://tbranyen.com/').then(function() {
      return new Promise(function(resolve, reject) {
        setTimeout(function() {
          driver.navigate('html/index.html#log')
            .then(function() {
              return driver.refresh();
            })
            .then(function() {
              return driver.wait(function() {
                return document.querySelectorAll('.show.author').length;
              })
            })
            .then(function() {
              return driver.click('.show.author');
            })
            .then(function() {
              return driver.execute(function() {
                return document.querySelectorAll('table tr.has-author').length;
              });
            }).then(function(length) {
              assert.equal(length, 1);
            }).then(resolve, reject);
        }, 1000);
      });
    });
  });

  it('will report correct time when page is visited for five seconds', function() {
    this.timeout(20000);

    var driver = this.extensionDriver;
    var delay = Date.now() + 5000;

    return driver.get('http://reddit.com/').then(function() {
      return new Promise(function(resolve) {
        setTimeout(resolve, 5000);
      });
    })
    .then(function() {
      return driver.navigate('html/index.html#log')
    })
    .then(function() {
      return driver.refresh();
    })
    .then(function() {
      return driver.click('.show.author');
    })
    .then(function() {
      return driver.wait(function() {
        var tr =  document.querySelector('[data-host="reddit.com"]');
        if (!tr) { return; }
        return tr.querySelector('.timeSpent').innerHTML;
      });
    })
    .then(function() {
      return driver.execute(function() {
        var tr =  document.querySelector('[data-host="reddit.com"]');
        if (!tr) { return; }
        return tr.querySelector('.timeSpent').innerHTML;
      });
    }).then(function(value) {
      var actual = parseInt(value, 10);

      assert.ok(within(actual, 5, 2), 'Reports the correct time visited' +
        ' within two seconds. expected 5 got: ' + actual.toString());
    });
  });
});
