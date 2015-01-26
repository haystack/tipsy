'use strict';

import Component from '../../component';
import storage from '../../storage';
import { create as createNotification, clear as clearNotification, get as getNotification } from '../../notifications';

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

  // Find the saved reminder settings.
  storage.get('settings').then(function(settings) {
    
    var defaultDay;
    var defaultDate;
    
    // take care of initial/default state
    if (typeof settings.nextNotifiedDate === 'undefined') {

      defaultDate = moment().add(1, 'days');
      defaultDate = new Date(defaultDate);
      defaultDate = defaultDate.setHours(10, 0, 0);
      // FIXME: should realy use component.createNotification but is not available yet.
      chrome.alarms.create('tipsy-dateInterval', {
        when: Number(defaultDate),
        periodInMinutes: 1 * 24 * 60
      });
    }
    
    if (typeof settings.nextNotifiedDay === 'undefined') {
      defaultDay = moment().day("Sunday");
      defaultDay = new Date(defaultDay);
      defaultDay = defaultDay.setHours(10, 0, 0);
    
      if (defaultDay < Date.now()) {
        var day = moment(defaultDay).add(7, 'days');
        defaultDay = day.valueOf();
      }
      // FIXME: should realy use component.createNotification but is not available yet.
      chrome.alarms.create('tipsy-dayInterval', {
        when: Number(defaultDay),
        periodInMinutes: 7 * 24 * 60
      });
    }

    component.nextNotifiedDay = settings.nextNotifiedDay || defaultDay;
    component.nextNotifiedDate = settings.nextNotifiedDate || defaultDate;
    component.reminderLevel = settings.reminderLevel;
    
    component.timeSpanNumber = settings.timeSpanNumber;
    component.timeSpanType = settings.timeSpanType;
    component.days = settings.days || 1;
    component.timeSpanTime = settings.timeSpanTime;
    
    component.weekdayInterval = settings.weekdayInterval;
    component.weekdayIntervalTime = settings.weekdayIntervalTime;

    component.intervalsEnabled = settings.intervalsEnabled;
		
    component.dateIntervalEnabled = settings.dateIntervalEnabled;
    component.dayIntervalEnabled = settings.dayIntervalEnabled;
	
    // Re-render with these new values set.
    component.render();
  });

  // Whenever the storage engine is updated, do a quick check for updating
  // the next notified time.
  storage.onChange(function() {
    var nextNotifiedDay;
    var nextNotifiedDate;
		
		// make sure that the notifcations that are set are gotten
    storage.get('settings').then(function(settings) {
      nextNotifiedDay = moment(new Date(settings.nextNotifiedDay || component.nextNotifiedDay));
      nextNotifiedDate = moment(new Date(settings.nextNotifiedDate || component.nextNotifiedDate));
 
      return Promise.all([
        getNotification('tipsy-dateInterval'),
        getNotification('tipsy-dayInterval')
       ]);
    }).then(function(alarms) {
      var dateIntervalAlarm = alarms[0];
      var dayIntervalAlarm = alarms[1];
     	
       	// set the "next reminder" text
      if (nextNotifiedDate && !dayIntervalAlarm && dateIntervalAlarm) {
        component.$('.next').html(moment(nextNotifiedDate).calendar());
      } else if (nextNotifiedDay && !dateIntervalAlarm && dayIntervalAlarm) {
        component.$('.next').html(moment(nextNotifiedDay).calendar());
      } else if (!dayIntervalAlarm && !dateIntervalAlarm) {
        component.$('.next').html('Never.');
      } else if ((nextNotifiedDay < nextNotifiedDate || !nextNotifiedDate)) {
        component.$('.next').html(moment(nextNotifiedDay).calendar());
      } else if (((nextNotifiedDate < nextNotifiedDay || !nextNotifiedDay) || !dayIntervalAlarm) 					) {
        component.$('.next').html(moment(nextNotifiedDate).calendar());
      } else {
        console.error("Next notif text has problem, shouldn't be here");
      }
    });
  });
}


ReminderIntervalComponent.prototype = {
  template: 'components/reminders/reminder-interval.html',

  events: {
    // Whenever the input is updated, update the settings and save.
    'change input[type=checkbox]': 'selectedReminderInterval',
    'change select' : 'updateIntervalReminder',
    'change input[type=time]': 'updateIntervalReminder'
  },

  filters: [
    'calendar'
  ],

  calendar: function(val) {
    return moment(new Date(val)).calendar();
  },

  /**
   * The usable data within the template.
   *
   * @return {Object} Containing the template data.
   */
  serialize: function() {

    // Use the stored next notified date
    return { nextNotified: this.nextNotified};
  },
  
  /**
  *
  * Disable all the intervals, called when the main checkbox is unchecked
  *
  */
  disableIntervals: function(component, mod) {
    var remindMeText = component.$('.fixedIntervalReminder');
    var dropdowns = component.$('.intervalCheck');
    var checkboxes = component.$('.checks');
    component.$('.fixedIntervalReminder').removeClass('active');
    component.$('.intervalCheck').prop('disabled', true);
    component.$('.checks').prop('disabled', true);
    clearNotification('tipsy-dateInterval');
    clearNotification('tipsy-dayInterval');
    component.dateIntervalEnabled = component.$("#dateCheckbox").prop('checked');
    component.dayIntervalEnabled = component.$("#dayWeekCheckbox").prop('checked');
    component.$("#dateCheckbox").prop('checked', false);
    component.$("#dayWeekCheckbox").prop('checked', false);

    if (mod) {
      storage.get('settings').then(function(settings) {
        settings.intervalsEnabled = false;

        settings.dateIntervalEnabled = false;
        settings.dayIntervalEnabled = false;
        return storage.set('settings', settings);
    }).catch(function(ex) {
      console.log(ex);
      console.log(ex.stack);
      });
    }
  },
  
  /**
  *
  * Enable all the intervals, called when the main checkbox is checked 
  * or when refreshed/reopened and was previously unselected
  *
  */
  enableIntervals: function(component) {    

    component.$('.front').addClass('active');
    component.$('.checks').prop('disabled', false);
    
    storage.get('settings').then(function(settings) {

      settings.dateIntervalEnabled = component.dateIntervalEnabled;
      settings.dayIntervalEnabled = component.dayIntervalEnabled;
  	 	
      if (component.dateIntervalEnabled) {
        component.enableDateInterval(component, true);
      }
  	 	
      if (component.dayIntervalEnabled) {
        component.enableDayInterval(component, true);	 	
      }
  	 	
      settings.intervalsEnabled = true;
      component.intervalsEnabled = true;
      return storage.set('settings', settings);
    }).catch(function(ex) {
      console.log(ex);
      console.log(ex.stack);
    });
  },
  
  /**
  * Disables the date interval reminder method only
  */
  disableDateInterval: function(component, mod) {
  
    component.$('.dateType').prop('disabled', true);
    component.$('.dateText').removeClass('active');
    component.$("#dateCheckbox").prop('checked', false);
    component.dateIntervalEnabled = false;
		
    clearNotification('tipsy-dateInterval');
    if (mod) {
      storage.get('settings').then(function(settings) {
        settings.dateIntervalEnabled = false;
        return storage.set('settings', settings);
      }).catch(function(ex) {
        console.log(ex);
        console.log(ex.stack);
      });
    }
  },
  
  /**
  * Enables the date interval reminder method only
  */
  enableDateInterval: function(component, all) {
    component.$('.dateType').prop('disabled', false);
    component.$("#dateCheckbox").prop('checked', true);
    component.$('.dateText').addClass('active');
    
    storage.get('settings').then(function(settings) {
      return Promise.all([
        getNotification('tipsy-dateInterval')
       ]);
    }).then(function(alarms) {
      var dateIntervalAlarm = alarms[0];
      var daysInMS = component.days * 86400000;
      if (!dateIntervalAlarm || (dateIntervalAlarm.scheduledTime) != (component.nextNotifiedDate + daysInMS)) {
        createNotification('tipsy-dateInterval', component.nextNotifiedDate, component.days);
      }
    });

    storage.get('settings').then(function(settings) {
      settings.dateIntervalEnabled = true;
      if (all) settings.intervalsEnabled = true;
      return storage.set('settings', settings);
    }).catch(function(ex) {
      console.log(ex);
      console.log(ex.stack);
    });
  },
  
  /**
  * Disables the day interval reminder method only
  */  
  disableDayInterval: function(component, mod) {
    component.$('.dayType').prop('disabled', true);
    component.$('.dayText').removeClass('active');
    component.$("#dayWeekCheckbox").prop('checked', false);
    clearNotification('tipsy-dayInterval');
    component.dayIntervalEnabled = false;
    if (mod) {
      storage.get('settings').then(function(settings) {
        settings.dayIntervalEnabled = false;
        return storage.set('settings', settings);
      }).catch(function(ex) {
        console.log(ex);
        console.log(ex.stack);
      });
    }
  },

  /**
  * Enables the day interval reminder method only
  */   
  enableDayInterval: function(component, all) {
    component.$('.dayType').prop('disabled', false);
    component.$('.dayText').addClass('active');
    component.$("#dayWeekCheckbox").prop('checked', true);
    
    storage.get('settings').then(function(settings) {
      return Promise.all([
        getNotification('tipsy-dayInterval')
       ]);
    }).then(function(alarms) {
      var dayIntervalAlarm = alarms[0];
      var sevenDaysInMS = 7 * 86400000;
      if (!dayIntervalAlarm || (dayIntervalAlarm.scheduledTime) != (component.nextNotifiedDay + sevenDaysInMS)) {
        createNotification('tipsy-dayInterval', component.nextNotifiedDay, 7);
      }
    });
    //createNotification('tipsy-dayInterval', component.nextNotifiedDay, 7);
    storage.get('settings').then(function(settings) {
      settings.dayIntervalEnabled = true;
      if (all) settings.intervalsEnabled = true;
      return storage.set('settings', settings);
    }).catch(function(ex) {
      console.log(ex);
      console.log(ex.stack);
    });
  },

  /**
  * Handle when the Reminder Interval is checked.
  */
  selectedReminderInterval: function(ev) {
    var isChecked;
    var isDateChecked;
    var isDayChecked;
    if (!($(ev.currentTarget).hasClass("checks"))) {
      isChecked = this.$('#intervalCheckbox').prop('checked');
      if (isChecked) {
        this.enableIntervals(this);
      } else if (!isChecked) {
        this.disableIntervals(this, true);
      }
    } else {
  	
      isDateChecked = this.$("#dateCheckbox").prop('checked');
      isDayChecked = this.$("#dayWeekCheckbox").prop('checked');
  		
      if ($(ev.currentTarget).hasClass("date")) {
        if (isDateChecked) {
          this.enableDateInterval(this, false);
        } else {
          this.disableDateInterval(this, true);
        }
      }
  		
      if ($(ev.currentTarget).hasClass("day")) {
        if (isDayChecked) {
          this.enableDayInterval(this, false);
        } else {
          this.disableDayInterval(this, true);
        }
      }
  		
      storage.get('settings').then(function(settings) {
        settings.dateIntervalEnabled = isDateChecked;
        settings.dayIntervalEnabled = isDayChecked;
        if (isChecked) {
          settings.intervalsEnabled = true;
        }
        return storage.set('settings', settings);
      }).catch(function(ex) {
        console.log(ex);
        console.log(ex.stack);
      });
    }
  },
  
  /**
  * Handle changes to the the interval data.
  */
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
        	
          var hours = parseInt(timeSpanTime.split(":")[0]);
          var mins = parseInt(timeSpanTime.split(":")[1]);

          nextNotified = new Date(nextNotified);
          nextNotified.setHours(hours, mins, 0);
          component.nextNotifiedDate = nextNotified;
        	
          createNotification('tipsy-dateInterval', nextNotified, days);
        	//console.log(nextNotified);
          moment().format('MMMM Do YYYY, h:mm:ss a');

        }
        
        settings.timeSpanNumber = timeSpanNumber;
        settings.timeSpanType = timeSpanType;
        settings.timeSpanTime = timeSpanTime;
        settings.days = days;

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
          }
       		
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
  * Updates the visual display of the template reflecting the data.
  */
  afterRender: function() {
    // Display the correct output.
    // console.log('in afterrender');
    if (this.intervalsEnabled === true) {
      this.enableIntervals(this);
      this.$('#intervalCheckbox').prop('checked', true);
    } else if (this.intervalsEnabled === false){
      this.disableIntervals(this, false);
      this.disableDateInterval(this, false);
      this.disableDayInterval(this, false);
      storage.get('settings').then(function(settings) {
        settings.dayIntervalEnabled = false;
        settings.dateIntervalEnabled = false;
        return storage.set('settings', settings);
      }).catch(function(ex) {
        console.log(ex);
        console.log(ex.stack);
      });
      this.$('#intervalCheckbox').prop('checked', false);
    }
		
    if (this.dateIntervalEnabled === true) {
      this.enableDateInterval(this, false);
    } else if (this.dateIntervalEnabled === false) {
      this.disableDateInterval(this, false);
    }
		
    if (this.dayIntervalEnabled === true) {
      this.enableDayInterval(this, false);
    } else if (this.dayIntervalEnabled === false) {
      this.disableDayInterval(this, false);
    }

    this.$('#timeSpanNumber').val(this.timeSpanNumber || 1);
    this.$('#timeSpanType').val(this.timeSpanType || "1");
    this.$('#timeSpanTime').val(this.timeSpanTime || "10:00");
    this.$('#weekdayInterval').val(this.weekdayInterval || "Sunday");
    this.$('#weekdayIntervalTime').val(this.weekdayIntervalTime || "10:00");
    
    var nextNotifiedDate = this.nextNotifiedDate;
    var nextNotifiedDay = this.nextNotifiedDay;

    if (this.dateIntervalEnabled === false && this.dayIntervalEnabled === false) {
      this.$('.next').html("Never.");
    } 
    
    else if (!nextNotifiedDay && !nextNotifiedDate) {
    	//alert("hello");
      var nextNotified = moment().add(1, 'days');
      nextNotified = new Date(nextNotified);
      nextNotified.setHours(10, 0, 0);
      
      createNotification('tipsy-dateInterval', nextNotified, 1);
      

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
  }
};

ReminderIntervalComponent.prototype.__proto__ = Component.prototype;

export default ReminderIntervalComponent;
