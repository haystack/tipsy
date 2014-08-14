define([
	"jquery",
	],
	function($) {
		var setup_listener = function() {
			chrome.runtime.onMessage.addListener(
				function(request, sender, sendResponse) {
					console.log("background message received");
					console.log(sender.tab ? "from a content script:" + sender.tab.url : "from the extension");
					if (request.name === "author-discovered") {
						sendResponse({name: "author-received", data: undefined});
					}
				}
			);
		}
		return {
			setup_listener: setup_listener,
		}

	}
);