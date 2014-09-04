describe('extension', function() {
  it('loads', function() {
    return this.extensionDriver.getTitle().then(function(title) {
      assert.equal(title, 'Tipsy');
    });
  });
});
