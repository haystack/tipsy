'use strict';

var storage = require('./storage');

/**
 * Payment
 *
 * @return
 */
function Payment() {
  // By default enable synchronization.
  storage.setSync(true);
}

/**
 * calculate
 *
 * @return
 */
Payment.prototype.calculate = function() {
	if (PAYMETHOD == 'Threshold') {
		if (THRESHOLD != null && THRESHMETRICAMOUNT != null && THRESHMETRICTIMESPAN != null) {
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
			 		if (hostname !== "log-link: newtab" && hostname !== "log-link: "+ extensionID && hostname !== "log-link: " && hostname !== "log-link:" && hostname !== "" && hostname.substring(0,10) == "log-link: "){

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

module.exports = Payment;
