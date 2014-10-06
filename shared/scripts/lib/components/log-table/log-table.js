'use strict';

import Component from '../../component';
import storage from '../../storage';

function LogTableComponent() {
  Component.prototype.constructor.apply(this, arguments);
}

LogTableComponent.prototype = {
  template: 'components/log-table/log-table.html',

  // Register these functions as filters.
  filters: [
    'timeSpent',
    'keyLength',
    'hasAuthor',
    'findLast',
    'formatAccessTime',
    'authorInfo'
  ],

  /**
   * timeSpent
   *
   * @param val
   * @return
   */
  timeSpent: function(val) {
    return moment.duration(val.reduce(function(prev, current) {
      return prev + current.timeSpent;
    }, 0), 'milliseconds').humanize();
  },

  /**
   * keyLength
   *
   * @param val
   * @return
   */
  keyLength: function(val) {
    return Object.keys(val).length;
  },

  /**
   * hasAuthor
   *
   * @param val
   * @return
   */
  hasAuthor: function(val) {
    return val.authorCount ? 'has' : 'no';
  },

  /**
   * findLast
   *
   * @param val
   * @return
   */
  findLast: function(val) {
    return val[val.length - 1];
  },

  /**
   * formatAccessTime
   *
   * @param val
   * @return
   */
  formatAccessTime: function(val) {
    var date = new Date(val.accessTime);
    return moment(date).format("hA - ddd, MMM Do, YYYY");
  },

  authorInfo: function(val) {
    var item = null;

    if (val.author.list.length) {
      item = val.author.list[0];

      if (item.name) {
        return item.name;
      }
      else if (item.href) {
        return '<a href="' + item.href + '">No payment information added.</a>';
      }
    }
    else {
      return 'No author information present on page';
    }
  },

  URL: window.URL || window.webkitURL,

  /**
   * Fetch and cache the favicon or show the previously cached.
   *
   * Inspired by:
   * http://stackoverflow.com/questions/8022425/getting-blob-data-from-xhr-request
   *
   * @param host
   * @param el
   * @return
   */
  showFavicon: function(log, el, host) {
    storage.get('log').then(function(log) {
      var URL = this.URL;

      var xhr = new XMLHttpRequest();
      xhr.open('GET', 'http://' + host + '/favicon.ico', true);
      xhr.responseType = 'arraybuffer';

      xhr.onload = function(e) {
        if (this.status == 200) {
          var uInt8Array = new Uint8Array(this.response);
          var length = uInt8Array.length;
          var binaryString = new Array(length);

          while (length--) {
            binaryString[length] = String.fromCharCode(uInt8Array[length]);
          }

          var base64 = window.btoa(binaryString.join(''));
          var src = 'data:image/x-icon;base64,' + base64;

          // Add the favicon image.
          $(el).attr('src', src);

          // Update the log with the cached favicon.
          log[host][0].favicon = src;
        }
      };

      // Either fetch and cache or use the previously cached favicon.
      if (!log[host][0].favicon) {
        xhr.send();
      }
      else {
        $(el).attr('src', log[host].favicon);
      }
    }.bind(this)).catch(function(err) { console.log(err); });
  },

  afterRender: function() {
    var component = this;

    storage.get('log').then(function(log) {
      component.$('img.favicon').each(function(key, el) {
        this.showFavicon(log, el, $(el).data('host'));
        storage.set('log', log);
      });
    });
  }
};

LogTableComponent.prototype.__proto__ = Component.prototype;

export default LogTableComponent;
