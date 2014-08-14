define([
	"jquery",
	],
	function($) {

		/*
		Sends a message to the Chrome Extension and accepts a callback. The
		callback function should accept a response.
		*/
		var sendToExtension = function(message, callback) {
			chrome.runtime.sendMessage(message, callback);
		}


		/**
		The message name that should be listened for and a callback
		function to be invoked whenever a message with the given name is
		received. Callback function should take the request object and 
		*/
		var registerListener = function(messageName, callback) {
			chrome.runtime.onMessage.addListener(
				function(request, sender, sendResponse) {
					console.log(sender.tab ? "from a content script:" + sender.tab.url : "from the extension");
					if (request.name === messageName) {
						var result = callback(request, sender);
						sendResponse(result);
					}	
					
				}
			);


		}

		return {
			registerListener: registerListener,
			sendToExtension: sendToExtension,
		}

	}
);