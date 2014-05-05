//alert("hello");
//console.log(window.location.hostname);


//console.log(document.getElementsByTagName('link')[0]['rel']);
//console.log(document.getElementsByTagName('link')[0].getAttribute('blargh'));

var linksAr = document.getElementsByTagName('link');
var len = linksAr.length;
var hostname = window.location.hostname;
var bitcoinId = null;
var payPalId = null;
for (var i = 0; i < len; i++) {
	if (linksAr[i].getAttribute('bitcoinid') != null) {
		bitcoinId = linksAr[i].getAttribute('bitcoinid');
	}
	if (linksAr[i].getAttribute('paypalid') != null) {
		payPalId = linksAr[i].getAttribute('paypalid');
	}

	// can add more...
	console.log(payPalId);
	console.log(bitcoinId);
	if (payPalId != null || bitcoinId != null ) {
		chrome.runtime.sendMessage({hostname: hostname, bitcoinId: bitcoinId, payPalId: payPalId}, function(response) {
  		console.log(response.farewell);
});
	}
}

