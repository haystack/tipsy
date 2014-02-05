

var parser = document.createElement('a');
var curFocused;
// current focused tabId and time started
curFocused = {"tabId": null, "URL": null, "timeStarted":null}; 
var lastFocused; // last focued tabId and time spent
lastFocused = {"tabId": null, "URL": null, "timeStarted":null};
// fucntion to test if browser supports localStorage

var lastHist;



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
function getValue(key, value) {
	if (JSON.parse(localStorage.getItem(key)) == null ) {
		return null 
	} else {
	var list = JSON.parse(localStorage.getItem(key));
	return list[value];
	};
};
// helper method to set the value of an entry
function setValue(key, value, newVal) {
	var list = JSON.parse(localStorage.getItem(key));
	list[value] = newVal;
	localStorage.setItem(key, JSON.stringify(list));
};

// will be called when Tipsy icon is clicked
chrome.browserAction.onClicked.addListener(function() {

	chrome.windows.create({url:chrome.extension.getURL('html/logPage.html'), type:'popup'}, function(window){});
	
	if (supports_html5_storage) {
		null
	};
});
// will be called when a new site is visited


chrome.tabs.onRemoved.addListener(function (result) {
	//lastHist = null;
	chrome.tabs.query({},function (queried) {
		for (var i = 0; i < queried.length; i++){
		};
	});
});



chrome.tabs.onActivated.addListener(function(result) {
	if (curFocused.URL != null) {
		lastFocused = clone(curFocused); // takes a copy
	};

	chrome.tabs.get(result.tabId, function(url) {

		parser.href = url.url;
		curFocused.tabId = result.tabId;
        curFocused.URL = parser.hostname;
        //console.log(curFocused.URL);
        //console.log(getValue(curFocused.URL, "lastTimeStarted"));

    	if (getValue(curFocused.URL, "lastTimeStarted") != null) {
    		
        	curFocused.timeStarted = getValue(
        					parser.hostname, "lastTimeStarted");
        } else {
        	curFocused.timeStarted = (new Date).getTime();
        };
	});

	//console.log("--------");
	console.log(curFocused);
	//console.log(lastFocused);
	if (curFocused.URL != lastFocused.URL) {
		var newEntry;
		var newLocalVisitCount; var timeSpent;
		var curTime = (new Date).getTime();

		if (getValue(curFocused.URL, "lastTimeStarted") != null) {
			var timespan = getValue(lastFocused.URL('timeStarted'));
			setValue(lastFocused.URL, 'timeSpent', 
					 curTime - timespan);
		};

		if (getValue(curFocused.URL, "lastTimeStarted") != null) {
			var timespan = getValue(lastFocused.URL('timeStarted'));
			setValue(lastFocused.URL, 'timeStarted', 
					 curTime);
		} else {
			console.log("curfocused is not in localstorage.");
		};

	};

});




chrome.history.onVisited.addListener(function(result) {

	parser.href = result.url;
	URL = parser.hostname;

	

	if (URL != lastHist) {//&& (result.id == curFocused.tabId))  {
		var newEntry;
		var curTime = (new Date).getTime();
		lastFocused = clone(curFocused);
        curFocused.URL = URL;
        curFocused.timeStarted = curTime;
		
		if (localStorage.getItem(URL) == null)  {

			newEntry = {'globalVisitCount': result.visitCount,
						'localVisitCount': 0,
						'lastTimeStarted': curTime,
						'timeSpent': 0};
			localStorage.setItem(URL, JSON.stringify(newEntry));
		} else  {
			newLocalVisitCount = getValue(URL, 'localVisitCount');
			newLocalVisitCount++;
			timeSpent = getValue(URL, 'timeSpent');

			newEntry = {'globalVisitCount': result.visitCount,
						'localVisitCount': newLocalVisitCount,
						'lastTimeStarted': curTime,
						'timeSpent':timeSpent};
			localStorage.setItem(URL, JSON.stringify(newEntry));
		}

		console.log(curFocused);
	} else {
		console.log("hello");
	}

	lastHist = URL;
	});