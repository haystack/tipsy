'use strict';

import { createExtension } from './lib/extension';
import { initialize } from './lib/activity';
import './lib/watcher';

// This call hooks up the click functionality in Chrome.
createExtension({
  id: 'tipsy-icon',
  label: 'Launch Tipsy',
  indexUrl: 'html/index.html',

  icon: {
    '19': './img/logo19.png',
    '48': './img/logo48.png',
    '64': './img/logo64.png'
  }
});

// Ensure that the activity logger has been initialized before trying to load
// the content script.
initialize();
