define([
	"jquery",
	],
	function() {

		REQ_ATTR = ["osupport"]
		OPT_ATTR = ["metasrc"]
		DATA_ATTR = ["email", "phone", "paypal", "dwolla", "bitcoin"]

		


		/**
		* Selects first occurance of matching DOM element, iterates over the
		* HTML5 data attributes, and returns an object representation containing
		* all HTML5 data attribute dataset key/value pairs.
		*/
		var readDOMDataAttributes = function(matchString) {
			var creator = $(matchString)[0];
			var domStringMap = creator && creator.dataset;
			var kvpairs = {};
			for (key in domStringMap) {
				kvpairs[key] = domStringMap[key]
			}
			return kvpairs;
		}

		/*
		Takes object representation of raw properties
		*/
		var versionCheck = function(extractedAttributes) {
			var version = extractedAttributes["osupport"]
			if (version === "0.1.0") {
				return {
					valid: true,
					version: version
				}
			}
			return {
				valid: false,
				version: version,
			}	
		}

		/*
		Determines whether the content creator metadata defined a value for
		the metadatahost field indicating an external metadata host should
		be resolved. 
		*/
		var referencedMetadataHost = function(extractedAttributes) {
			if (typeof extractedAttributes["metadatahost"] === "undefined") {
				return false
			}
			return true
		}

		var filterOSupportFields = function(extractedAttributes) {
			contentVisitRecord = {}
			// filter out fields not part of oSupport
			DATA_ATTR.map(function(attribute) {
				console.log(attribute);
				contentVisitRecord[attribute] = extractedAttributes[attribute];
			});
			contentVisitRecord["URL"] = getContentURL();
			console.log(contentVisitRecord);
			console.log(getContentURL());
			return contentVisitRecord;
		}

		var getContentURL = function() {
			return window.location.href;
		}

		/*
		Parses the DOM content seeking embedded content creator metadata.
		Currently, it is assumed that content creator metadata is embedded
		in a link element with rel="author" and HTML5 data attributes.
		*/
		var parseDOM = function() {
			var embeddedProperties = readDOMDataAttributes("link[rel^=author]");
			return embeddedProperties;
		}


		var readOSupportProperties = function() {
			// Read HTML5 data attributes from web content
			var contentProperties = readDOMDataAttributes("link[rel^=author]");
			console.log(contentProperties);
			if (versionCheck(contentProperties).valid) {
				console.log("OSupport enabled content");

				if (referencedMetadataHost(contentProperties)) {
					console.log("External metadata host");
				}

				console.log("No external metadata host");
				var oSupportProperties = filterOSupportFields(contentProperties);
				console.log(oSupportProperties);
				// Adding extra properties TODO



				return;
			} 

			console.log("Not valid");
		}

		attributes = ["ocontrib", "paypal", "bitcoin", "fname", "lname"]

		var local_payment_info = function() {
			var author = $("link[rel^=author]").first();
			console.log(author)
			console.log(author.attr("href"));
			console.log(author[0].dataset);
			author_obj = {};
			attributes.map(function(item) {
				author_obj[item] = author[0].dataset[item];		
			});
			return author_obj;
		}

		var is_external = function() {
			var author = $("link[rel^=author]").first();
			if (typeof author[0].dataset["ocontrib"] === 'undefined') {


			}
		}


		/*
		Reads payment information from an external URL in JSON.
		*/
		var external = function() {

			$.get("http://www.gooogle.com", function(data, textstatus, jqxhr) {
				console.log("Got something", data);
			});
		}

		var extension_comm = function(author_obj) {
			message = {name: "author-discovered", data: author_obj};
			chrome.runtime.sendMessage(message, function(response) {
				console.log("Response", response);
			});
		}




		return {
			name: "parser",
			parse: function() {
				return readOSupportProperties();
				// console.log("HERE");
				// console.log(chrome.extension.getURL(""))
				// console.log(window.location);
				// return local_payment_info();
			},
			extension_comm: function(author_obj) {
				extension_comm(author_obj);
			},
			parseDOM: parseDOM,
			versionCheck: versionCheck,
			referencedMetadataHost: referencedMetadataHost,
			filterOSupportFields: filterOSupportFields,
		}

	// End of Module define function closure.
	}

);