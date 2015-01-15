'use strict';

import Component from '../../component';
import storage from '../../storage';

function ReminderThreshGlobalComponent() {
  Component.prototype.constructor.apply(this, arguments);
  var span = this.$('.remindWhen');
  var input = this.$('input[type=text]');
  span.removeClass('active');
  input.prop('disabled', true);
  var component = this;
  storage.get('settings').then(function(settings) {
    
    if (typeof settings.globalThresholdReminderEnabled === 'undefined') {
      settings.globalThresholdReminderEnabled = true;
    }
    
    if (typeof settings.reminderThreshGlobal === 'undefined') {
      settings.reminderThreshGlobal = '$10.00';
    }
    
    component.globalThresholdReminderEnabled = settings.globalThresholdReminderEnabled;
    component.reminderThreshGlobal = settings.reminderThreshGlobal;
  
  }).catch(function(ex) {
      console.log(ex);
      console.log(ex.stack);
  });
}

ReminderThreshGlobalComponent.prototype = {
  template: 'components/reminders/reminder-thresh-global.html',

  events: {
    'keyup input[type=text]': 'filterInput',
    'blur input[type=text]': 'formatAndSave',
    'change input[type=text]': 'formatAndSave',
    'change input[type=checkbox]': 'selectedReminderThreshGlobal'
  },
  
  selectedReminderThreshGlobal: function(ev) {  
    var input = this.$('input[type=text]');
    var span = this.$('.remindWhen');
    var isChecked = this.$('#threshGlobalCheckbox').prop('checked');

    if (isChecked) {
      input.prop('disabled', false);
      span.addClass('active');
    } else if (!isChecked) {
      span.removeClass('active');
  	  input.prop('disabled', true);
  	}
  	
  	// update the settings
  	storage.get('settings').then(function(settings) {
        settings.globalThresholdReminderEnabled = isChecked;
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
      settings.reminderThreshGlobal = currency;
      return storage.set('settings', settings);
    });
  },


  afterRender: function() {
    // clear the checkboxes first to prevent flashing
    var span = this.$('.remindWhen');
    var input = this.$('input[type=text]');
    span.removeClass('active');
  	input.prop('disabled', true);
  	this.$('#threshGlobalCheckbox').prop('checked', false);
    var component = this;

    var isSelected;
    storage.get('settings').then(function(settings) {
      input.val(settings.reminderThreshGlobal || component.reminderThreshGlobal);
      isSelected = settings.globalThresholdReminderEnabled;
      component.globalThresholdReminderEnabled = isSelected;
      if (isSelected === true || (typeof isSelected === 'undefined')) {
        component.$('#threshGlobalCheckbox').prop('checked', true);
        component.selectedReminderThreshGlobal(null);
      } else if(isSelected === false) {
        component.$('#threshGlobalCheckbox').prop('checked', false);
        component.selectedReminderThreshGlobal(null);
      }  else {
        console.info('error reading if check selected from settings');
      }
    }).catch(function(ex) {
      console.log(ex);
    });
  }
};

ReminderThreshGlobalComponent.prototype.__proto__ = Component.prototype;

export default ReminderThreshGlobalComponent;
