'use strict';

import Component from '../../component';
import { select, selectAll } from '../../dom';
import DonationGoalComponent from '../../components/donation-goal/donation-goal';
import ReminderIntervalComponent from '../../components/reminders/reminder-interval';
import ReminderThreshGlobalComponent from '../../components/reminders/reminder-thresh-global';
import ReminderThreshLocalComponent from '../../components/reminders/reminder-thresh-local';
import UserAgreementComponent from '../../components/user-agreement/user-agreement';


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
    new ReminderIntervalComponent(select('set-reminder-interval', this.el)).render();
    new ReminderThreshGlobalComponent(select('set-reminder-thresh-global', this.el)).render();
    new ReminderThreshLocalComponent(select('set-reminder-thresh-local', this.el)).render();
    new UserAgreementComponent(select('set-user-agreement', this.el)).render();
  }
};

SettingsPage.prototype.__proto__ = Component.prototype;

export default SettingsPage;
