'use strict';

import Component from '../../component';
import storage from '../../storage';

function ReminderThreshLocalComponent() {
  Component.prototype.constructor.apply(this, arguments);
  var span = this.$('.remindWhen');
  var input = this.$('input[type=text]');
  span.removeClass('active');
  input.prop('disabled', true);
  var component = this;
  storage.get('settings').then(function(settings) {
    
    if (typeof settings.localThresholdReminderEnabled === 'undefined') {
      settings.localThresholdReminderEnabled = true;
    }
    
    if (typeof settings.reminderThreshLocal === 'undefined') {
      settings.reminderThreshLocal = '$10.00';
    }

    component.localThresholdReminderEnabled = settings.localThresholdReminderEnabled;
    component.reminderThreshLocal = settings.reminderThreshLocal;
    return storage.set('settings', settings);
  }).catch(function(ex) {
    console.log(ex);
    console.log(ex.stack);
  }); 	
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
    var span = this.$('.remindWhen');
    var isChecked = this.$('#threshLocalCheckbox').prop('checked');
    
    if (isChecked) {
      input.prop('disabled', false);
      span.addClass('active');
    } else if (!isChecked) {
      span.removeClass('active');
  	  input.prop('disabled', true);
  	}
  	
  	// update the settings
  	storage.get('settings').then(function(settings) {
        settings.localThresholdReminderEnabled = isChecked;
        return storage.set('settings', settings);
    }).catch(function(ex) {
      console.log(ex);
      console.log(ex.stack);
    });
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
      settings.localReminded = false;
      return storage.set('settings', settings);
    }).catch(function(ex) {
      console.log(ex);
      console.log(ex.stack);
    });
  },


  afterRender: function() {
    // clear the checkboxes first to prevent flashing
    var span = this.$('.remindWhen');
    var input = this.$('input[type=text]');
    span.removeClass('active');
  	input.prop('disabled', true);
  	this.$('#threshLocalCheckbox').prop('checked', false);
    var component = this;

    var isSelected;
    storage.get('settings').then(function(settings) {
      input.val(settings.reminderThreshLocal || component.reminderThreshLocal);
      isSelected = settings.localThresholdReminderEnabled;
      component.localThresholdReminderEnabled = isSelected;
      if (isSelected === true || (typeof isSelected === 'undefined')) {
        component.$('#threshLocalCheckbox').prop('checked', true);
        component.selectedReminderThreshLocal(null);
      } else if(isSelected === false) {
        component.$('#threshLocalCheckbox').prop('checked', false);
        component.selectedReminderThreshLocal(null);
      }  else {
        console.info('error reading if check selected from settings');
      }
    }).catch(function(ex) {
      console.log(ex);
      console.log(ex.stack);
    });
  }
};

ReminderThreshLocalComponent.prototype.__proto__ = Component.prototype;

export default ReminderThreshLocalComponent;
