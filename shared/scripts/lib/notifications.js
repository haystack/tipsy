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
    storage.get('settings').then(function(settings) {
      var createNotification = function() {
        // Once the alarm triggers, create a notification to dispaly to the
        // user.
        chrome.notifications.create("tipsy", {
          type: 'basic',
          iconUrl: '../img/logo64.png',
          title: 'Tipsy',
          message: 'Time to Donate!'
        }, function unhandledCallback() {
          // Reset the next notified in the storage engine.
          var days = toDays[settings.reminderLevel];
          var next = new Date(settings.nextNotified);
          next.setDate(next.getDate() + days);
          settings.nextNotified = Number(next);

          // Create the next alarm.
          create(next, days);

          storage.set('settings', settings);
        });
      };

      if (Number(settings.nextNotified) < Date.now()) {
        createNotification();
      }

      chrome.alarms.onAlarm.addListener(function() {
        createNotification();
      });
    });
  }

  else if (environment === 'firefox') {
    var notifications = require('sdk/notifications');
    var timers = require('timers');

    // Create a notification timeout upon launching that figures out when, the
    // next reminder should trigger.
    var timeout;

    // Cache this value for easier access.
    var nextNotified = storage.engine.nextNotified;

    // Reusable function to show the extension and reset.
    //var showNotification = function() {
    //  // Always reset the timeout.
    //  timers.clearTimeout(timeout);

    //  notifications.notify({
    //    title: 'Tipsy',
    //    text: 'Time to donate!'
    //  });

    //  // Set the next notification.
    //  var days = reminderLevelToDays[storage.engine.reminderLevel];
    //  storage.engine.nextNotified = Date.now() * (days * 1440 * 60000);

    //  // Convert the new date to milliseconds.
    //  var milliseconds = storage.engine.nextNotified;

    //  // Set the next timeout.
    //  timeout = timers.setTimeout(showNotification, Date.now() - milliseconds);
    //};

    //// If this notification is scheduled for the future, set a timeout.
    //if (nextNotified > 0) {
    //  // Set a timeout with the difference until the notification should
    //  // trigger.
    //  timeout = timers.setTimeout(showNotification, Date.now() - nextNotified);
    //}
    //// Otherwise immediately show and schedule for the next one.
    //else {
    //  showNotification();
    //}
  }
}
