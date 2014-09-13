'use strict';

import { addTrayIcon, addContentScript } from './lib/extension';
import storage from './lib/storage';
import activity from './lib/activity';
import './lib/idle';

// Display the tray icon and open the extension upon being clicked.
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

// Inject a script into all pages when loaded.
addContentScript('js/contentscript.js');
