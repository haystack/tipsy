// Determine the environment.
var env = function() {
  // Is Chrome?
  if (typeof chrome === 'object') {
    return 'chrome';
  }

  // Is FireFox?
  if (navigator.userAgent.indexOf('Firefox') > -1) {
    return 'firefox';
  }
}();
