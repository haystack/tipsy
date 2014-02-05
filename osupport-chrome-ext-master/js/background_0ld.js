var list = new Array();
var curPage;
var parser = document.createElement('a');
//var curTime;
//var lastTume;
var lastID = 0;

var allTabs = new Array()

// fucntion to test if browser supports localStorage
function supports_html5_storage() {
		try {
			return 'localStorage' in window && window['localStorage'] !== null;
			} catch (e) {
				return false;
			}};
// helper method to get a value of an entry			
function getValue(key, value) {
	var list = JSON.parse(localStorage.getItem(key));
	return list[value];
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
		};
	});
// will be called when a new site is visited


chrome.tabs.onActivated.addListener(function(result) {
	console.log("new focused!")

	//console.log(result);
	chrome.tabs.get(result.tabId, function(url) {
		//console.log(url.url);
		parser.href = url.url;
		console.log(parser.host);
		console.log("__________________________")
	});

});

chrome.tabs.onRemoved.addListener(function (result) {
	//console.log("removed")
	//console.log(result);
	chrome.tabs.query({},function (queried) {
		//console.log(queried.length);
		for (var i = 0; i < queried.length; i++){
			//console.log(queried[i].id);
		};
	});
});


chrome.history.onVisited.addListener(function(result) {
	console.log( "new site! history");
	parser.href = result.url;
	console.log(parser.host)
	console.log("__________________________")

	//localStorage.clear()
	curPage = result;
	//console.log(getValue(144, "url"));
	var curTime = (new Date).getTime();
	//console.log(lastID);
	if (lastID != 0) {
		var lastTime = getValue(lastID, 'timeStarted');
		var lastTimeSpent = getValue(lastID, 'timeSpent');
		timeSpent = lastTimeSpent + (curTime - lastTime);
		setValue(lastID, 'timeSpent', timeSpent);
	};

	// Set the timeSpent of the last ID
	//var lastTime = getValue(lastID, 'timeStarted')
	//timeSpent = curTime - lastTime
	//var testRead = localStorage.getItem('618');
	//console.log('testRead: ', JSON.parse(testRead));
	//console.log(result);
	//var newValue = {'url': url, 'globalVisitCount': globalVisitCount, 'timeStarted':timeStarted, 'timeSpent':0};
	//localStorage.setItem(id, JSON.stringify(newValue.visitCount));
    // if (supports_html5_storage) {
	    // 	console.log(localStorage.getItem('blah'));
	// };
	var id = curPage.id;
	var lastVisitTime = curPage.lastVisitTime;
	var title = curPage.title;
	var typedCount = curPage.typedCount;
	var globalVisitCount = curPage.visitCount;
	var url = curPage.url;


	// two cases:
	//     1) never visited site
	//	   2) site that has been visited
	
	if (localStorage.getItem(id) == null) {
		//console.log('in 1');
		newEntry = {'url': url, 
					'globalVisitCount': globalVisitCount,
					'localVisitCount': 0,
					'timeStarted': curTime,
					'timeSpent': 0};
		localStorage.setItem(id, JSON.stringify(newEntry));
	} else {
		//console.log('in 2');
		newLocalVisitCount = getValue(id, 'localVisitCount');
		//console.log(typeof newLocalVisitCount);
		newLocalVisitCount = newLocalVisitCount + 1;
		//console.log(newLocalVisitCount);
		timeSpent = getValue(id, 'timeSpent');

		newEntry = {'url':url,
					'globalVisitCount': globalVisitCount,
					'localVisitCount': newLocalVisitCount,
					'timeStarted': curTime,
					'timeSpent':timeSpent};
		localStorage.setItem(id, JSON.stringify(newEntry));
	};
	lastID = id;


	
	});
	
// $(document).on("click", "a", function(event) {
// 	var href = $(this).attr("href");
// 	console.log(href);
// 	console.log(event);
// 	//alert("you are jiefjoejfoiefe" _+ href);
// 	});