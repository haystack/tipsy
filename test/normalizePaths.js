'use strict';

// Save a copy of the original normalize method.
var systemNormalize = loader.System.normalize;

// We only want to globally patch once, so we decorate the normalize function
// with an internal property for checking.
if (!loader.System.normalize.__patched__) {
  // Load modules from the shared/scripts directory.
  loader.System.normalize = function(name, parentName, parentAddress) {
    name = path.join('shared/scripts/', name);
    return systemNormalize.call(this, name, parentName, parentAddress);
  };

  // Mark the custom normalize function.
  loader.System.normalize.__patched__ = true;
}
