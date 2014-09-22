'use strict';

import Component from '../../component';

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
    if (val.author.list.length) {
      return val.author.list[0].name;
    }
    else {
      return 'No author information present on page';
    }
  }
};

LogTableComponent.prototype.__proto__ = Component.prototype;

export default LogTableComponent;
