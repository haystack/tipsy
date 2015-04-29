  
import './js-yaml';

export function parseTxt() {  
  var info = localStorage.getItem(document.domain);
  var cacheDuration;
  var amount;
  var unit;
  var version;
  var diff;
  var newArray = [];
  var ms;
  var currentPrefix;
      
  var shouldRenew = false;
  if (info != null) {
    var tried = info;
    try {
      tried = JSON.parse(info);
    } catch (e) {
      
    }
    if (tried.tipsyTried) {
      diff = Date.now() - Number(tried.tipsyTried);
      if (diff > 2 * 3600000 ) {
        shouldRenew = true;
      } else {
        newArray[0] = {};
        return newArray;
      }
      
    }
    version = info.split("\n")[1];
    
    if (version == "0.0.1") {
      cacheDuration = info.split("\n")[2];
      cacheDuration = cacheDuration.split(" ");
      
      amount = cacheDuration[0];
      unit = cacheDuration[1];
      
      diff = Date.now() - Number(info.split("\n")[0]);
      
      if (unit == 'h') {
        ms = 3600000;
      } else if (unit == 'd') {
        ms = 86400000;
      } else if (unit == 'w') {
        ms = 604800000;
      }
    
      if (diff > ms * Number(amount)) {
        shouldRenew = true;
      }    
    
    
    } else  {
      var j = JSON.parse(info);
      var pervTime = Number(j.prevTime);

      if (info['cache-duration']) {
        amount = info['cache-duration'].amount;
        unit = info['cache-duration'].unit;

        
        diff = Date.now() - Number(prevTime);
        
        if (unit == 'hour' || unit == "hours") {
          ms = 3600000;
        } else if (unit == 'days' || unit == "days") {
          ms = 86400000;
        } else if (unit == 'week' || unit == 'weeks') {
          ms = 604800000;
        }
    
        if (diff > ms * Number(amount)) {
          shouldRenew = true;
        }
      }
    }
  }

  if (info == null || shouldRenew) {
    var req = new XMLHttpRequest();
    try {  
      req.open('GET', "/tipsy.txt", false);   
    } catch (e) {
      
    }
    try {
      req.send(null);  
    } catch(e) {
      localStorage.setItem(document.domain, JSON.stringify({'tipsyTried': Date.now()}));
    }
    if (req.status == 200) {
      version = req.responseText.split("\n")[0];

      if (version == "0.0.1") { 

        info = Date.now().toString() + "\n" + req.responseText;
        localStorage.setItem(document.domain, info);
      } else {
        info = req.responseText;
        
        try {
          info = jsyaml.load(info);
        } catch (e) {}
        info.prevTime = Date.now().toString();
        localStorage.setItem(document.domain, JSON.stringify(info));
      }
    } else {
      localStorage.setItem(document.domain, JSON.stringify({'tipsyTried': Date.now()}));
    }
  } else {
    info = localStorage.getItem(document.domain);
  }
  
  
  
  if (info != null) {

    var str = info;
    if (typeof info != "string") {
      str = JSON.stringify(info);
    }

    version = str.split("\n")[1];

    if (version == "0.0.1") {

      var splitted = info.split("\n");

      var tipsyInfo = splitted.slice(3,splitted.length);
      for (var i =  0; i < tipsyInfo.length; i++) {
        if (tipsyInfo[i].length > 1) {
          var entry = tipsyInfo[i].split(" ");
          var urlPrefix = entry[0];
          var paymentInfos = entry[1];
          var author = entry[2];

          currentPrefix = document.documentURI.substring(document.documentURI.indexOf(document.domain) + document.domain.length + 1, document.documentURI.length);
        
          if (currentPrefix === " " || currentPrefix === "") {
            currentPrefix = "*";
          }
          if ((currentPrefix == urlPrefix) || (urlPrefix ==="*")) {
            if (!newArray[0]) {
              newArray[0] = {};
            }
           
            var splittedProcessors = paymentInfos.split("|");
            for (var k = 0; k < splittedProcessors.length; k++) {
              var splitEntry = splittedProcessors[k].split("=");
              switch(splitEntry[0]){
                case "paypal":
                  newArray[0].paypal = splitEntry[1];
                  break;
                case "dwolla":
                  newArray[0].dwolla = splitEntry[1];
              }
            }
           
            if (author && author.length > 1) {
              newArray[0].name = author;
            }
          }
        }
      }

    return newArray;
    } else {

      if (typeof info == "string") {
        info = JSON.parse(info);
      }
      
      currentPrefix = document.documentURI.substring(document.documentURI.indexOf(document.domain) + document.domain.length + 1, document.documentURI.length);
      

      
      var paymentMethods = info['payment-methods'];
      for (var urlPref in paymentMethods ) {
        if (currentPrefix === " " || currentPrefix === "") {
          currentPrefix = "_";
        }
      
        if ((currentPrefix == urlPref) || (urlPref === "_")) {
          if (!newArray[0]) {
            newArray[0] = {};
          }
          if (paymentMethods[urlPref]) {
            newArray[0].dwolla = paymentMethods[urlPref].dwolla;
          }
          if (paymentMethods[urlPref]) {
            newArray[0].paypal = paymentMethods[urlPref].paypal
          }
          if (info.author) {
            newArray[0].name = info.author;
          }
        }
      }
      return newArray;
    }
  }
}
