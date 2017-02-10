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
    'getDays',
    'fixOffByOne',
    'getAuthor'
  ],

  /**
   * Fixes a bug where daysVisited object counts as an entry addition.
   *
   * @param val
   * @return
   */
  fixOffByOne: function(val) {
    return Number(val) - 1;
  },

  /**
   * timeSpent
   *
   * @param val
   * @param isValue
   * @return
   */
  timeSpent: function(val, isValue) {
    var time = moment.duration(val.slice(1,val.length).reduce(function(prev, current) {
      return prev + current.timeSpent;
    }, 0), 'milliseconds');

    if (isValue) {
      return time;
    }

    return time.humanize();
  },

  /**
   * timeSpentValue
   *
   * @param val
   * @return
   */
  timeSpentValue: function(val) {
    return moment.duration(val.reduce(function(prev, current) {
      return prev + current.timeSpent;
    }, 0), 'milliseconds');
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
  * getDays
  *
  * @param val
  * @ return the amount of days visited
  */
  getDays: function(val) {
    return val[0].daysVisited;
  },
  
  
  /**
  * getAuthor
  *
  * @param val
  * @ return the author name
  */
  getAuthor: function(val) {
    console.log(val);
    return val[1].author.list[0].name;
  },

  /**
   * formatAccessTime
   *
   * @param val
   * @param isValue
   * @return
   */
  formatAccessTime: function(val, isValue) {
    var date = new Date(val.accessTime);

    if (isValue) {
      return moment(date).unix();
    }

    return moment(date).format("h:mmA - ddd, MMM Do, YYYY");
  },

  afterRender: function() {
    var component = this;

    // This event will fire before tablesort is hit and will remove any
    // expanded entries to avoid order confusion.
    this.el.addEventListener('click', function(ev) {
      var thead = component.$('thead')[0];

      // Wipe out all entry history logs.
      if ($.contains(thead, ev.target)) {
        component.$('.entry-history').remove();
        component.$('.active').removeClass('active');
      }
    }, true);

    // Enable table sorting.
    this.tablesort = new Tablesort(this.$('table')[0], {
      descending: false
    });
  }
};

LogTableComponent.prototype.__proto__ = Component.prototype;

export default LogTableComponent;
