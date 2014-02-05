/**

Script for the popup. Takes care of all 3 tabs: Log Page,
Conifguration and My Bill.

Uses Local Storage for storing settings.

Philippe Schiff


*/
$(function(){
  $("#myTable").tablesorter({
  	sortList: [[2,1]]
	});
});

$('#datepicker').datepicker();

$('#tipsyTabs a[href="#logTable"]').tab('show');


// Threshold globals

var PAYMETHOD = null;
var THRESHOLD = null;
var MAXPAYMENT = null;
var THRESHMETRICAMOUNT = null;
var THRESHMETRICTIMESPAN = null;
var CALCULATESINCE = null;
var REMINDMENUM = null; 
var REMINDMEPERIOD = null;
var THRESHREACHED = null;
var dolPattern =  /^\$?[0-9]+(\.[0-9][0-9])?$/;
var numPat0to30 = /^([1-9]|[12]\d|3[0-6])$/;

if (localStorage.getItem("setting: PAYMETHOD") === null) {
	PAYMETHOD = null;
} else {
	PAYMETHOD = localStorage.getItem("setting: PAYMETHOD");
	$("#selectPayMethodDD").val(PAYMETHOD);
	$("#payMethodSpan").append(PAYMETHOD);
}

if (localStorage.getItem("setting: THRESHOLD") === null ) {
	THRESHOLD = null;
} else {
	THRESHOLD = localStorage.getItem("setting: THRESHOLD");
	$("#thresholdInput").val(THRESHOLD);
};


if (localStorage.getItem("setting: MAXPAYMENT") === null) {
	MAXPAYMENT = null;	
} else {
	MAXPAYMENT = localStorage.getItem("setting: MAXPAYMENT");
	$("#maxpayInput").val(MAXPAYMENT);
};


if (localStorage.getItem("setting: THRESHMETRICAMOUNT") === null) {
	THRESHMETRICAMOUNT = null;
} else {
	THRESHMETRICAMOUNT = localStorage.getItem("setting: THRESHMETRICAMOUNT");
	$("#metricAmountInput").val(THRESHMETRICAMOUNT);
};


if (localStorage.getItem("setting: THRESHMETRICTIMESPAN") === null) {
	THRESHMETRICTIMESPAN = null;
} else {
	THRESHMETRICTIMESPAN = localStorage.getItem("setting: THRESHMETRICTIMESPAN");
	//console.log(THRESHMETRICTIMESPAN);
	$("#metricTimeSpanDD").val(THRESHMETRICTIMESPAN);
};


if (localStorage.getItem("setting: CALCULATESINCE") === null) {
	CALCULATESINCE = null;
} else {

	if (localStorage.getItem("setting: CALCULATESINCE") == 'last'){
		CALCULATESINCE = 'last';
		$("#optionCalcSince1").prop("checked", true);
	} else {

		CALCULATESINCE = localStorage.getItem("setting: CALCULATESINCE");
		$("#datepicker").datepicker("setDate", CALCULATESINCE);
	};
};


if (localStorage.getItem("setting: REMINDMENUM") === null ) {
	REMINDMENUM = null;
} else {
	REMINDMENUM = localStorage.getItem("setting: REMINDMENUM");
	$("#remindMeNumber").val(REMINDMENUM);
};


if (localStorage.getItem("setting: REMINDMEPERIOD") === null) {
	REMINDMEPERIOD = null;
} else {
	REMINDMEPERIOD = localStorage.getItem("setting: REMINDMEPERIOD");
	$("#remindMePeriodDD").val(REMINDMEPERIOD);
};


if (localStorage.getItem("setting: THRESHREACHED") === null ||
	localStorage.getItem("setting: THRESHREACHED") == "false") {
	THRESHREACHED = false;
	$("#threshReachedCB").prop('checked', false);
}  else {
	THRESHREACHED = true;
	$("#threshReachedCB").prop('checked', true);
};


/**
Handles the Apply Changes button.
@modifies the globals and Local Storage
*/


$("#applyChangesBtn").click(function() {
	var formsComplete = true;

	if ($("#selectPayMethodDD").val() != "Threshold" &&
		$("#selectPayMethodDD").val() != "Lottery") {


		$("#payMethodErrDiv").addClass("has-error");
		formsComplete = false;

	} else

	//if ($("#selectPayMethodDD").val() !== null &&
		//$("#selectPayMethodDD").val() !== "") 
	{
		$("#payMethodErrDiv").removeClass("has-error");
		PAYMETHOD = $("#selectPayMethodDD").val();
		localStorage.setItem("setting: PAYMETHOD", PAYMETHOD);
	};




	if (!dolPattern.test($("#thresholdInput").val())) {
		$("#thresholErrDiv").addClass("has-error");
		formsComplete = false;
	} else

	//if ($("#thresholdInput").val() !== null &&
	//	$("#thresholdInput").val() !== "") 
	{
		$("#thresholErrDiv").removeClass("has-error");
		THRESHOLD = $("#thresholdInput").val();
		localStorage.setItem("setting: THRESHOLD", THRESHOLD);
	};


	if (!dolPattern.test($("#maxpayInput").val()) &&
		$("#maxpayInput").val() != null &&
		$("#maxpayInput").val() != "") {
		$("#maxPaymentErrDiv").addClass("has-error");
		formsComplete = false;
	} else 

	//if ($("#maxpayInput").val() !== null &&
	//	$("#maxpayInput").val() !== "") 
	{
		MAXPAYMENT = $("#maxpayInput").val();
		localStorage.setItem("setting: MAXPAYMENT", MAXPAYMENT);
		$("#maxPaymentErrDiv").removeClass("has-error");
	};


	if (!dolPattern.test($("#metricAmountInput").val())) {
		$("#metricAmountErrDiv").addClass("has-error");
		formsComplete = false;
	} else 


	//if ($("#metricAmountInput").val() !== null &&
	//	$("#metricAmountInput").val() !== "") 
	{
		THRESHMETRICAMOUNT = $("#metricAmountInput").val();
		$("#metricAmountErrDiv").removeClass("has-error");
		localStorage.setItem("setting: THRESHMETRICAMOUNT", THRESHMETRICAMOUNT);
	};



	if ($("#metricTimeSpanDD").val() != 'second' &&
		$("#metricTimeSpanDD").val() != 'min' &&
		$("#metricTimeSpanDD").val() != 'page visit') {

		$("#metricTimeSpanErrDiv").addClass("has-error");
		formsComplete = false;
	} else 

	//if ($("#metricTimeSpanDD").val() !== null &&
	//	$("#metricTimeSpanDD").val() !== "") 
	{
		THRESHMETRICTIMESPAN = $("#metricTimeSpanDD").val();
		localStorage.setItem("setting: THRESHMETRICTIMESPAN", THRESHMETRICTIMESPAN);
		$("#metricTimeSpanErrDiv").removeClass("has-error");
	};



	if ($("#optionCalcSince1").is(':checked')) {
		CALCULATESINCE = 'last';
		localStorage.setItem("setting: CALCULATESINCE", CALCULATESINCE);
	} else {

		if ($("#datepicker").val() == "") {
			$("#dateErrDiv").addClass("has-error");
			formsComplete = false;
		} else 

		//if ($("#datepicker").val() !== null &&
		//	$("#datepicker").val() !== "") 
		{
			CALCULATESINCE = $("#datepicker").val();
			$("#dateErrDiv").removeClass("has-error");
			//console.log(CALCULATESINCE);
			localStorage.setItem("setting: CALCULATESINCE", CALCULATESINCE);
		};
	};


	if ($("#remindMeNumber").val() !== null &&
		$("#remindMeNumber").val() !== "" &&
		parseInt($("#remindMeNumber").val()) <= 30 &&
		parseInt($("#remindMeNumber").val()) >= 0) {
		REMINDMENUM = $("#remindMeNumber").val();
		localStorage.setItem("setting: REMINDMENUM", REMINDMENUM);
	} else {
	};

	if ($("#remindMePeriodDD").val() !== null &&
		$("#remindMePeriodDD").val() !== "") {
		REMINDMEPERIOD = $("#remindMePeriodDD").val();
		localStorage.setItem("setting: REMINDMEPERIOD", REMINDMEPERIOD);
	};

	THRESHREACHED = $("#threshReachedCB").prop('checked');
	localStorage.setItem("setting: THRESHREACHED", THRESHREACHED);


	// ALERT BAR
	if (formsComplete) {
		$('#alertDiv').html('<div id="al" class="alert alert-success">You\'re changes have been saved!</div>');
	
		window.setTimeout(function() {
			$('#al').alert('close');
		}, 2000);
	} else {
		$('#alertDiv').html('<div id="al" class="alert alert-danger">You have not correctly filled out all fields. Please try again.</div>');
		window.setTimeout(function() {
			$('#al').alert('close');
		}, 2000);
	}



	// CALCULATE!
	calculate();
});

function calculate() {
	if (PAYMETHOD == 'Threshold') {
		if (THRESHOLD != null && 
			THRESHMETRICAMOUNT != null &&
			THRESHMETRICTIMESPAN != null
			) {
			 if (CALCULATESINCE == 'last') {
			 	var price;
			 	var timeDenom;
			 	var timeMS;
			 	var calcRow
			 	var time
			 	switch(THRESHMETRICTIMESPAN) {
			 		case 'second':
			 			timeDenom = 1000;
			 			break;
			 		case 'min':
			 			timeDenom = 60000;
			 			break;

			 		default:
			 			timeDenom = 'no time metric';
			 	};
			 	$("#priceDiv").empty();
			 	for (var i = 0; i < localStorage.length; i++) {
			 		
			 		hostname = localStorage.key(i);
					extensionID = chrome.runtime.id;
					//console.log('here');
			 		if (hostname !== "log-link: newtab" && 
			 			hostname !== "log-link: "+extensionID &&
			 			hostname !== "log-link: " &&
			 			 hostname.substring(0,10) == "log-link: "){
			 			//yesconsole.log('here');
			 			console.log(timeDenom);
			 			calcRow = JSON.parse(localStorage.getItem(localStorage.key(i)));
			 			timeMS =  parseInt(calcRow['timeSpent']);
			 			if (timeDenom != 'no time metric'){
			 				time = timeMS / timeDenom;
			 				console.log(THRESHMETRICAMOUNT);
			 				price = time * THRESHMETRICAMOUNT;
			 				if (price >= THRESHOLD) {
			 					$("#priceDiv").append(hostname.replace("log-link:", "") + ": $"+price+"<br>");
			 				};
			 			};
			 		};
			 	};
			};
		};
	};
};

function msToTime(s) {
  var ms = s % 1000;
  s = (s - ms) / 1000;
  var secs = s % 60;
  s = (s - secs) / 60;
  var mins = s % 60;
  var hrs = (s - mins) / 60;

  return hrs + ':' + mins + ':' + secs;
}

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
	//console.log(extensionID);
	if (hostname !== 'log-link: newtab' && hostname !== "log-link: "+extensionID && hostname.substring(0,10) == "log-link: "){
		hostname = hostname.replace("log-link: ", "");
		row = JSON.parse(localStorage.getItem(localStorage.key(i)));
		//console.log(row)
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
		$('#myTable > tbody').append('<tr><td><img src='+imsrc+'/>'+'     '+String(hostname)+'</td><td>'+String(visitCount)+'</td><td>'+String(msToTime(timeSpent))+'</td><td>'+dLastTimeVisited.toLocaleString()+'</td><td>'+lastTimePaid+'</td></tr>');
	};
};