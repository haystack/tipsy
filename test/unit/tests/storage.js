'use strict';

describe('Storage', function() {
  var Storage;

  before(function() {
    return System.import('./lib/storage').then(function(module) {
      Storage = module;
    });
  });

  it('is an object', function() {
    assert.equal(typeof Storage, 'object');
  });
});
