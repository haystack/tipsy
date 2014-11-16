import { environment } from './environment';

export function create(time, days) {
  var when = time.unix() * 1000;
  var minutes = null;

  if (environment === 'chrome') {
    // Convert the repeating days to minutes.
    minutes = days * (24 * 60);

    // When using the same id, Chrome will automatically clear out the previous
    // notification.
    chrome.alarms.create('tipsy', {
      when: when,
      periodInMinutes: minutes
    });
  }
  else if (environment === 'firefox') {

  }
}

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
    });
  }
  else if (environment === 'firefox') {

  }
}
