'use strict';

// Default the environment to null.
export var environment = null;

// If we are in Chrome, there will be a global named `chrome`.
if (typeof chrome === 'object') {
  environment = 'chrome';
}
// For now we're only supporting Chrome or Firefox so this simple inference
// is fine for now.
else {
  environment = 'firefox';
}
