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


// Set idle time
chrome.idle.setDetectionInterval(15);

// function (bool) to check if html5 storage is supported
function supports_html5_storage() {
	try {
		return 'localStorage' in window && window['localStorage'] !== null;
	} catch (e) {
		return false;
	}};


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
 	list[value] = newVal;
 	localStorage.setItem("log-link: "+key, JSON.stringify(list));
 };

// helper method that tells you if the site has already
// been visited
function alreadyVisited(hostname) {
	if (JSON.parse(localStorage.getItem("log-link: "+hostname)) === null) {
		return false;
	} else {
		return true;
	};
};

function createNewEntry(hostname, visitCount, timeSpent, lastTimeVisited, lastTimePaid) {
	var newEntry = {"visitCount" : visitCount,
	"timeSpent": timeSpent,
	"lastTimeVisited": lastTimeVisited,
	"lastTimePaid": lastTimePaid};
	localStorage.setItem("log-link: "+hostname, JSON.stringify(newEntry));
};

// will be called when Tipsy icon is clicked
chrome.browserAction.onClicked.addListener(function() {

	if (!isIdle) {

		var d = new Date();
		curTime = d.getTime();

		/*prevpage = undefined. WHY???*/

		var oldTimeSpent = getSubValue(curpage, "timeSpent");
		var prevLastTimeVisited = getSubValue(curpage, "lastTimeVisited");
		var newTimeSpent = oldTimeSpent + curTime - prevLastTimeVisited;

		if (alreadyVisited(curpage)) {
			setValue(curpage, "timeSpent", newTimeSpent);
		};

		prevpage = null;
	//curpage = null;
	prevtabID = null;
	chrome.windows.create({url:chrome.extension.getURL('html/logPage.html'), type:'popup'}, function(window){});
	
	if (supports_html5_storage) {
		null
	};
	
	}; //isidle
});

// called when focused moved to a new tab
chrome.tabs.onActivated.addListener(function(focusedTab) {

	if (!isIdle) {

		var d = new Date();
		curTime = d.getTime();
		console.log('focus tab changed ' + d.toLocaleString());
		prevtabID = focusedTab.tabId;

		chrome.tabs.get(focusedTab.tabId, function(tabInfo) {

			parser.href = tabInfo.url;
			curpage = parser.hostname;
			var d = new Date();
			curTime = d.getTime();
			var cookiesEnabled = navigator.cookieEnabled;
			if (cookiesEnabled) {
				if ( prevpage !== curpage) {
				//console.log("focused");
				//console.log(curpage);
				//createNewEntry(curpage, 1,2,3);

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
					console.log(prevpage);
					if (prevpage !== null) {
						setValue(prevpage, "timeSpent", newTimeSpent);
					};
				} else {
					createNewEntry(curpage, 1, 0, curTime, 0);
					var oldTimeSpent = getSubValue(prevpage, "timeSpent");
					var prevLastTimeVisited = getSubValue(prevpage, "lastTimeVisited");
					var newTimeSpent = oldTimeSpent + curTime - prevLastTimeVisited;
					if (alreadyVisited(prevpage) && (prevpage !== null)) {
						//console.log('here');
						//console.log(prevpage);
						setValue(prevpage, "timeSpent", newTimeSpent);
					};
				};
			};
			prevpage = curpage;
			//console.log(prevpage);

		};	
	});
	}; //isidle
});


// called when tab changes
chrome.tabs.onUpdated.addListener(function(updatedTabId){
	var nowpage;
	if (!isIdle) {
		var d = new Date();
		curTime = d.getTime();
		console.log("tab change " +d.toLocaleString());

		chrome.tabs.get(updatedTabId, function(tabInfo){
			parser.href = tabInfo.url;
			nowpage = parser.hostname;
			var d = new Date();
			curTime = d.getTime();
			var cookiesEnabled = navigator.cookieEnabled;
		//console.log((updatedTabId== prevtabID) === (updatedTabId===prevtabID));
		
		console.log(prevpage + ' ' + nowpage);

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

			//console.log(prevpage);
		};
	});

	}; //isidle
});

// called when window changed
// has two cases:
// 1) left chrome: must update last visited time spent.
// 2) opened window, must create or update new entry.
chrome.windows.onFocusChanged.addListener(function(winId) {

	if (!isIdle) {

		var d = new Date();
		curTime = d.getTime();
		console.log("focus changed " + d.toLocaleString());


		if (winId === -1) {
			STATE = 'out';
			console.log(STATE);

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

chrome.idle.onStateChanged.addListener(function(result){
	var d = new Date();
	curTime = d.getTime();
	console.log(result + d.toLocaleString());
	

	var winId;

	chrome.windows.getLastFocused(function (window){
		winId = window.id;
	});

	if (result == "idle"){
		if (!isIdle) {
			isIdle = true;

			var d = new Date();
			curTime = d.getTime();
			console.log(STATE);
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
			console.log(STATE);
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
	 	1) How/Should we do the calculate since thing.
	 	2) 

*/
