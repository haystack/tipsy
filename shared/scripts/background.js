'use strict';

import { addTrayIcon } from './lib/extension';

// Ensure the tray icon is displayed and will open the extension upon being
// clicked.
addTrayIcon({
  id: 'tipsy-icon',
  label: 'Launch Tipsy',
  indexUrl: 'html/index.html',

  icon: {
    '19': './img/logo19.png',
    '48': './img/logo48.png',
    '64': './img/logo64.png'
  }
});
