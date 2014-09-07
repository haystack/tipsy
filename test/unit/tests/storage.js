'use strict';

describe('Storage', function() {
  var storage;
  var localStorage = {};

  before(function() {
    return System.import('./storage').then(function(module) {
      storage = module.default;

      // Stub out the engine to use a plain object.
      storage._engine = function() {
        return localStorage;
      };
    });
  });

  it('is an object', function() {
    assert.equal(typeof storage, 'object');
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
  });

  describe('Mutator', function() {

  });
});
