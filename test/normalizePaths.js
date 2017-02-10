'use strict';

var Promise = require('promise');

// Save a copy of the original normalize method.
var systemNormalize = loader.System.normalize;

// If we are using Traceur-compiled Istanbul-instrumented code import as CJS.
if (process.env.CODE_COV) {
  System.import = function(name) {
    return new Promise(function(resolve) {
      resolve(
        require(path.join(__dirname, 'coverage/instrument/shared/scripts/lib', name))
      );
    });
  };
}
// Otherwise augment the normalize method to load scripts as ES6 modules.
else {
  // We only want to globally patch once, so we decorate the normalize function
  // with an internal property for checking.
  if (!loader.System.normalize.__patched__) {
    loader.System.baseURL = path.join('file:', __dirname, '../shared/scripts/lib');

    // Load modules from the shared/scripts directory.
    loader.System.normalize = function(name, parentName, parentAddress) {
      name = path.join('lib/', name);
      return systemNormalize.call(this, name, parentName, parentAddress);
    };

    // Mark the custom normalize function.
    loader.System.normalize.__patched__ = true;
  }
}
