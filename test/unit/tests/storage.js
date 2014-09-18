'use strict';

describe('Storage', function() {
  var storage = null;
  var localStorage = {};

  before(function() {
    return System.import('./storage').then(function(module) {
      storage = module.default;

      storage.engine = function() {
        return {
          get: function(key, callback) {
            callback(localStorage[key]);
          },

          set: function(object, callback) {
            var key = Object.keys(object)[0]; 
            localStorage[key] = object[key];
            callback();
          }
        };
      };
    });
  });

  it('is an object', function() {
    assert.equal(typeof storage, 'object');
  });

  describe('Synchronization', function() {
    after(function() {
      delete storage.sync;
    });

    it('defaults to false', function() {
      assert.equal(storage.sync, false);
    });

    it('can enable synchronization', function() {
      storage.setSync(true);
      assert.equal(storage.sync, true);
    });

    it('can disable synchronization', function() {
      storage.setSync(false);
      assert.equal(storage.sync, false);
    });

    it('can coerce non-boolean values', function() {
      storage.setSync(undefined);
      assert.equal(storage.sync, false);

      storage.setSync(1);
      assert.equal(storage.sync, true);
    });
  });

  describe('Accessor', function() {
    before(function() {
      localStorage.nested = {
        value: {
          lookup: true
        }
      };

      localStorage.primative = 'test';
    });

    after(function() {
      delete localStorage.nested;
      delete localStorage.primative;
    });

    it('can get an object value', function() {
      return storage.get('nested').then(function(nested) {
        assert.ok(nested.value.lookup);
      });
    });

    it('can get a primative value', function() {
      return storage.get('primative').then(function(primative) {
        assert.equal(primative, 'test');
      });
    });

    it('will not error when accessing an invalid value', function() {
      return storage.get('invalid').then(function(invalid) {
        assert.equal(invalid, undefined);
      });
    });
  });

  describe('Mutator', function() {
    var testVal = null;

    before(function() {
      testVal = {
        value: {
          lookup: true
        }
      };

      return storage.set('nested', testVal);
    });

    after(function() {
      delete localStorage.nested;
    });

    it('can save a simple top level value', function() {
      return storage.get('nested').then(function(nested) {
        assert.deepEqual(nested, testVal);
      });
    });

    it('can modify a nested sub value', function() {
      return storage.set('nested', {
        value: {
          lookup: false
        }
      }).then(function() {
        return storage.get('nested').then(function(nested) {
          assert.equal(nested.value.lookup, false);
        });
      });
    });
  });
});
