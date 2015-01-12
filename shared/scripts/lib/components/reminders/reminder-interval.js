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
  
    component.nextNotifiedDay = settings.nextNotifiedDay;
    component.nextNotifiedDate = settings.nextNotifiedDate;
    component.reminderLevel = settings.reminderLevel;
    
    component.timeSpanNumber = settings.timeSpanNumber;
    component.timeSpanType = settings.timeSpanType;
    component.timeSpanTime = settings.timeSpanTime;
    
    component.weekdayInterval = settings.weekdayInterval;
    component.weekdayIntervalTime = settings.weekdayIntervalTime;

    // Re-render with this new value set.
    component.render();
  });

  // Whenever the storage engine is updated, do a quick check for updating
  // the next notified time.
  storage.onChange(function() {
    storage.get('settings').then(function(settings) {
      var nextNotifiedDay = moment(new Date(settings.nextNotifiedDay));
      var nextNotifiedDate = moment(new Date(settings.nextNotifiedDate));
      
      if (nextNotifiedDay < nextNotifiedDate || !nextNotifiedDate) {
      	component.$('.next').html(moment(nextNotifiedDay).calendar());
      } else if (nextNotifiedDate < nextNotifiedDay || !nextNotifiedDate) {

      // Update the value in the markup.
      	component.$('.next').html(moment(nextNotifiedDate).calendar());
      }
    });
  });
}

ReminderIntervalComponent.prototype = {
  template: 'components/reminders/reminder-interval.html',

  events: {
    // Whenever the input is updated, update the settings and save.
    'change input[type=checkbox]': 'selectedReminderInterval',
    'input input[type=range]': 'updateOutputAndSave',
    'change select' : 'updateIntervalReminder',
    'change input[type=time]': 'updateIntervalReminder'
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
    // var range = this.$('input[type=range]');
    var output = this.$('output');
    var isChecked = this.$('#intervalCheckbox').prop('checked');
    var remindMeText = this.$('.fixedIntervalReminder');
    var dropdowns = this.$('.intervalCheck');
    var checkboxes = this.$('.checks')
    if (isChecked) {
      // range.prop('disabled', false);
      /*
      var index = this.reminderLevel;
      console.log(this);
      output.find('span').removeClass('active').eq(index).addClass('active');
      */
      remindMeText.addClass('active');
      dropdowns.prop('disabled', false)
      checkboxes.prop('disabled', false);
    } else if (!isChecked) {
      // output.find('span').removeClass('active')
  	  // range.prop('disabled', true);
  	  var remindMeText = this.$('.fixedIntervalReminder');
  	  remindMeText.removeClass('active');
  	  dropdowns.prop('disabled', true);
  	  checkboxes.prop('disabled', true);
  	}
  },
  
  updateIntervalReminder: function(ev) {
	var component = this;
    if ($(ev.currentTarget).hasClass("dateType")) {

	
  	  
	  	var timeSpanNumber = component.$('#timeSpanNumber').val();
	  	var timeSpanType = component.$('#timeSpanType').val();
	  	var timeSpanTime = component.$('#timeSpanTime').val();

  	
  		this.timeSpanNumber = timeSpanNumber;
  		this.timeSpandType = timeSpanType;
  		this.timeSpanTime = timeSpanTime;
  	
  	
  		return storage.get('settings').then(function(settings) {
  			var prevTimeSpanNumber = settings.timeSpanNumber;
  			var prevTimeSpanType = settings.timeSpanType;
  		
  			var prevDays  = prevTimeSpanNumber * prevTimeSpanType;
  		
  			var prevTimeSpanTime = settings.timeSpanTime;
  		
  			var days = timeSpanNumber * timeSpanType;

  			var nextNotified = moment().add(days, 'days');
  		
  			if (localStorage.testing === 'true') {
           nextNotified = moment().add(1, 'minutes'); 
        }
		
        if (prevDays !== days || prevTimeSpanTime !== timeSpanTime) {
        	
        	//console.info("next notif");
        	var hours = parseInt(timeSpanTime.split(":")[0]);
        	var mins = parseInt(timeSpanTime.split(":")[1]);

        	nextNotified = new Date(nextNotified);
        	nextNotified.setHours(hours, mins, 0);
        	component.nextNotifiedDate = nextNotified;
        	
        	createNotification('tipsy-dateInterval', nextNotified, days);
        	//console.log(nextNotified);
        	moment().format('MMMM Do YYYY, h:mm:ss a');
        	//component.$('.next').html(moment(nextNotified).calendar());
        	//console.info('Created new date-interval notification at:' + moment(nextNotified).calendar());
        };
        
        settings.timeSpanNumber = timeSpanNumber;
       	settings.timeSpanType = timeSpanType;
        settings.timeSpanTime = timeSpanTime;

				settings.nextNotifiedDate = Number(component.nextNotifiedDate);
        
      return storage.set('settings', settings);
  	  }).catch(function(ex) {
        console.log(ex);
        console.log(ex.stack);
      });
     } else if ($(ev.currentTarget).hasClass("dayType")) {
     
     		var weekdayInterval = component.$('#weekdayInterval').val();
  			var weekdayIntervalTime = component.$('#weekdayIntervalTime').val();
  		
  		  this.weekdayInterval = weekdayInterval;
  			this.weekdayIntervalTime = weekdayIntervalTime;
  		
  			return storage.get('settings').then(function(settings) {
  			
  				var nextNotified = moment().day(weekdayInterval);
  				
  				if (localStorage.testing === 'true') {
          	nextNotified = moment().add(1, 'minutes'); 
       		}
       		var hours = parseInt(weekdayIntervalTime.split(":")[0]);
        	var mins = parseInt(weekdayIntervalTime.split(":")[1]);
        	
       		nextNotified = new Date(nextNotified);
        	nextNotified.setHours(hours, mins, 0);
					
       		if (nextNotified < Date.now()) {
  					nextNotified.setDate(nextNotified.getDate() + 7);
  					console.log("here");
  				};
       		
       		component.nextNotifiedDay = nextNotified;
       		createNotification('tipsy-dayInterval', nextNotified, 7);
       		
       		moment().format('MMMM Do YYYY, h:mm:ss a');
        	//component.$('.next').html(moment(nextNotified).calendar());
        	
  				settings.weekdayInterval = weekdayInterval;
      		settings.weekdayIntervalTime = weekdayIntervalTime;
      		
      		settings.nextNotifiedDay = Number(component.nextNotifiedDay);
      		
  				return storage.set('settings', settings);
  	  	}).catch(function(ex) {
        	console.log(ex);
        	console.log(ex.stack);
      	});
     } else {
     	console.info("wrong type");
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
      //settings.reminderLevel = index || 2;

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
    //var index = this.reminderLevel;
    // var range = this.$('input[type=range]').val(index);
    //var output = this.$('output');

    // Display the correct output.

    this.$('#timeSpanNumber').val(this.timeSpanNumber || 1);
    this.$('#timeSpanType').val(this.timeSpanType || "1");
    this.$('#timeSpanTime').val(this.timeSpanTime || "10:00");
    this.$('#weekdayInterval').val(this.weekdayInterval || "Sunday")
    this.$('#weekdayIntervalTime').val(this.weekdayIntervalTime || "10:00");
    var nextNotifiedDate = this.nextNotifiedDate;
    var nextNotifiedDay = this.nextNotifiedDay;
    //console.log(nextNotified);
    //console.log("hellllloooo1 " + nextNotifiedDay);
    //console.log("hellllloooo2 " + nextNotifiedDate);
    
    if (!nextNotifiedDay && !nextNotifiedDate) {
    	//alert("hello");
   	  var nextNotified = moment().add(1, 'days');
   	  nextNotified = new Date(nextNotified);
      nextNotified.setHours(10, 0, 0);
      
      createNotification('tipsy-dateInterval', nextNotified, 1);
      console.log("hphph[] " + nextNotified);
      settings.nextNotifiedDate = nextNotified;
      this.$('.next').html(moment(nextNotified).calendar());
    } else if (!nextNotifiedDay && this.nextNotifiedDate) {
    	this.$('.next').html(moment(nextNotifiedDate).calendar());
    } else if (nextNotifiedDay && !nextNotifiedDate) {
      this.$('.next').html(moment(nextNotifiedDay).calendar());
    } else if (nextNotifiedDay && nextNotifiedDate) {
    	if (nextNotifiedDay < nextNotifiedDate) {
    		this.$('.next').html(moment(nextNotifiedDay).calendar());
    	} else {
    		this.$('.next').html(moment(nextNotifiedDate).calendar());
    	}
    }
    
   	 
    
    //console.log(this.timeSpanTime);
    //output.find('span').removeClass('active').eq(index).addClass('active');
  }
};

ReminderIntervalComponent.prototype.__proto__ = Component.prototype;

export default ReminderIntervalComponent;
