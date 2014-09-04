var path = require('path');
var assert = require('assert');
var loader = require('es6-module-loader');

// Globally expose common objects to simplify authoring tests.
global.assert = assert;
global.System = loader.System;

// Save a copy of the original normalize method.
var systemNormalize = System.normalize;

// Load modules from the shared/scripts directory.
loader.System.normalize = function(name, parentName, parentAddress) {
  name = path.join('shared/scripts/', name);
  return systemNormalize.call(this, name, parentName, parentAddress);
};
