'use strict';

describe('Storage', function() {
  var storage = null;
  var localStorage = {};

  before(function() {
    return System.import('./storage').then(function(module) {
      storage = module.default;

      storage._engine = function() {
        return localStorage;
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
    });

    after(function() {
      delete localStorage.nested;
    });

    it('can find nested values', function() {
      assert.ok(storage.get('nested.value.lookup'));
    });

    it('will return null on invalid keypath', function() {
      assert.equal(storage.get('nested.value.failure'), null);
    });

    it('will return null on invalid top level keypath', function() {
      assert.equal(storage.get('failure'), null);
    });

    it('will not error when accessing with invalid dot notation', function() {
      assert.equal(storage.get('failure.extrafailure'), null);
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

      storage.set('nested', testVal);
    });

    after(function() {
      delete localStorage.nested;
    });

    it('can save a simple top level value', function() {
      assert.equal(storage.get('nested'), testVal);
    });

    it('can modify a nested sub value', function() {
      storage.set('nested.value.lookup', false);
      assert.equal(storage.get('nested.value.lookup'), false);
    });

    // TODO This should be patched in the future.
    it('cannot create nested values without invalid parents', function() {
      assert.throws(function() {
        storage.set('wrong.new.value', true);
      });
    });
  });
});
