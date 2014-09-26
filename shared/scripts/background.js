'use strict';

import { createExtension, addContentScript } from './lib/extension';
import { initialize } from './lib/activity';
import './lib/watcher';

// Display the tray icon and open the extension upon being clicked.
createExtension({
  id: 'tipsy-icon',
  label: 'Launch Tipsy',
  indexUrl: 'html/index.html',

  icon: {
    '19': './img/logo19.png',
    '48': './img/logo48.png',
    '64': './img/logo64.png'
  },

  scripts: [
    'node_modules/jquery/dist/jquery.js',
    'node_modules/combyne/dist/combyne.js',
    'node_modules/moment/min/moment.min.js',
    'node_modules/fuse.js/src/fuse.js',
    'js/tipsy.js'
  ]
});

// Ensure that the activity logger has been initialized before trying to load
// the content script.
initialize().then(function() {
  // Inject a script into all pages when loaded.
  addContentScript('js/contentscript.js');
});
