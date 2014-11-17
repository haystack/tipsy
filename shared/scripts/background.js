'use strict';

import { createExtension, addContentScript } from './lib/extension';
import { initialize } from './lib/activity';
import './lib/watcher';

// Firefox addons need to be instructed to show an icon.  This call also hooks
// up the click functionality in Chrome.
createExtension({
  id: 'tipsy-icon',
  label: 'Launch Tipsy',
  indexUrl: 'html/index.html',

  icon: {
    '19': './img/logo19.png',
    '48': './img/logo48.png',
    '64': './img/logo64.png'
  },

  // These scripts are dynamically injected with Firefox and ignored in the
  // html.
  scripts: [
    'node_modules/jquery/dist/jquery.js',
    'node_modules/combyne/dist/combyne.js',
    'node_modules/moment/min/moment.min.js',
    'js/tipsy.js'
  ]
});

// Ensure that the activity logger has been initialized before trying to load
// the content script.
initialize().then(function() {
  // Inject a script into all pages when loaded.
  addContentScript('js/contentscript.js');
});
