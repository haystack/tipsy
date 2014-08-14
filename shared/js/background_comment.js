requirejs.config(requirejsConfig);
requirejs([
	"jquery", 
	"test2",
	"handlebars",
	"comm",
	"store",
	"closure",
	],
	function($, myModule, hb, comm, store, closure) {
		console.log("hello");
		console.log("Background modules:", $, myModule, hb, comm);
		console.log("My favorite:" + myModule.color);
		console.log("My second favorite color " + myModule.baseColor);

		comm.registerListener("visit", function(request, sender) {
			console.log(request);
			store.open(store.add, request);
			return {name: "visit-received"};
		});

		// var googleAuth = new OAuth2('google', {
		// 	client_id: '526777043427.apps.googleusercontent.com',
		// 	client_secret: 'C2zbqgdDaLXKSAeUWtr8oQec',
		// 	api_scope: 'https://www.googleapis.com/auth/tasks'
		// });
		// console.log(googleAuth);

		// googleAuth.authorize(function() {
		// 	console.log("Inside authorize!")
  // 			// Ready for action

  // 			// var request = $.ajax({
  // 			// 	type: "GET",
  // 			// 	url: "https://www.googleapis.com/tasks/v1/users/me/lists",
  // 			// 	data: {},
  // 			// 	contentType: "application/json",
  // 			// 	dataType: "json",
  // 			// 	success: function(response) {
  // 			// 		console.log(response);
  // 			// 	},
  // 			// 	headers: {'Authorization': 'OAuth ' + google.getAccessToken()}
  // 			// });
		// });

		var dwollaAuth = new OAuth2('dwolla', {
			client_id: 'x5s2B3hLc3YqW5rE1lBT3pBiq8NDUVymbbcdRg+kfFQVEAN1QP',
			client_secret: 'O1UaGQsQp7OSWHrOFAT/PSDvzPC8BKZms9UJOpGpo7G93aS8Tz',
			api_scope: 'Send'
		});
		//console.log(dwollaAuth);
		//console.log("hello")

		dwollaAuth.authorize(function() {
			console.log("Inside Dwolla authorize!");

			var request = $.ajax({
  				type: "POST",
  				url: "https://www.dwolla.com/oauth/rest/transactions/send",
  				data: {
  					"oauth_token": dwollaAuth.getAccessToken(),
  					"pin": "4268",
  					"destinationId": "812-560-5495",
  					"amout": 5
  				},
  				contentType: "application/json",
  				dataType: "json",
  				success: function(response) {
  					console.log(response);
  				},
  				headers: {'Authorization': 'OAuth ' + google.getAccessToken()}
  			});



		});
	


		// var incrementA = closure.counterA();
		// console.log(incrementA());
		// console.log(incrementA());

		// var incrementB = closure.counterB();
		// console.log(incrementB());
		// console.log(incrementB());

		// var incrementC = closure.counterC();
		// console.log(incrementC());
		// console.log(incrementC());

	
	// End of requireJS function
	}
);




// chrome.browserAction.onClicked.addListener(function(tab) {
// 	// Only works if browser action does not have a popup
// 	console.log(tab);
// });

// // Create a simple text notification:
// var notification = webkitNotifications.createNotification(
//   '48.png',  // icon url - can be relative
//   'Hello!',  // notification title
//   'Lorem ipsum...'  // notification body text
// );
// notification.show();





