// This script serves as an intermediary between oauth2.html and oauth2.js.

// Get all query string parameters from the original URL.
var url = decodeURIComponent(window.location.href.match(/&from=([^&]+)/)[1]);
var index = url.indexOf('?');
if (index > -1) {
  url = url.substring(0, index);
}

// Derive adapter name from URI and then finish the process.
var adapterName = OAuth2.lookupAdapterName(url);
var finisher = new OAuth2(adapterName, OAuth2.FINISH);
