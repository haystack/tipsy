'use strict';

import Component from '../../component';
import storage from '../../storage';
import { create as createNotification, toDays } from '../../notifications';

/**
 * Represents a Reminders component.
 *
 * Upon initialization, looks into the settings and sets the `reminderLevel`.
 * This value is an index for the visual slider as well as a key for looking
 * up how much time to wait until triggering.
 */
function ReminderIntervalComponent() {
  Component.prototype.constructor.apply(this, arguments);

  var component = this;

  // Find the saved reminder level.
  storage.get('settings').then(function(settings) {
    component.nextNotified = settings.nextNotified;
    component.reminderLevel = settings.reminderLevel;

    // Re-render with this new value set.
    component.render();
  });

  // Whenever the storage engine is updated, do a quick check for updating
  // the next notified time.
  storage.onChange(function() {
    storage.get('settings').then(function(settings) {
      var nextNotified = moment(new Date(settings.nextNotified));

      // Update the value in the markup.
      component.$('.next').html(nextNotified.calendar());
    });
  });
}

ReminderIntervalComponent.prototype = {
  template: 'components/reminders/reminder-interval.html',

  events: {
    // Whenever the input is updated, update the settings and save.
    'change input[type=checkbox]': 'selectedReminderInterval',
    'input input[type=range]': 'updateOutputAndSave'
  },

  filters: [
    'calendar'
  ],

  calendar: function(val) {
    return moment(new Date(val)).calendar();
  },

  // Defaults to a month, you can look up the association inside the
  // notifications module for the mapping of levels to days.
  reminderLevel: 2,

  /**
   * The usable data within the template.
   *
   * @return {Object} Containing the template data.
   */
  serialize: function() {
    // Convert the reminder level (index) to days, using the lookup table.
    var reminderDays = toDays[this.reminderLevel];

    // Default to a monthly reminder.
    var monthDefault = moment().add(reminderDays, 'days').calendar();

    // Use the stored next notified date, or the default.
    return { nextNotified: this.nextNotified || monthDefault };
  },
  
  selectedReminderInterval: function(ev) {
    var range = this.$('input[type=range]');
    var output = this.$('output');
    var isChecked = this.$('#intervalCheckbox').prop('checked');

    if (isChecked) {
      range.prop('disabled', false);
      var index = this.reminderLevel;
      console.log(this);
      output.find('span').removeClass('active').eq(index).addClass('active');
    } else if (!isChecked) {
      output.find('span').removeClass('active')
  	  range.prop('disabled', true);
  	}
  },

  /**
   * Updates the notification time and saves the settings.
   *
   * @param {Object} ev - A jQuery event object.
   * @return {Promise} That resolves once the settings have been updated.
   */
  updateOutputAndSave: function(ev) {
    var component = this;
    var output = this.$('output');
    var index = ev.target ? ev.target.value : ev;
	this.reminderLevel = index;
    // Display the correct output.
    output.find('span').removeClass('active').eq(index).addClass('active');

    return storage.get('settings').then(function(settings) {
      // Find the previously set level.
      var prev = settings.reminderLevel;

      // Find the next notified time.
      var lastNotified = moment(new Date(component.nextNotified));

      // Get the number of days associated at this level.
      var days = toDays[index];

      // Increment the amount of time, by today + number of days.
      var nextNotified = moment().add(days, 'days');

      // If in testing mode, default to a minute to make things easier.
      if (localStorage.testing === 'true') {
        nextNotified = moment().add(1, 'minutes');
      }

      // Only change here if the level is different.
      if (index !== prev) {
        // Assign this to the component so it can be referenced.
        component.nextNotified = nextNotified;

        // Update the value in the markup.
        component.$('.next').html(nextNotified.calendar());

        // Schedule the notification.
        createNotification(nextNotified, days);

        console.info('Created new notification at:' + nextNotified);
      }

      // Set the new notification time and the reminder level.
      settings.nextNotified = Number(nextNotified);
      settings.reminderLevel = index || 2;

      return storage.set('settings', settings);
    }).catch(function(ex) {
      console.log(ex);
      console.log(ex.stack);
    });
  },

  /**
   * Updates the visual display of the template reflecting the data.
   */
  afterRender: function() {
    //console.log(this.reminderLevel);
    var index = this.reminderLevel;
    var range = this.$('input[type=range]').val(index);
    var output = this.$('output');

    // Display the correct output.
    output.find('span').removeClass('active').eq(index).addClass('active');
  }
};

ReminderIntervalComponent.prototype.__proto__ = Component.prototype;

export default ReminderIntervalComponent;
