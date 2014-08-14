define([
	"jquery",
	],
	function($) {



		indexedDb = {};
		indexedDb.db = null;
		indexedDb.DB_VERSION = 3;

		indexedDb.test = function() {
			var counter = 1;
			var inner = function() {
				console.log(this);
				console.log(counter);
				this.counter += 1;
			}
			return inner;
		}

		/*
		* Initializes a persistent indexedDB or upgrades the existing persistent
		indexedDb by beginning a 'versionchange' transaction.
		Called while opening an indexedDb if the database version is greater than
		the existing one in persistent storage. 
		*/
		indexedDb.upgradeDatabase = function(event) {
			console.log("onupgradeneeded", event);
			db = event.target.result;

			// remove the store if it exists
	    if (db.objectStoreNames.contains("visits")) {
	      db.deleteObjectStore("visits");
	    }

			// Create an objectStore to hold info about visits
			var visitStore = db.createObjectStore("visits", {keyPath: "URL"});
		}

		indexedDb.open = function(callback, item) {
			console.log(this);
			var self = this;
			// Create or open the database, returns IDBOpenDBRequest object
			var request = indexedDB.open("content", self.DB_VERSION);
			// Initialize or upgrade indexedDb with necessary Object Stores
			request.onupgradeneeded = self.upgradeDatabase;
			request.onerrror = function(event) {
				console.log("Error openning indexedDB", event);
			}
			request.onsuccess = function(event) {
				console.log("Successfully openned indexedDB", event);
				self.db = event.target.result;
				var db = self.db
				db = request.result;
				console.log("Yay!");

				var transaction = db.transaction(["visits"], "readwrite");

				transaction.oncomplete = function(event) {
					console.log("All done!");
				}

				transaction.onerror = function(event) {
					console.log("Some error during transaction");
				}

				var store = transaction.objectStore("visits");
				console.log(store);
				var operation = store.put(item);

				operation.onsuccess = function(event) {
					console.log("Add was successful");
					console.log(event);
					console.log(operation);
				}


				//callback(self.db, item);
				// var trans = db.transaction(["content"], "readwrite")
				// var store = trans.objectStore("visits");
				// var request = store.put({demo: "test"});
				// request.onsuccess = function() {
				// 	console.log("Successful write");
				// }
			}
		}

		indexedDb.performTransaction = function() {
			console.log(db);
			// Start a transcation, returns a IDBRequest object
			// var store = db.transaction(["content"], "readwrite").objectStore("visits");
			// var request = store.put({name: "demo"});
			// request.onsuccess = function() {
			// 	console.log("Successful write");
			// }
		}

		indexedDb.add = function(db, item) {
			// Start a transcation, returns a IDBRequest object
			console.log(db);
			var trans = db.transaction(["content"], "readwrite")
			var store = trans.objectStore("visits");
			var request = store.put(item);
			request.onsuccess = function() {
				console.log("Successful write");
			}
		}

		return indexedDb;
			// open: function(callback) {
			// 	console.log(this);
			// 	var that = this;
			// 	db = "dsadsadas"
			// 	// Create or open the database, returns IDBOpenDBRequest object
			// 	var request = indexedDB.open("content", DB_VERSION);
			// 	// Initialize or upgrade indexedDb with necessary Object Stores
			// 	request.onupgradeneeded = upgradeDatabase;
			// 	request.onerrror = function(event) {
			// 		console.log("Error openning indexedDB", event);
			// 	}
			// 	request.onsuccess = function(event) {
			// 		console.log("Successfully openned indexedDB", event);
			// 		console.log(event);
			// 		that.db = event.target.result;
			// 		console.log(this);
			// 		console.log(that);
			// 		console.log(that.db);
			// 		callback();
			// 	}
			// },
			// performTransaction: performTransaction,
			// add: add,
			// test: function() {
			// 		console.log(db);
			// }
		// }

	// End of Module define function closure.
	}
);

		// request.onsuccess = function(event) {
			// 	console.log(request.result);
			// 	db = request.result;
			// 	console.log("Yay!");

			// 	var transaction = db.transaction(["posts"], "readwrite");

			// 	transaction.oncomplete = function(event) {
			// 		console.log("All done!");
			// 	}

			// 	transaction.onerror = function(event) {
			// 		console.log("Some error during transaction");
			// 	}

			// 	var postStore = transaction.objectStore("posts");
			// 	console.log(postStore);
			// 	var operation = postStore.add({ssn: "444-44-4444", name: "Fred", email: "fred@gmail.com"});

			// 	operation.onsuccess = function(event) {
			// 		console.log("Add was successful");
			// 		console.log(event);
			// 		console.log(operation);
			// 	}

			// 	operation.onerror = function(event) {
			// 		console.log("Add operation was not successful");
			// 		console.log(event);
			// 	}

			// }

			
			// request.onerror = function(event) {
			// 	console.log(event);
			// 	console.log("Boo!");
			// }