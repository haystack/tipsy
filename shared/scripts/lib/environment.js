'use strict';

// Default the environment to null.
export var environment = null;

if (typeof chrome === 'object') {
  environment = 'chrome';
}
else {
  environment = 'firefox';
}
