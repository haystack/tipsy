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
    'formatAccessTime'
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
      descending: true
    });
  }
};

LogTableComponent.prototype.__proto__ = Component.prototype;

export default LogTableComponent;
