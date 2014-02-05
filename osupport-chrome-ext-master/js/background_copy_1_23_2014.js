var STATE = 'start';
var parser = document.createElement('a');
var curFocused;
var lastUpdated;

var prevpage = null;
var prevtabID = null;
var curpage = null;
var lastFocusedWindowID = null;
var curTime;

// Set idle time
chrome.idle.setDetectionInterval(50);



function clone(obj) {
    if (null == obj || "object" != typeof obj) return obj;
    var copy = obj.constructor();
    for (var attr in obj) {
        if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
    };
    return copy;
};

function supports_html5_storage() {
		try {
			return 'localStorage' in window && window['localStorage'] !== null;
			} catch (e) {
				return false;
			}};

// helper method to get a value of an entry			
function getSubValue(key, value) {
	if (JSON.parse(localStorage.getItem(key)) == null ) {
		return null 
	} else {
	var list = JSON.parse(localStorage.getItem(key));
	return list[value];
	};
};

// helper method to set the value of an entry
function setValue(key, value, newVal) {
	//console.log(value);
	//console.log(key);
	var list = JSON.parse(localStorage.getItem(key));
	//console.log(list);
	list[value] = newVal;
	localStorage.setItem(key, JSON.stringify(list));
};

// helper method that tells you if the site has already
// been visited
function alreadyVisited(hostname) {
	if (JSON.parse(localStorage.getItem(hostname)) === null) {
		return false;
	} else {
		return true;
	};
};

function createNewEntry(hostname, visitCount, timeSpent, lastTimeVisited) {
	var newEntry = {'visitCount' : visitCount,
				'timeSpent': timeSpent,
				'lastTimeVisited': lastTimeVisited};
	localStorage.setItem(hostname, JSON.stringify(newEntry));
};

// will be called when Tipsy icon is clicked
chrome.browserAction.onClicked.addListener(function() {
	var d = new Date();
	curTime = d.getTime();

	/*prevpage = undefined. WHY???*/

	var oldTimeSpent = getSubValue(curpage, 'timeSpent');
	var prevLastTimeVisited = getSubValue(curpage, 'lastTimeVisited');
	var newTimeSpent = oldTimeSpent + curTime - prevLastTimeVisited;
		//console.log(curpage);
		//console.log(alreadyVisited(curpage));
	if (alreadyVisited(curpage)) {
			//console.log('in here');
			//console.log(curpage);
			//localStorage.setItem('ha', 'ha');
			//console.log(newTimeSpent);
		setValue(curpage, 'timeSpent', newTimeSpent);
	};
	//lastFocusedWindowID = -1;
	prevpage = null;
	//curpage = null;
	prevtabID = null;
	chrome.windows.create({url:chrome.extension.getURL('html/logPage.html'), type:'popup'}, function(window){});
	
	if (supports_html5_storage) {
		null
	};
});

 

// called when focused moved to a new tab
chrome.tabs.onActivated.addListener(function(focusedTab) {
	//console.log('focus');
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
					createNewEntry(curpage, 1, 0, curTime);
					var oldTimeSpent = getSubValue(prevpage, 'timeSpent');
					var prevLastTimeVisited = getSubValue(prevpage, 'lastTimeVisited');
					var newTimeSpent = oldTimeSpent + curTime - prevLastTimeVisited;
					if (alreadyVisited(prevpage)) {
						//console.log('here');
						//console.log(prevpage);
						setValue(prevpage, 'timeSpent', newTimeSpent);
					};
				};
			};
			prevpage = curpage;
			//console.log(prevpage);

		};	
	});

});


// called when tab changes
chrome.tabs.onUpdated.addListener(function(updatedTabId){
	chrome.tabs.get(updatedTabId, function(tabInfo){
		parser.href = tabInfo.url;
		curpage = parser.hostname;
		var d = new Date();
		curTime = d.getTime();
		var cookiesEnabled = navigator.cookieEnabled;
		if (cookiesEnabled) {
			if ( prevpage !== curpage
				&& updatedTabId === prevtabID) {
				//console.log("updated");
				//console.log(curpage);
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
					createNewEntry(curpage, 1, 0, curTime);
					var oldTimeSpent = getSubValue(prevpage, 'timeSpent');
					var prevLastTimeVisited = getSubValue(prevpage, 'lastTimeVisited');
					var newTimeSpent = oldTimeSpent + curTime - prevLastTimeVisited;
					if (alreadyVisited(prevpage)) {
						setValue(prevpage, 'timeSpent', newTimeSpent);
					};

				};
			};
			prevpage = curpage;
			//console.log(prevpage);
		};
	});
});

// called when window changed
// has two cases:
// 1) left chrome: must update last visited time spent.
// 2) opened window, must create or update new entry.
chrome.windows.onFocusChanged.addListener(function(winId) {

	if (winId === -1) {
		var d = new Date();
		curTime = d.getTime();

		/*prevpage = undefined. WHY???*/

		var oldTimeSpent = getSubValue(curpage, 'timeSpent');
		var prevLastTimeVisited = getSubValue(curpage, 'lastTimeVisited');
		var newTimeSpent = oldTimeSpent + curTime - prevLastTimeVisited;
		//console.log(curpage);
		//console.log(alreadyVisited(curpage));
		if (alreadyVisited(curpage)) {
			//console.log('in here');
			//console.log(curpage);
			//localStorage.setItem('ha', 'ha');
			//console.log(newTimeSpent);
			setValue(curpage, 'timeSpent', newTimeSpent);
		};
		//lastFocusedWindowID = -1;
		prevpage = null;
		//curpage = null;
		prevtabID = null;
	} else {
		// check for active tab
		chrome.tabs.query({"active":true},function(ar){
			// check foe
			for (var i=0; i<ar.length; i++) {
				// check that active is in cur window
				if (ar[i].windowId === winId){
					parser.href = ar[i].url;
					curpage = parser.hostname;
					//console.log(curpage);

					if (alreadyVisited(curpage)) {
						var oldVisitCount = getSubValue(curpage, 'visitCount');
						var oldLastTimeVisited = getSubValue(curpage, 'lastTimeVisited');

						var newVisitCount = oldVisitCount + 1;
						var newLastTimeVisited = curTime;

						setValue(curpage, 'visitCount', newVisitCount);
						setValue(curpage, 'lastTimeVisited', newLastTimeVisited);
					} else {
						createNewEntry(curpage, 1, 0, curTime);

					};

					// create new or update entries 
					
				}
			}

		});
	};
});

chrome.idle.onStateChanged.addListener(function(result){
	console.log(result);
	if (result === "idle") {
		var d = new Date();
		curTime = d.getTime();

		var oldTimeSpent = getSubValue(curpage, 'timeSpent');
		var prevLastTimeVisited = getSubValue(curpage, 'lastTimeVisited');
		var newTimeSpent = oldTimeSpent + curTime - prevLastTimeVisited;
		if (alreadyVisited(curpage)) {
			setValue(curpage, 'timeSpent', newTimeSpent);
		};
		prevpage = null;
		prevtabID = null;
	} else if (result === "active") {
		var winId;
		chrome.windows.getLastFocused(function (window){
			winId = window.id;
		});

		chrome.tabs.query({"active":true},function(ar){
			// check foe
			for (var i=0; i<ar.length; i++) {
				// check that active is in cur window
				if (ar[i].windowId === winId){
					parser.href = ar[i].url;
					curpage = parser.hostname;
					//console.log(curpage);

					if (alreadyVisited(curpage)) {
						var oldVisitCount = getSubValue(curpage, 'visitCount');
						var oldLastTimeVisited = getSubValue(curpage, 'lastTimeVisited');

						var newVisitCount = oldVisitCount + 1;
						var newLastTimeVisited = curTime;

						setValue(curpage, 'visitCount', newVisitCount);
						setValue(curpage, 'lastTimeVisited', newLastTimeVisited);
					} else {
						createNewEntry(curpage, 1, 0, curTime);

					};

					// create new or update entries 
					
				}
			}

		});

	};


});
/* Issues:
	- domain name prob. eg, en.wikipedia.com, wikipedia.com
	- focus after close other window
	- need to handle when user leaves comp.
	- [FIXED] it recored newtab and figelcckdiggdclfohngjkhdkoicobaf
	- cookies enabled works. history not yet.
	- add extra column with payee info
	- give options for per page, per minute, set amount of money
	  per week, per month...
	 - tabs on top 
	 - reminder: time to make your payment
	 - tab name: "MY BILL"
	*/
