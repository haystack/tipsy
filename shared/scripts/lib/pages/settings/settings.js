'use strict';

import Component from '../../component';
import { select, selectAll } from '../../dom';
import ProvidersComponent from '../../components/providers/providers';

function SettingsPage() {
  Component.prototype.constructor.apply(this, arguments);
}

SettingsPage.prototype = {
  template: 'pages/settings/settings.html',

  afterRender: function() {
    // Create a scoped log-table component to show the activity.
    this.providers = new ProvidersComponent(select('set-providers', this.el));
    this.providers.render();
  }
};

SettingsPage.prototype.__proto__ = Component.prototype;

export default SettingsPage;
