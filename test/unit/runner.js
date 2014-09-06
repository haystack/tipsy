'use strict';

global.path = require('path');
global.assert = require('assert');
global.loader = require('es6-module-loader');

// Scope the ES6 module paths to the shared/scripts directory.
require('../normalizePaths');
