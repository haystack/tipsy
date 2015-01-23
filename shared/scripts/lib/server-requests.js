'use strict';

export function updateDBTimeSpentAuthored(settings) {
  //$.post('http://tipsy.csail.mit.edu/dbconn/updateTimeSpentAuthored.php', {userId:settings.userId, time:settings.timeSpentAuthored.toString()});
  var request = new XMLHttpRequest();
  request.open('POST', 'http://tipsy.csail.mit.edu/dbconn/updateTimeSpentAuthored.php', true);
  request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
  request.send('userId=' + settings.userId + '&time='+settings.timeSpentAuthored.toString());
}
