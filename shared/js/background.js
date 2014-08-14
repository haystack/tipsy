/**
Background script for Tipsy. Mainly takes care of logging
the page visits and the time spent per page.

Uses LocalStorage for saving payee/hostname. Relevant Local 
Storage keys stored with leading "log-link: " string.

Philippe Schiff

*/

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

// function (bool) to check if html5 storage is supported
function supports_html5_storage() {
	try {
		return 'localStorage' in window && window['localStorage'] !== null;
	} catch (e) {
		return false;
	}
};


/*
Memory is stored with the website as key and 
{"visitCount":int,"timeSpent":int [ms],"lastTimeVisited":int[ms since epoch]} 
as the value.
returns a string representing the sub-value at the requested value.
@param str key, str value
@return str subvalue
*/	
function getSubValue(key, value) {
	if (JSON.parse(localStorage.getItem("log-link: "+key)) == null ) {
		return null 
	} else {
		var list = JSON.parse(localStorage.getItem("log-link: "+key));
		return list[value];
	};
};

/*
 helper method to set the value of an entry
 @param str key; str value; str newVal, the subvalue that one wants to 
 enter
 @modifies the localStorage memory
 @return null
 */
 function setValue(key, value, newVal) {
 	var list = JSON.parse(localStorage.getItem("log-link: "+key));

 	console.log(newVal);
 	console.log(list);
 	console.log(list[value]);
 	list[value] = newVal;

 	localStorage.setItem("log-link: "+key, JSON.stringify(list));
 };

// helper method that tells you if the site has already
// been visited
function alreadyVisited(hostname) {
	if (JSON.parse(localStorage.getItem("log-link: "+hostname)) == null) {
		return false;
	} else {
		return true;
	};
};

// helper method that creates a new entry into localStorage
function createNewEntry(hostname, visitCount, timeSpent, lastTimeVisited, lastTimePaid) {
	var newEntry = {"visitCount" : visitCount,
	"timeSpent": timeSpent,
	"lastTimeVisited": lastTimeVisited,
	"lastTimePaid": lastTimePaid,
	"paymentInfo": null};
	localStorage.setItem("log-link: "+hostname, JSON.stringify(newEntry));
};

// listener for the message passing
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log("received");
    var payInfoEntry = {"paypalId": request.paypalId,
						"bitcoinId": request.bitcoinId};
	if (alreadyVisited(request.hostname)) {
    	setValue(request.hostname, "paymentInfo", JSON.stringify(payInfoEntry));
    }
    sendResponse({farewell: "goodbye"});
  }
);

// will be called when Tipsy icon is clicked. Opens up the Tipsy UI.
chrome.browserAction.onClicked.addListener(function() {

	if (!isIdle) {

		var d = new Date();
		curTime = d.getTime();
		
		var oldTimeSpent = getSubValue(curpage, "timeSpent");
		var prevLastTimeVisited = getSubValue(curpage, "lastTimeVisited");
		var newTimeSpent = oldTimeSpent + curTime - prevLastTimeVisited;

		if (alreadyVisited(curpage)) {
			setValue(curpage, "timeSpent", newTimeSpent);
		};

		prevpage = null;
		prevtabID = null;
		chrome.windows.create({url:chrome.extension.getURL('html/logPage.html'), type:'popup'}, function(window){});
	
		if (supports_html5_storage) {
			null
		};
	};
});

// called when focused moved to a new tab
chrome.tabs.onActivated.addListener(function(focusedTab) {
	console.log(document);
	if (!isIdle) {
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
						var oldVisitCount = getSubValue(curpage, "visitCount");
						var oldLastTimeVisited = getSubValue(curpage, "lastTimeVisited");

						var newVisitCount = oldVisitCount + 1;
						var newLastTimeVisited = curTime;

						setValue(curpage, "visitCount", newVisitCount);
						setValue(curpage, "lastTimeVisited", newLastTimeVisited);

						var oldTimeSpent = getSubValue(prevpage, "timeSpent");
						var prevLastTimeVisited = getSubValue(prevpage, "lastTimeVisited");
						var newTimeSpent = oldTimeSpent + curTime - prevLastTimeVisited;
						if (prevpage !== null) {
							setValue(prevpage, "timeSpent", newTimeSpent);
						};
					} else {
						createNewEntry(curpage, 1, 0, curTime, 0);
						var oldTimeSpent = getSubValue(prevpage, "timeSpent");
						var prevLastTimeVisited = getSubValue(prevpage, "lastTimeVisited");
						var newTimeSpent = oldTimeSpent + curTime - prevLastTimeVisited;
						if (alreadyVisited(prevpage) && (prevpage !== null)) {
							setValue(prevpage, "timeSpent", newTimeSpent);
						};
					};
				};
				prevpage = curpage;
			};	
		});
	};
});


// called when tab changes
chrome.tabs.onUpdated.addListener(function(updatedTabId){
	var nowpage;
	if (!isIdle) {
		var d = new Date();
		curTime = d.getTime();

		chrome.tabs.get(updatedTabId, function(tabInfo){
			parser.href = tabInfo.url;
			nowpage = parser.hostname;
			var d = new Date();
			curTime = d.getTime();
			var cookiesEnabled = navigator.cookieEnabled;

			if (true) { // cookiesenableed
				if ( prevpage !== nowpage
					&& updatedTabId == prevtabID) {

					curpage = nowpage;
				if (alreadyVisited(curpage)) {
					var oldVisitCount = getSubValue(curpage, "visitCount");
					var oldLastTimeVisited = getSubValue(curpage, "lastTimeVisited");

					var newVisitCount = oldVisitCount + 1;
					var newLastTimeVisited = curTime;

					setValue(curpage, "visitCount", newVisitCount);
					setValue(curpage, "lastTimeVisited", newLastTimeVisited);

					var oldTimeSpent = getSubValue(prevpage, "timeSpent");
					var prevLastTimeVisited = getSubValue(prevpage, "lastTimeVisited");
					var newTimeSpent = oldTimeSpent + curTime - prevLastTimeVisited;
					if (prevpage !== null) {
						setValue(prevpage, "timeSpent", newTimeSpent);
					};
				} else {
					createNewEntry(curpage, 1, 0, curTime, 0);
					var oldTimeSpent = getSubValue(prevpage, "timeSpent");
					var prevLastTimeVisited = getSubValue(prevpage, "lastTimeVisited");
					var newTimeSpent = oldTimeSpent + curTime - prevLastTimeVisited;
					if (alreadyVisited(prevpage)) {
						setValue(prevpage, "timeSpent", newTimeSpent);
					};

				};
				prevpage = nowpage;
				};
			};
		});
	};
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
			var oldTimeSpent = getSubValue(curpage, "timeSpent");
			var prevLastTimeVisited = getSubValue(curpage, "lastTimeVisited");
			var newTimeSpent = oldTimeSpent + curTime - prevLastTimeVisited;

			if (alreadyVisited(curpage)) {

				setValue(curpage, "timeSpent", newTimeSpent);
			};
			prevpage = null;
			prevtabID = null;
		} else {

		// check for active tab
			chrome.tabs.query({"active":true},function(ar){
				for (var i=0; i<ar.length; i++) {
				// check that active is in cur window
					if (ar[i].windowId === winId){
						parser.href = ar[i].url;
						curpage = parser.hostname;
						prevtabID = ar[i].id;
						if (alreadyVisited(curpage)) {
							var oldVisitCount = getSubValue(curpage, "visitCount");
							var oldLastTimeVisited = getSubValue(curpage, "lastTimeVisited");

							var newVisitCount = oldVisitCount + 1;
							var newLastTimeVisited = curTime;

							setValue(curpage, "visitCount", newVisitCount);
							setValue(curpage, "lastTimeVisited", newLastTimeVisited);
						} else {
							createNewEntry(curpage, 1, 0, curTime, 0);
						};

						if (true) {
							var oldTimeSpent = getSubValue(prevpage, "timeSpent");
							var prevLastTimeVisited = getSubValue(prevpage, "lastTimeVisited");
							var newTimeSpent = oldTimeSpent + curTime - prevLastTimeVisited;

							if (alreadyVisited(prevpage)) {
								setValue(prevpage, "timeSpent", newTimeSpent);
							};
						};
						prevpage = curpage;
					};
				};
			});
			STATE = 'in';
		};
	};//isidle
});


// listens for going in and out of idle
// There are three states: "idle", "locked" and "active"
chrome.idle.onStateChanged.addListener(function(result){
	var d = new Date();
	curTime = d.getTime();

	var winId;

	chrome.windows.getLastFocused(function (window){
		winId = window.id;
	});

	if (result == "idle"){
		if (!isIdle) {
			isIdle = true;

			var d = new Date();
			curTime = d.getTime();
		//	console.log(STATE);
			if (STATE == 'in'){
				var oldTimeSpent = getSubValue(curpage, "timeSpent");
				var prevLastTimeVisited = getSubValue(curpage, "lastTimeVisited");
				var newTimeSpent = oldTimeSpent + curTime - prevLastTimeVisited;
				if (alreadyVisited(curpage)) {
				setValue(curpage, "timeSpent", newTimeSpent);
				};
			};
			prevpage = null;
			prevtabID = null;
			if (STATE == 'out') {
				curpage = null;
			};
		};//isidle
	}; 

	
	if (result == "locked"){
		if (!isIdle) {
			isIdle = true;

			var d = new Date();
			curTime = d.getTime();
			//console.log(STATE);
			if (STATE == 'in'){
				var oldTimeSpent = getSubValue(curpage, "timeSpent");
				var prevLastTimeVisited = getSubValue(curpage, "lastTimeVisited");
				var newTimeSpent = oldTimeSpent + curTime - prevLastTimeVisited;
				if (alreadyVisited(curpage)) {
					setValue(curpage, "timeSpent", newTimeSpent);
				};
			};
			prevpage = null;
			prevtabID = null;
			if (STATE == 'out') {
				curpage = null;
			};

		}; //isidle
	}; 

	if (result == "active") {
		isIdle = false;
		var d = new Date();
		curTime = d.getTime();
		chrome.tabs.query({"active":true}, function(ar) {
			for (var i=0; i<ar.length; i++) {
				// check that active is in cur window
				if (ar[i].windowId === winId && STATE === 'in'){
					parser.href = ar[i].url;
					curpage = parser.hostname;
					prevtabID = ar[i].id;
					if (alreadyVisited(curpage)) {
						var oldVisitCount = getSubValue(curpage, "visitCount");
						var oldLastTimeVisited = getSubValue(curpage, "lastTimeVisited");

						var newVisitCount = oldVisitCount + 1;
						var newLastTimeVisited = curTime;

						setValue(curpage, "visitCount", newVisitCount);
						setValue(curpage, "lastTimeVisited", newLastTimeVisited);
					} else {
						createNewEntry(curpage, 1, 0, curTime, 0);
					};
				};
			};
		});
		prevpage = curpage;
	};
});

/* Issues:
	- domain name prob. eg, en.wikipedia.com, wikipedia.com
	- [FIXED] focus after close other window
	- [FIXED] need to handle when user leaves comp.
	- [FIXED] it recored newtab and figelcckdiggdclfohngjkhdkoicobaf
	- cookies enabled works. history not yet.
	- add extra column with payee info
	- give options for per page, per minute, set amount of money
	  per week, per month...

	 - reminder: time to make your payment


	 Questions:
	 	1) How/Should I implement the "calculate since"? ***NOT DOING***
	 	2) How to cap maximum?
		3) SelectCount is good?
		4) What should reminder look like?
*/
