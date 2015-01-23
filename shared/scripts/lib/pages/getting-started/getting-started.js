'use strict';

import Component from '../../component';
import storage from '../../storage';
import { select } from '../../dom';
import { setDefaults } from '../../defaults';
import DonationGoalComponent from '../../components/donation-goal/donation-goal';
import ReminderIntervalComponent from '../../components/reminders/reminder-interval';
import ReminderThreshLocalComponent from '../../components/reminders/reminder-thresh-local';
import ReminderThreshGlobalComponent from '../../components/reminders/reminder-thresh-global';

function GettingStartedPage() {
  Component.prototype.constructor.apply(this, arguments);

  // Ensure that next is correctly bound.
  this.next = this.next.bind(this);
  
  // set the defaults
  setDefaults();
}

GettingStartedPage.prototype = {
  template: 'pages/getting-started/getting-started.html',

  events: {
    'click .skip': 'skipConfiguration',
    'click .next': 'next',
    'click .previous': 'previous'
  },

  // Determines which direction to go into.
  state: 0,

  // Test code to ensure parity between client and background scripts.
  skipConfiguration: function(ev) {
    ev.stopPropagation();
    ev.preventDefault();

    storage.get('settings').then(function(settings) {
      settings.showLog = true;
      storage.set('settings', settings);

      // Redirect the user to the log page after clicking skip.
      location.hash = '#donations';
    });
  },

  previous: function(ev) {
    ev.preventDefault();
    this.move(--this.state);
  },

  next: function(ev) {
    ev.preventDefault();
    this.move(++this.state);
  },

  move: function(end) {
    var lis = this.$('ol li');

    lis.removeClass('collapse expand');

    // Collapse the previous and expand to the end.
    lis.slice(0, end).addClass('collapse');
    lis.eq(end).addClass('expand');
  },

  afterRender: function() {
    new DonationGoalComponent(select('set-donation-goal', this.el)).render();
    new ReminderIntervalComponent(select('set-reminder-interval', this.el)).render();
    new ReminderThreshLocalComponent(select('set-reminder-thresh-local', this.el)).render();
    new ReminderThreshGlobalComponent(select('set-reminder-thresh-global', this.el)).render();

    setTimeout(function() {
      select('form', this.el).classList.add('fade');
    }.bind(this), 250);
  }
};

GettingStartedPage.prototype.__proto__ = Component.prototype;

export default GettingStartedPage;
