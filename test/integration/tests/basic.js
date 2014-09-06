describe('extension', function() {
  afterEach(function() {
    return this.extensionDriver.quit();
  });

  it('loads', function() {
    return this.extensionDriver.getTitle().then(function(title) {
      assert.equal(title, 'Tipsy');
    });
  });
});
