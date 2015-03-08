import { environment } from './environment';
import storage from './storage';
import calculate from './utils/calculate';

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
export function create(name, when, days) {
  var minutes = null;

  if (environment === 'chrome') {
    // Convert the repeating days to minutes.
    minutes = days * (24 * 60);

    // When using the same name, Chrome will automatically clear out the previous
    // notification.
    chrome.alarms.create(name, {
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

export function clear(name) {
	if (environment === 'chrome') {
		chrome.alarms.clear(name);
	}
}

export function get(name) {
	return new Promise(function(resolve) {
		chrome.alarms.get(name, resolve);
	});
}

/**
 * Allows to create notification manually, used for thresholdreminders
 */
export function notify(name, type, amount) {

  if (environment === 'chrome') {
    chrome.notifications.create(name, {
      type: 'basic',
      iconUrl: '../img/logo64.png',
      title: 'Tipsy',
      message: 'Time to donate! You have reached your '+ type + ' threshold with an amount of $' + amount + '.'
    }, function unhandledCallback() {});
    addClickable();
  } else if (environment === 'firefox') {
    //TODO implement me
    console.error('Threshold notification for Firefox not yet implemented.');
  }
}

function addClickable() {
  chrome.notifications.onClicked.addListener(function(notificationId, buttonIndex) {
    chrome.tabs.create({url:chrome.extension.getURL('html/index.html')});
  });
}

/**
 * Polls and runs threshold logic on the background thread to avoid the need
 * for being in the extension to get notifications.
 */
function pollForNotifications() {
  Promise.all([
    storage.get('settings'),
    storage.get('log')
  ]).then(function(resp) {
    var settings = resp[0];
    var log = resp[1];
    var totalOwed = 0;

    // Iterate all visited pages.
    Object.keys(log).forEach(function(domain) {
      // Filter down to those with valid payment information.
      log[domain].filter(function(item) {
        // Has a valid author list.
        if (item && item.author && item.author.list.length) {
          return item.author.list.some(function(item) {
            return item.bitcoin || item.dwolla || item.paypal;
          });
        }
      }).forEach(function(hasPaymentInfo) {
        // Don't modify the existing object.
        var internal = Object.create(hasPaymentInfo);
        var calculated = calculate(settings, internal);
        var amountNum = parseFloat(calculated.estimatedAmount);

        totalOwed += amountNum;

        // let notifications know there is money to pay
        if (amountNum > 0) {
          settings.moneyIsOwed = true;
        }
        if (settings.reminderThreshLocal && (amountNum >= parseFloat(settings.reminderThreshLocal.slice(1))) && !settings.localReminded)  {
          notify('tipsy-thersh-local', 'local', amountNum.toFixed(2));
          settings.localReminded = true;
        }
      });
    });

    if (settings.reminderThreshGlobal && (totalOwed >= parseFloat(settings.reminderThreshGlobal.slice(1))) && !settings.globalReminded) {
      notify('tipsy-thresh-global', 'global', totalOwed.toFixed(2));
      settings.globalReminded = true;
    }
  }).catch(function(ex) {
    console.log(ex, ex.message);
  });
}

/**
 * Listens for Chrome alarms to trigger the next notification.
 */
export function listen(worker) {
  if (environment === 'chrome') {
    storage.get('settings').then(function(settings) {
      var createNotification = function(name) {
        // Once the alarm triggers, create a notification to dispaly to the
        // user.
        if (settings.moneyIsOwed) {
          console.log('creating');
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
            create(name, next, days);

            storage.set('settings', settings);
          });
          addClickable();
        }
      };
      if (Number(settings.nextNotified) < Date.now()) {
        createNotification();
      }

      chrome.alarms.onAlarm.addListener(function(alarm) {
        createNotification(alarm.name);
      });
    });

    // Check for notifications and then poll every hour.
    pollForNotifications();
    setInterval(pollForNotifications, 3600000);
  }

  else if (environment === 'firefox') {
    var notifications = require('sdk/notifications');
    var timers = require('timers');

    // Create a notification timeout upon launching that figures out when, the
    // next reminder should trigger.
    var timeout;

    // Cache this value for easier access.
    var nextNotified = storage.engine.nextNotified;

    // Reset the current notificaiton.
    worker.port.on('notification.set', function(days) {
      timers.clearTimeout(timeout);

      // Cache this value for easier access.
      nextNotified = storage.engine.nextNotified;
      //timeout = setTimeout(showNotification, Date.now() - nextNotified);
    });

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
