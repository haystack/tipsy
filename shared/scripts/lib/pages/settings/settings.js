'use strict';

import Component from '../../component';
import { select, selectAll } from '../../dom';
import DonationGoalComponent from '../../components/donation-goal/donation-goal';
import RemindersComponent from '../../components/reminders/reminders';

function SettingsPage() {
  Component.prototype.constructor.apply(this, arguments);
}

SettingsPage.prototype = {
  template: 'pages/settings/settings.html',

  events: {
    'submit form': 'cancelForm'
  },

  cancelForm: function(ev) {
    ev.preventDefault();
  },

  afterRender: function() {
    new DonationGoalComponent(select('set-donation-goal', this.el)).render();
    new RemindersComponent(select('set-reminders', this.el)).render();
  }
};

SettingsPage.prototype.__proto__ = Component.prototype;

export default SettingsPage;
