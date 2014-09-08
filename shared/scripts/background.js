'use strict';

import Extension from './lib/extension';

// Create a new extension instance.
var extension = new Extension({
  indexUrl: 'html/index.html'
});

// Ensure the tray icon is displayed and will open the extension upon being
// clicked.
extension.addTrayIcon({
  id: 'tipsy-icon',
  label: 'Launch Tipsy',
  url: 'html/index.html',
  icon: {
    '19': './img/logo19.png',
    '48': './img/logo48.png',
    '64': './img/logo64.png'
  }
});
