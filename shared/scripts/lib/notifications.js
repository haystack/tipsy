import { environment } from './environment';
import storage from './storage';

export var toDays = [
  // Daily.
  1,
  // Half weekly.
  3.5,
  // Weekly.
  7,
  // Bi-weekly.
  14,
  // Monthly.
  30
];

/**
 * Schedule a new notification.
 *
 * @param {number} when - time as a moment object or unix timestamp.
 * @param {number} days - how many days until the next notification.
 */
export function create(when, days) {
  var minutes = null;

  if (environment === 'chrome') {
    // Convert the repeating days to minutes.
    minutes = days * (24 * 60);

    // When using the same id, Chrome will automatically clear out the previous
    // notification.
    chrome.alarms.create('tipsy', {
      when: Number(when),
      periodInMinutes: minutes
    });
  }
  // In Firefox, the extension library cannot trigger a notification, so
  // instead we let the background script handle it.  Just need to let the
  // extension know when the right time is to trigger.
  else if (environment === 'firefox') {
    self.port.emit('notification.set', when);
  }
}

/**
 * Listens for Chrome alarms to trigger the next notification.
 */
export function listen() {
  if (environment === 'chrome') {
    chrome.alarms.onAlarm.addListener(function() {
      // Once the alarm triggers, create a notification to dispaly to the user.
      chrome.notifications.create("tipsy", {
        type: 'basic',
        iconUrl: '../img/logo64.png',
        title: 'Tipsy',
        message: 'Time to Donate!'
      }, function unhandledCallback() {});

      // Reset the next notified in the storage engine.
      storage.get('settings').then(function(settings) {
        var days = toDays[settings.reminderLevel];
        var next = moment(settings.nextNotified).add(days, 'days');
        settings.nextNotified = Number(next);

        // Create the next alarm.
        create(next, days);

        return storage.set('settings', settings);
      });
    });
  }
}
