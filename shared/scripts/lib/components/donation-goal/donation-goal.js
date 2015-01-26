'use strict';

import Component from '../../component';
import storage from '../../storage';
import { intervals } from '../../defaults';

function DonationGoalComponent() {
  Component.prototype.constructor.apply(this, arguments);
  var component = this;
   
  storage.get('settings').then(function(settings) {
    component.rateType = settings.rateType || 'browsingRate';
    component.render();
  });
  
  /*
  storage.get('settings').then(function(settings) {
    $.post('http://tipsy.csail.mit.edu/test/test4.php',{userId:settings.userId, time:settings.timeSpentAuthored.toString()}); 
  });
  */
  
  storage.onChange(function() {
    component.updateEstimate(null, component);
  });
}

DonationGoalComponent.prototype = {
  template: 'components/donation-goal/donation-goal.html',

  events: {
    'keyup input[type=text]': 'filterInput',
    'blur input[type=text]': 'formatAndSave',
    'change input[type=text]': 'formatAndSave',
    'change input[type=radio]': 'rateSelected',
    'change select': 'updateInterval'
  },
  
  rateSelected: function(ev) {
    
    this.updateRateDescription(ev.target.id);
  },
  
  updateInterval: function(ev) {
    var id = ev.target.id;
    
    var minutes = Number(ev.target.value);
    var component = this;

    return storage.get('settings').then(function(settings) {
      if (id == 'calendarRateInterval') {
        settings.donationIntervalCalendarRate = minutes;
      } else if (id == 'browsingRateInterval') {
        settings.donationIntervalBrowsingRate = minutes;
      }
      

      //component.updateOwe(settings);

      return storage.set('settings', settings);
    });
  },

  filterInput: function(ev) {
    var val = ev.target.value.replace(/[^0-9.]/g, '');
    //this.$('input[type=text]').val('$' + val);
    if (ev.target.id == 'calendarRateGoal') {
      this.$('#calendarRateGoal').val('$' + val);
    }
    else if (ev.target.id == 'browsingRateGoal') {
      this.$('#browsingRateGoal').val('$' + val);
    }
  },

  formatAndSave: function(ev) {
    var component = this;
    var val = ev.target.value.replace(/[^0-9.]/g, '');
    var currency = '$' + parseFloat(val).toFixed(2);

    if (!(component.$('#calendarRateGoal').prop('disabled'))) {
      component.$('#calendarRateGoal').val(currency);
    }
    if (!(component.$('#browsingRateGoal').prop('disabled'))) {
      component.$('#browsingRateGoal').val(currency);
    }

    storage.get('settings').then(function(settings) {
    
      if (!(component.$('#calendarRateGoal').prop('disabled'))) {
        settings.donationGoalCalendarRate = currency;
      }
      if (!(component.$('#browsingRateGoal').prop('disabled'))) {
        settings.donationGoalBrowsingRate = currency;
      }
      //component.updateOwe(settings);

      return storage.set('settings', settings);
    }).catch(function(ex) {
      console.log(ex);
      console.log(ex.stack);
    });
  },
  
  updateEstimate: function(rateType, component) {
    storage.get('settings').then(function(settings) {
      if (!rateType) {
        rateType = settings.rateType;
      }
        
      if (rateType == 'browsingRate') {
        if (settings.timeStarted && settings.donationGoalBrowsingRate && settings.donationIntervalBrowsingRate) {
          var timeSpan = Date.now() - settings.timeStarted;
          var timeSpent = settings.timeSpentAuthored;
          var fracSpent = timeSpent / timeSpan;
          var estimatePerMin = fracSpent * parseFloat(settings.donationGoalBrowsingRate.slice(1)) / settings.donationIntervalBrowsingRate; // per minute
          
          //TODO choose a good timespan
          var estimateTwoWeeks = 20160 * estimatePerMin;
          component.$('.avgTime').html("Based on your browsing activity since " + moment(settings.timeStarted).fromNow() + ", after 2 weeks you would be ecouraged to pay a total of <strong>$" + estimateTwoWeeks.toFixed(2).toString()  +"</strong>.");
        } else {
            component.$('.avgTime').html("Not enough data yet to give you a meaningful estimate.");
        }
      } else if (rateType == 'calendarRate') {
        component.$('.avgTime').text("");
      } else {
        console.error("No or wrong rateType selected");
      }
    }).catch(function(ex) {
      console.log(ex);
      console.log(ex.stack);
    });      
  },
  
  disableOtherRate: function(rateType, component) {
    var other;
    if (rateType == "browsingRate") {
      other = "calendarRate";     
    } else if (rateType == "calendarRate") {
      other = "browsingRate";
    }
    
    component.$('#' + other + 'Goal').prop('disabled', true);
    component.$('#' + other + 'Interval').prop('disabled', true);
    
    component.$('#' + rateType + 'Goal').prop('disabled', false);
    component.$('#' + rateType + 'Interval').prop('disabled', false);
    
    component.$('.' + other + 'Text').removeClass('active');
    component.$('.' + rateType + 'Text').addClass('active');
  },
  
  updateRateDescription: function(id) {
    var rateType;
    var component = this;
  	if (id == 'browsingRateRadio') {
  	  //this.$('.avgTime').text("If you spent 5 minutes browsing ");
  	  rateType = 'browsingRate';
  	}
  	else if (id == "calendarRateRadio") {
  	  //this.$('.avgTime').text("After 5 minutes ");
  	  rateType = 'calendarRate';
  	}
  	component.disableOtherRate(rateType, component);
  	component.updateEstimate(rateType, component);
  	
  	storage.get('settings').then(function(settings) {
  	  settings.rateType = rateType;
  	  component.rateType = rateType;
  	  return storage.set('settings', settings);
  	}).catch(function(ex) {
      console.log(ex);
      console.log(ex.stack);
      });
  },
  
  updateRateDisplay: function(rateType) {
  
    var id = rateType + 'Radio';
    this.$('#' + id).prop('checked', true);
    this.updateRateDescription(id);

  },

/*
  updateOwe: function(settings) {
    var donationInterval = settings.donationInterval || 60;
    var donationGoal = settings.donationGoal;
    donationGoal = donationGoal ? +donationGoal.slice(1) : 0;

    var est = donationGoal * (5 / donationInterval);

    this.$('.owe').text('$' + est.toFixed(2));
    
    this.$('.rateDescription').text(intervals[donationInterval]);
  },
*/

  afterRender: function() {
    var component = this;
    var inputBrowsingRate = this.$('#browsingRateGoal');
    var inputCalendarRate = this.$('#calendarRateGoal');
    var selectBrowsingRate = this.$('#browsingRateInterval');
    var selectCalendarRate = this.$('#calendarRateInterval');

    storage.get('settings').then(function(settings) {
      inputBrowsingRate.val(settings.donationGoalBrowsingRate);
      inputCalendarRate.val(settings.donationGoalCalendarRate);
      
      //select.find('[value=' + settings.donationInterval + ']')
        //.attr('selected', true);

      //component.updateOwe(settings);
      settings.rateType = component.rateType;
      //if (component.rateType == "browsingRate") {
        selectBrowsingRate.find('[value=' + settings.donationIntervalBrowsingRate.toString() + ']').attr('selected', true);     
      //} else if (component.rateType == "calendarRate") {
        selectCalendarRate.find('[value=' + settings.donationIntervalCalendarRate.toString() + ']').attr('selected', true);   
      //}
      
      component.updateRateDisplay(component.rateType);
      return storage.set('settings', settings);
      
    }).catch(function(ex) {
      console.log(ex);
    });
  }
};

DonationGoalComponent.prototype.__proto__ = Component.prototype;

export default DonationGoalComponent;
