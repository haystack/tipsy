'use strict';

import Component from '../../component';
import storage from '../../storage';
import { create as createNotification } from '../../notifications';

function RemindersComponent() {
  Component.prototype.constructor.apply(this, arguments);

  var component = this;

  // Find the saved reminder level.
  storage.get('settings').then(function(settings) {
    component.reminderLevel = settings.reminderLevel;

    // Re-render.
    component.render();
  });
}

RemindersComponent.prototype = {
  template: 'components/reminders/reminders.html',

  events: {
    // Whenever the input is updated, update the settings and save.
    'input input[type=range]': 'updateOutputAndSave'
  },

  // Defaults to a month.
  reminderLevel: 2,

  // Converts the level to a number of days.
  reminderLevelToDays: [
    // Daily.
    1,
    // Weekly.
    7,
    // Monthly.
    30,
    // Yearly.
    365
  ],

  serialize: function() {
    // Convert the reminder level (index) to days, using the lookup table.
    var reminderDays = this.reminderLevelToDays[this.reminderLevel];

    // Default to a monthly reminder.
    var monthDefault = moment().add(reminderDays, 'days').calendar();

    return { nextNotified: this.nextNotified || monthDefault };
  },

  updateOutputAndSave: function(ev) {
    var component = this;
    var output = this.$('output');
    var index = ev.target ? ev.target.value : ev;

    // Display the correct output.
    output.find('span').removeClass('active').eq(index).addClass('active');

    return storage.get('settings').then(function(settings) {
      // Find the previously set level.
      var prev = settings.reminderLevel;

      return component.findNext(index, prev).then(function(nextNotified) {
        settings.nextNotified = Number(nextNotified);
        settings.reminderLevel = index || 2;

        return storage.set('settings', settings);
      });
    });
  },

  findNext: function(level, prev) {
    var component = this;
    var days = this.reminderLevelToDays[level];

    return storage.get('settings').then(function(settings) {
      var lastNotified = moment(component.nextNotified);

      // Only change here if the date is different.
      if (lastNotified > moment() && level === prev) {
        return lastNotified;
      }

      // Increment the amount of time, by today + number of days.
      var nextNotified = moment().add(days, 'days');

      // Assign this to the component so it can be referenced.
      component.nextNotified = nextNotified;

      // Update the value in the markup.
      component.$('.next').html(nextNotified.calendar());

      // Schedule the notification.
      createNotification(nextNotified, days);

      return nextNotified;
    });
  },

  afterRender: function() {
    var index = this.reminderLevel;
    var range = this.$('input[type=range]').val(index);
    var output = this.$('output');

    // Display the correct output.
    output.find('span').removeClass('active').eq(index).addClass('active');
  }
};

RemindersComponent.prototype.__proto__ = Component.prototype;

export default RemindersComponent;
