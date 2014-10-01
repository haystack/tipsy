'use strict';

import Component from '../../component';
import storage from '../../storage';

function RemindersComponent() {
  Component.prototype.constructor.apply(this, arguments);
}

RemindersComponent.prototype = {
  template: 'components/reminders/reminders.html',

  events: {
    'input input[type=range]': 'updateOutputAndSave'
  },

  updateOutputAndSave: function(ev) {
    var output = this.$('output');
    var index = ev.target ? ev.target.value : ev;

    output.find('span').removeClass('active').eq(index).addClass('active');

    storage.get('settings').then(function(settings) {
      settings.reminderLevel = index;
      return storage.set('settings', settings);
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
