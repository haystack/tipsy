'use strict';

import Component from '../../component';
import storage from '../../storage';
import { select } from '../../dom';

function GettingStartedPage() {
  Component.prototype.constructor.apply(this, arguments);
}

GettingStartedPage.prototype = {
  template: 'pages/getting-started/getting-started.html',

  render: function() {
    return Component.prototype.render.apply(this, arguments)
      .then(this.afterRender.bind(this));
  },

  afterRender: function() {
    // Test code to ensure parity between client and background scripts.
    //select('button', this.el).addEventListener('click', function(ev) {
    //  ev.stopPropagation();
    //  ev.preventDefault();

    //  storage.get('settings').then(function(settings) {
    //    settings = settings || {};
    //    settings.showLog = !settings.showLog;
    //    storage.set('settings', settings);
    //  });
    //}, true);

    setTimeout(function() {
      select('form', this.el).classList.add('fade');
    }.bind(this), 250);
  }
};

GettingStartedPage.prototype.__proto__ = Component.prototype;

export default GettingStartedPage;
