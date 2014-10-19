'use strict';

import Component from '../../component';
import storage from '../../storage';

// Reminder levels:
// ----------------

function RemindersComponent() {
  Component.prototype.constructor.apply(this, arguments);

  var component = this;

  // Find the next notify time and render.
  component.findNext(2);
}

RemindersComponent.prototype = {
  template: 'components/reminders/reminders.html',

  events: {
    'input input[type=range]': 'updateOutputAndSave'
  },

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
    var month = moment().add(this.reminderLevelToDays[2], 'days').calendar();

    return {
      nextNotified: this.nextNotified || month
    };
  },

  updateOutputAndSave: function(ev) {
    var component = this;
    var output = this.$('output');
    var index = ev.target ? ev.target.value : ev;

    output.find('span').removeClass('active').eq(index).addClass('active');

    storage.get('settings').then(function(settings) {
      return component.findNext(index).then(function(nextNotified) {
        settings.nextNotified = nextNotified;
        settings.reminderLevel = settings.reminderLevel || 2;

        return storage.set('settings', settings);
      });
    });
  },

  findNext: function(level) {
    var component = this;
    var days = this.reminderLevelToDays[level];

    return storage.get('settings').then(function(settings) {
      var lastNotified = moment(settings.lastNotified);
      var nextNotified = lastNotified.add(days, 'days');

      component.nextNotified = nextNotified.calendar();

      return nextNotified;
    });
  },

  afterRender: function() {
    var input = this.$('input');
    var component = this;

    storage.get('settings').then(function(settings) {
      settings.reminderLevel = settings.reminderLevel || 2;
      input.val(settings.reminderLevel);

      // Update the output and save.
      component.updateOutputAndSave(settings.reminderLevel);
    });
  }
};

RemindersComponent.prototype.__proto__ = Component.prototype;

export default RemindersComponent;
