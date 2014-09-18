'use strict';

import Component from '../../component';
import storage from '../../storage';
import { select } from '../../dom';

function GettingStartedPage() {
  Component.prototype.constructor.apply(this, arguments);

  var gettingStarted = this;

  this.render().then(function() {
    // Test code to ensure parity between client and background scripts.
    select('button', gettingStarted.el).addEventListener('click', function(ev) {
      ev.stopPropagation();
      ev.preventDefault();

      storage.get('settings').then(function(settings) {
        settings = settings || {};
        settings.showLog = !settings.showLog;
        storage.set('settings', settings);
      });
    }, true);
  });
}

GettingStartedPage.prototype = {
  template: 'pages/getting-started/getting-started.html'
};

GettingStartedPage.prototype.__proto__ = Component.prototype;

export default GettingStartedPage;
