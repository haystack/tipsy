'use strict';

// Default the environment to null.
var environment = null;

if (typeof chrome === 'object') {
  environment = 'chrome';
}
else if (navigator.userAgent.indexOf('Firefox') > -1) {
  environment = 'firefox';
}

// Expose onto the navigator object for easier testing and lookups.
navigator.environment = environment;

export default environment;
