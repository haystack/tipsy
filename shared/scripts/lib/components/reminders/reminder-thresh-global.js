'use strict';

import Component from '../../component';
import storage from '../../storage';

function ReminderThreshGlobalComponent() {
  Component.prototype.constructor.apply(this, arguments);
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
    var span = this.$('.remindWhen')
    var isChecked = this.$('#threshGlobalCheckbox').prop('checked');

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
      settings.reminderThreshGlobal = currency;

     // component.updateOwe(settings);

      return storage.set('settings', settings);
    });
  },
  
  /*
  updateRateDescription: function(id) {
  	if (id == "browsingRateRadio") {
  	  this.$('.avgTime').text("browsing ");
  	}
  	else if (id == "calendarRateRadio") {
  	  this.$('.avgTime').text("on a page ");
  	}
  },
  */

/*
  updateOwe: function(settings) {
    var donationInterval = settings.donationInterval || 60;
    var donationGoal = settings.donationGoal;
    donationGoal = donationGoal ? +donationGoal.slice(1) : 0;

    var est = donationGoal * (5 / donationInterval);

    this.$('.owe').text('$' + est.toFixed(2));
  },
*/

  afterRender: function() {
    var component = this;
    var input = this.$('input[type=text]');
    //var select = this.$('select');

    storage.get('settings').then(function(settings) {
      input.val(settings.reminderThreshGlobal);
/*
      select.find('[value=' + settings.donationInterval + ']')
        .attr('selected', true);

      component.updateOwe(settings);
*/
    }).catch(function(ex) {
      console.log(ex);
    });
  }
};

ReminderThreshGlobalComponent.prototype.__proto__ = Component.prototype;

export default ReminderThreshGlobalComponent;
