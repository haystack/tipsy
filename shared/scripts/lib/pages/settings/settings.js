'use strict';

import Component from '../../component';
import { select, selectAll } from '../../dom';
import ProvidersComponent from '../../components/providers/providers';
import DonationGoalComponent from '../../components/donation-goal/donation-goal';

function SettingsPage() {
  Component.prototype.constructor.apply(this, arguments);
}

SettingsPage.prototype = {
  template: 'pages/settings/settings.html',

  afterRender: function() {
    new ProvidersComponent(select('set-providers', this.el)).render();
    new DonationGoalComponent(select('set-donation-goal', this.el)).render();
  }
};

SettingsPage.prototype.__proto__ = Component.prototype;

export default SettingsPage;
