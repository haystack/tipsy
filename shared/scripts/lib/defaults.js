'use strict';

import storage from './storage';

export var defaults = {
  'intervalsEnables' : true,
  'dateIntervalEnabled': true,
  'dayIntervalEnabled': true,
  'days': 1,
  'donationGoalBrowsingRate': '$0.01',
  'donationGoalCalendarRate': '$0.01',
  'donationIntervalCalendarRate': 1440, // donationInterval in minutes
  'donationIntervalBrowsingRate': 1,
  'globalThresholdReminderEnabled': true,
  'localThresholdReminderEnabled': true,
  'rateType': 'browsingRate', // 'calendarRate or browsingRate'
  'reminderThreshGlobal': '$10.00',
  'reminderThreshLocal': '$10.00',
  'timeSpanNumber': '1',
  'timeSpanType': '1', // in days, 1, 7 or 30
  'timeSpanTime': '10:00',
  'weekdayInterval': 'Sunday',
  'weekdayIntervalTime': '10:00',
  'userAgrees': false,
  'idle': 20,
  'maxDonationsTableSize': 3,
  'estimate': {'minutes': 20160, 'amount': '2', 'type': 'weeks'}
};

export function setDefaults() {
  storage.get('settings').then(function(settings) {
    for (var key in defaults) {
      if (typeof settings[key] == 'undefined') {
        settings[key] = defaults[key];
      } else {
      }
    }
    return storage.set('settings', settings);
  }).catch(function(ex) {
    console.log(ex);
    console.log(ex.stack);
  });
}

export var intervals = {
  1: 'minute',
  60: 'hour',
  1440: 'day',
  10080: 'week',
  43200: 'month',
  525949: 'year'
};
