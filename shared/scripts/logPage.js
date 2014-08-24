'use strict';

calculate();

$('#datepicker').datepicker();
$('#tipsyTabs a[href="#logTable"]').tab('show');

var extensionID = null;
var dolPattern =  /^\$?[0-9]+(\.[0-9][0-9])?$/;
var numPat0to30 = /^([1-9]|[12]\d|3[0-6])$/;

"PAYMETHOD": {
  $("#selectPayMethodDD").val(PAYMETHOD);
  $("#payMethodSpan").append("<span id=\"payMethodWord\">"+PAYMETHOD+"</span>");
}
"THRESHOLD": {
	THRESHOLD = localStorage.getItem("setting: THRESHOLD");
	$("#thresholdInput").val(THRESHOLD);
}
"MAXPAYMENT": {
	MAXPAYMENT = localStorage.getItem("setting: MAXPAYMENT");
	$("#maxpayInput").val(MAXPAYMENT);
}
"THRESHMETRICAMOUNT": {
	THRESHMETRICAMOUNT = localStorage.getItem("setting: THRESHMETRICAMOUNT");
	$("#metricAmountInput").val(THRESHMETRICAMOUNT);
}
"THRESHMETRICTIMESPAN": {
	THRESHMETRICTIMESPAN = localStorage.getItem("setting: THRESHMETRICTIMESPAN");
	$("#metricTimeSpanDD").val(THRESHMETRICTIMESPAN);
}
// TODO This needs more work.
"CALCULATESINCE": {
  if (localStorage.getItem("setting: CALCULATESINCE") == 'last'){
    CALCULATESINCE = 'last';
    $("#optionCalcSince1").prop("checked", true);
  } else {

    CALCULATESINCE = localStorage.getItem("setting: CALCULATESINCE");
    $("#datepicker").datepicker("setDate", CALCULATESINCE);
  }
}
"REMINDMENUM": {
	REMINDMENUM = localStorage.getItem("setting: REMINDMENUM");
	$("#remindMeNumber").val(REMINDMENUM);
}
"REMINDMEPERIOD": {
	REMINDMEPERIOD = localStorage.getItem("setting: REMINDMEPERIOD");
	$("#remindMePeriodDD").val(REMINDMEPERIOD);
}
"THRESHREACHED": {
	THRESHREACHED = true;
	$("#threshReachedCB").prop('checked', THRESHREACHED);
}

$("#applyChangesBtn").click(function() {
	var formsComplete = true;

	if ($("#selectPayMethodDD").val() != "Threshold" &&
		$("#selectPayMethodDD").val() != "Lottery") {
		$("#payMethodErrDiv").addClass("has-error");

		formsComplete = false;
	} else {
		$("#payMethodErrDiv").removeClass("has-error");
		PAYMETHOD = $("#selectPayMethodDD").val();
		localStorage.setItem("setting: PAYMETHOD", PAYMETHOD);
	}

	if (!dolPattern.test($("#thresholdInput").val())) {
		$("#thresholErrDiv").addClass("has-error");
		formsComplete = false;
	} else {
		$("#thresholErrDiv").removeClass("has-error");
		THRESHOLD = $("#thresholdInput").val();
		localStorage.setItem("setting: THRESHOLD", THRESHOLD);
	};


	if (!dolPattern.test($("#maxpayInput").val()) &&
		$("#maxpayInput").val() != null &&
		$("#maxpayInput").val() != "") {
		$("#maxPaymentErrDiv").addClass("has-error");
		formsComplete = false;
	} else {
		MAXPAYMENT = $("#maxpayInput").val();
		localStorage.setItem("setting: MAXPAYMENT", MAXPAYMENT);
		$("#maxPaymentErrDiv").removeClass("has-error");
	};

	if (!dolPattern.test($("#metricAmountInput").val())) {
		$("#metricAmountErrDiv").addClass("has-error");
		formsComplete = false;
	} else 	{
		THRESHMETRICAMOUNT = $("#metricAmountInput").val();
		$("#metricAmountErrDiv").removeClass("has-error");
		localStorage.setItem("setting: THRESHMETRICAMOUNT", THRESHMETRICAMOUNT);
	};

	if ($("#metricTimeSpanDD").val() != 'second' &&
		$("#metricTimeSpanDD").val() != 'min' &&
		$("#metricTimeSpanDD").val() != 'page visit') {

		$("#metricTimeSpanErrDiv").addClass("has-error");
		formsComplete = false;
	} else {
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
		} else 	{
			CALCULATESINCE = $("#datepicker").val();
			$("#dateErrDiv").removeClass("has-error");
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
			 	var totalPrice = 0;
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
			 	$("#payTable tr:gt(0)").remove(); // removes all rows except first
			 	$("#myTable tr:gt(0)").css('font-weight', 'normal');
			 	for (var i = 0; i < localStorage.length; i++) {

			 		hostname = localStorage.key(i);
					extensionID = chrome.runtime.id;
			 		if (hostname !== "log-link: newtab" &&
			 			hostname !== "log-link: "+ extensionID &&
			 			hostname !== "log-link: " &&
			 			hostname !== "log-link:" &&
			 			hostname !== "" &&
			 			 hostname.substring(0,10) == "log-link: "){

			 			calcRow = JSON.parse(localStorage.getItem(localStorage.key(i)));
			 			timeMS =  parseInt(calcRow['timeSpent']);
			 			if (timeDenom != 'no time metric'){
			 				time = timeMS / timeDenom;
			 				price = time * THRESHMETRICAMOUNT;
			 				totalPrice += price;
			 				if (price > 0.01) {  //(price >= THRESHOLD) {

			 					var search = hostname.replace("log-link: ", "");
			 					var imsrc = "http://www.google.com/s2/favicons?domain=" +search;
			 					$('#payTable > tbody').append('<tr><td><img src='+imsrc+'/>'+'     '+String(search)+'</td><td contenteditable=\'true\'>'+ "$ "+String(price.toFixed(2))+'</td></tr>');
   								$("#myTable tr").filter(function() {
        							return $(this).text().indexOf(search) != -1;
    							}).css('font-weight','bold');
			 				};
			 			};
			 		};
			 	};
			 	if (totalPrice >= THRESHOLD) {
			 		$('#reachedThreshDiv').remove();
			 		$('#outer').append("<div class=\"span12\" id = \"reachedThreshDiv\"><h3 class=\"alert alert-warning\">You have reached your threshold value of $" + THRESHOLD+" with a total amount of $"+String(totalPrice.toFixed(2))+".</h3></div>");
			 	} else {
			 		$('#reachedThreshDiv').remove();
			 		$('#outer').append("<div class=\"span12\" id = \"reachedThreshDiv\"><h4 class=\"alert alert-info\">You current total browsing contribution amounts to $"+String(totalPrice.toFixed(2))+". This has not yet reached the threshold of $"+THRESHOLD+".</h4></div>");
			 	}
			};
		};
	};
};
