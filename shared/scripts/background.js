'use strict';

var STATE = 'start';
var parser = document.createElement('a');
var curFocused;
var lastUpdated;

var prevpage = null;
var prevtabID = null;
var curpage = null;
var lastFocusedWindowID = null;

var isIdle = false;
var IDLETIME = 15;

// Set idle time
chrome.idle.setDetectionInterval(IDLETIME);

/**
 * Memory is stored with the website as key and
 * {'visitCount':int,'timeSpent':int [ms],'lastTimeVisited':int[ms since epoch]}
 * as the value.
 *
 * @param {string} key
 * @param {string} value
 * @return {string} Representing the sub-value at the requested value.
 */
function getSubValue(key, value) {
  var list = JSON.parse(localStorage['log-link: ' + key]);
  return list ? list[value] : null;
}

/*
 helper method to set the value of an entry
 @param str key; str value; str newVal, the subvalue that one wants to
 enter
 @modifies the localStorage memory
 @return null
 */
 function setValue(key, value, newVal) {
   var list = JSON.parse(localStorage['log-link: ' + key]);
   list[value] = newVal;
   localStorage['log-link: ' + key] = JSON.stringify(list);
 }

// helper method that tells you if the site has already
// been visited
function alreadyVisited(hostname) {
  return !!JSON.parse(localStorage['log-link: ' + hostname]);
}

// helper method that creates a new entry into localStorage
function createNewEntry(hostname, visitCount, timeSpent, lastTimeVisited, lastTimePaid) {
  var newEntry = {
    visitCount: visitCount,
    timeSpent: timeSpent,
    lastTimeVisited: lastTimeVisited,
    lastTimePaid: lastTimePaid,
    paymentInfo: null
  };

  localStorage.setItem('log-link: '+hostname, JSON.stringify(newEntry));
}

// listener for the message passing
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  var payInfoEntry = {
    paypalId: request.paypalId,
    bitcoinId: request.bitcoinId
  };

  if (alreadyVisited(request.hostname)) {
    setValue(request.hostname, 'paymentInfo', JSON.stringify(payInfoEntry));
  }

  sendResponse({ farewell: 'goodbye' });
});

// will be called when Tipsy icon is clicked. Opens up the Tipsy UI.
chrome.browserAction.onClicked.addListener(function() {
  if (!isIdle) {
    var d = new Date();
    curTime = d.getTime();

    var oldTimeSpent = getSubValue(curpage, 'timeSpent');
    var prevLastTimeVisited = getSubValue(curpage, 'lastTimeVisited');
    var newTimeSpent = oldTimeSpent + curTime - prevLastTimeVisited;

    if (alreadyVisited(curpage)) {
      setValue(curpage, 'timeSpent', newTimeSpent);
    }

    prevpage = null;
    prevtabID = null;

    chrome.windows.create({
      url: chrome.extension.getURL('html/index.html'), type:'popup'
    });
  }
});

// called when focused moved to a new tab
chrome.tabs.onActivated.addListener(function(focusedTab) {
  if (isIdle) {
    return;
  }

  var d = new Date();
  curTime = d.getTime();
  prevtabID = focusedTab.tabId;

  chrome.tabs.get(focusedTab.tabId, function(tabInfo) {

    parser.href = tabInfo.url;
    curpage = parser.hostname;
    var d = new Date();
    curTime = d.getTime();
    var cookiesEnabled = navigator.cookieEnabled;
    if (cookiesEnabled) {
      if ( prevpage !== curpage) {

        if (alreadyVisited(curpage)) {
          var oldVisitCount = getSubValue(curpage, 'visitCount');
          var oldLastTimeVisited = getSubValue(curpage, 'lastTimeVisited');

          var newVisitCount = oldVisitCount + 1;
          var newLastTimeVisited = curTime;

          setValue(curpage, 'visitCount', newVisitCount);
          setValue(curpage, 'lastTimeVisited', newLastTimeVisited);

          var oldTimeSpent = getSubValue(prevpage, 'timeSpent');
          var prevLastTimeVisited = getSubValue(prevpage, 'lastTimeVisited');
          var newTimeSpent = oldTimeSpent + curTime - prevLastTimeVisited;
          if (prevpage !== null) {
            setValue(prevpage, 'timeSpent', newTimeSpent);
          };
        } else {
          createNewEntry(curpage, 1, 0, curTime, 0);
          var oldTimeSpent = getSubValue(prevpage, 'timeSpent');
          var prevLastTimeVisited = getSubValue(prevpage, 'lastTimeVisited');
          var newTimeSpent = oldTimeSpent + curTime - prevLastTimeVisited;
          if (alreadyVisited(prevpage) && (prevpage !== null)) {
            setValue(prevpage, 'timeSpent', newTimeSpent);
          }
        }
      }
      prevpage = curpage;
    }
  });
});

// called when tab changes
chrome.tabs.onUpdated.addListener(function(updatedTabId) {
  var nowpage;
  if (isIdle) {
    return;
  }

  var d = new Date();
  curTime = d.getTime();

  chrome.tabs.get(updatedTabId, function(tabInfo){
    parser.href = tabInfo.url;
    nowpage = parser.hostname;
    var d = new Date();
    curTime = d.getTime();
    var cookiesEnabled = navigator.cookieEnabled;

    if ( prevpage !== nowpage && updatedTabId == prevtabID) {
      curpage = nowpage;
      if (alreadyVisited(curpage)) {
        var oldVisitCount = getSubValue(curpage, 'visitCount');
        var oldLastTimeVisited = getSubValue(curpage, 'lastTimeVisited');

        var newVisitCount = oldVisitCount + 1;
        var newLastTimeVisited = curTime;

        setValue(curpage, 'visitCount', newVisitCount);
        setValue(curpage, 'lastTimeVisited', newLastTimeVisited);

        var oldTimeSpent = getSubValue(prevpage, 'timeSpent');
        var prevLastTimeVisited = getSubValue(prevpage, 'lastTimeVisited');
        var newTimeSpent = oldTimeSpent + curTime - prevLastTimeVisited;
        if (prevpage !== null) {
          setValue(prevpage, 'timeSpent', newTimeSpent);
        }
      } else {
        createNewEntry(curpage, 1, 0, curTime, 0);
        var oldTimeSpent = getSubValue(prevpage, 'timeSpent');
        var prevLastTimeVisited = getSubValue(prevpage, 'lastTimeVisited');
        var newTimeSpent = oldTimeSpent + curTime - prevLastTimeVisited;
        if (alreadyVisited(prevpage)) {
          setValue(prevpage, 'timeSpent', newTimeSpent);
        }
      }
      prevpage = nowpage;
    }
  });
});

// called when window changed
// has two cases:
// 1) left chrome: must update last visited time spent.
// 2) opened window, must create or update new entry.
chrome.windows.onFocusChanged.addListener(function(winId) {

  if (!isIdle) {

    var d = new Date();
    curTime = d.getTime();

    if (winId === -1) {
      STATE = 'out';
      var oldTimeSpent = getSubValue(curpage, 'timeSpent');
      var prevLastTimeVisited = getSubValue(curpage, 'lastTimeVisited');
      var newTimeSpent = oldTimeSpent + curTime - prevLastTimeVisited;

      if (alreadyVisited(curpage)) {

        setValue(curpage, 'timeSpent', newTimeSpent);
      }
      prevpage = null;
      prevtabID = null;
    } else {

    // check for active tab
      chrome.tabs.query({active:true},function(ar){
        for (var i=0; i<ar.length; i++) {
        // check that active is in cur window
          if (ar[i].windowId === winId){
            parser.href = ar[i].url;
            curpage = parser.hostname;
            prevtabID = ar[i].id;
            if (alreadyVisited(curpage)) {
              var oldVisitCount = getSubValue(curpage, 'visitCount');
              var oldLastTimeVisited = getSubValue(curpage, 'lastTimeVisited');

              var newVisitCount = oldVisitCount + 1;
              var newLastTimeVisited = curTime;

              setValue(curpage, 'visitCount', newVisitCount);
              setValue(curpage, 'lastTimeVisited', newLastTimeVisited);
            } else {
              createNewEntry(curpage, 1, 0, curTime, 0);
            }

            var oldTimeSpent = getSubValue(prevpage, 'timeSpent');
            var prevLastTimeVisited = getSubValue(prevpage, 'lastTimeVisited');
            var newTimeSpent = oldTimeSpent + curTime - prevLastTimeVisited;

            if (alreadyVisited(prevpage)) {
              setValue(prevpage, 'timeSpent', newTimeSpent);
            }

            prevpage = curpage;
          }
        }
      });
      STATE = 'in';
    }
  }
});


// listens for going in and out of idle
// There are three states: 'idle', 'locked' and 'active'
chrome.idle.onStateChanged.addListener(function(result){
  var d = new Date();
  curTime = d.getTime();

  var winId;

  chrome.windows.getLastFocused(function (window){
    winId = window.id;
  });

  if (result == 'idle'){
    if (!isIdle) {
      isIdle = true;

      var d = new Date();
      curTime = d.getTime();
      if (STATE == 'in'){
        var oldTimeSpent = getSubValue(curpage, 'timeSpent');
        var prevLastTimeVisited = getSubValue(curpage, 'lastTimeVisited');
        var newTimeSpent = oldTimeSpent + curTime - prevLastTimeVisited;
        if (alreadyVisited(curpage)) {
          setValue(curpage, 'timeSpent', newTimeSpent);
        }
      }
      prevpage = null;
      prevtabID = null;
      if (STATE == 'out') {
        curpage = null;
      }
    }
  }

  if (result == 'locked'){
    if (!isIdle) {
      isIdle = true;

      var d = new Date();
      curTime = d.getTime();
      if (STATE == 'in'){
        var oldTimeSpent = getSubValue(curpage, 'timeSpent');
        var prevLastTimeVisited = getSubValue(curpage, 'lastTimeVisited');
        var newTimeSpent = oldTimeSpent + curTime - prevLastTimeVisited;
        if (alreadyVisited(curpage)) {
          setValue(curpage, 'timeSpent', newTimeSpent);
        }
      }
      prevpage = null;
      prevtabID = null;
      if (STATE == 'out') {
        curpage = null;
      }

    }
  }

  if (result == 'active') {
    isIdle = false;
    var d = new Date();
    curTime = d.getTime();
    chrome.tabs.query({'active':true}, function(ar) {
      for (var i=0; i<ar.length; i++) {
        // check that active is in cur window
        if (ar[i].windowId === winId && STATE === 'in'){
          parser.href = ar[i].url;
          curpage = parser.hostname;
          prevtabID = ar[i].id;
          if (alreadyVisited(curpage)) {
            var oldVisitCount = getSubValue(curpage, 'visitCount');
            var oldLastTimeVisited = getSubValue(curpage, 'lastTimeVisited');

            var newVisitCount = oldVisitCount + 1;
            var newLastTimeVisited = curTime;

            setValue(curpage, 'visitCount', newVisitCount);
            setValue(curpage, 'lastTimeVisited', newLastTimeVisited);
          } else {
            createNewEntry(curpage, 1, 0, curTime, 0);
          }
        }
      }
    });
    prevpage = curpage;
  }
});
