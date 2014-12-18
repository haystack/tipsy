'use strict';

import Component from '../../component';
import storage from '../../storage';

function ReminderThreshLocalComponent() {
  Component.prototype.constructor.apply(this, arguments);
}

ReminderThreshLocalComponent.prototype = {
  template: 'components/reminders/reminder-thresh-local.html',

  events: {
    'keyup input[type=text]': 'filterInput',
    'blur input[type=text]': 'formatAndSave',
    'change input[type=text]': 'formatAndSave',
    'change input[type=checkbox]': 'selectedReminderThreshLocal'
  },
  
  selectedReminderThreshLocal: function(ev) {
    var input = this.$('input[type=text]');
    var span = this.$('.remindWhen')
    var isChecked = this.$('#threshLocalCheckbox').prop('checked');

    if (isChecked) {
      input.prop('disabled', false);
      var index = this.reminderLevel;
      //console.log(this);
      span.addClass('active');
    } else if (!isChecked) {
      span.removeClass('active')
  	  input.prop('disabled', true);
  	}
  },

  filterInput: function(ev) {
    var val = ev.target.value.replace(/[^0-9.]/g, '');
    this.$('input[type=text]').val('$' + val);
  },

  formatAndSave: function(ev) {
    var component = this;
    var val = ev.target.value.replace(/[^0-9.]/g, '');
    var currency = '$' + parseFloat(val).toFixed(2);

    this.$('input[type=text]').val(currency);

    storage.get('settings').then(function(settings) {
      settings.reminderThreshLocal = currency;

     // component.updateOwe(settings);

      return storage.set('settings', settings);
    });
  },


  afterRender: function() {
    var component = this;
    var input = this.$('input[type=text]');
    //var select = this.$('select');

    storage.get('settings').then(function(settings) {
      input.val(settings.reminderThreshLocal);

    }).catch(function(ex) {
      console.log(ex);
    });
  }
};

ReminderThreshLocalComponent.prototype.__proto__ = Component.prototype;

export default ReminderThreshLocalComponent;
