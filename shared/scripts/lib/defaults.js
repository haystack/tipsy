import storage from './storage';

export var defaults = {

  "dateIntervalEnabled": true,
  "dayIntervalEnabled": true,
  //"days": 1,  day interval reminder days
  "donationGoal": "$0.01", 
  "donationInterval": 1, // donationInterval in minutes
  "globalThresholdReminderEnabled": true,
  "localThresholdReminderEnabled": true,
  "rateType": "browsingRate", // "calendarRate or browsingRate"
  "reminderThreshGlobal": "$10.00",
  "reminderThreshLocal": "$10.00",
  "timeSpanNumber": "1",
  "timeSpanType": "1", // in days, 1, 7 or 30
  "timeSpanTime": "10:00",
  "weekdayInterval": "Sunday",
  "weekdayIntervalTime": "10:00"
}

export function setDefaults() {
  storage.get('settings').then(function(settings) {
    for (var key in defaults) {
      if (!settings[key]) {
        //console.log("set " + key);
        settings[key] = defaults[key];
      } else {
        console.log(key + " already there");
      }
    }
    return storage.set('settings', settings);
  }).catch(function(ex) {
      console.log(ex);
      console.log(ex.stack);
  });
}
