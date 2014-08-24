var row;
var hostname;
var visitCount;
var timeSpent;
var lastTimeVisited;
var lastTimePaid;
var d = new Date

for (var i = 0; i < localStorage.length; i++) {
	hostname = localStorage.key(i);
	extensionID = chrome.runtime.id;
	if (hostname !== 'log-link: newtab' && hostname !== "log-link: "+extensionID && hostname.substring(0,10) == "log-link: "){
		hostname = hostname.replace("log-link: ", "");
		row = JSON.parse(localStorage.getItem(localStorage.key(i)));
		visitCount = row['visitCount'];
		timeSpent = row['timeSpent'];
		lastTimeVisited = row['lastTimeVisited'];
		lastTimePaid = row['lastTimePaid'];

		if (lastTimePaid == 0) {
			lastTimePaid = 'never';
		} else {
			 lastTimePaid = new Date(lastTimePaid);
			lastTimePaid = lastTimePaid.toLocaleString();
		};
		var dLastTimeVisited = new Date(lastTimeVisited);
		var imsrc = "http://www.google.com/s2/favicons?domain=" +hostname;
		if (timeSpent > 5000 ){
			$('#myTable > tbody').append('<tr><td><img src='+imsrc+'/>'+'     '+String(hostname)+'</td><td>'+String(visitCount)+'</td><td>'+String(msToTime(timeSpent))+'</td><td>'+dLastTimeVisited.toLocaleString()+'</td><td>'+lastTimePaid+'</td></tr>');
		}
	};
};

$('td').keypress(function(evt){
    if(evt.which == 13){
        event.preventDefault();
        var cellindex = $(this).index()
        // get next row, then select same cell index
        var rowindex = $(this).parents('tr').index() + 1
        $(this).parents('table').find('tr:eq('+rowindex+') td:eq('+cellindex+')').focus()
    }
})
