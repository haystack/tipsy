'use strict';

import Component from '../../component';
import { select, selectAll } from '../../dom';
import storage from '../../storage';
import LogTableComponent from '../../components/log-table/log-table';

/**
 * LogPage
 *
 * @return
 */
function LogPage() {
  Component.prototype.constructor.apply(this, arguments);

  // Whenever the storage engine changes, update the log table.
  storage.onChange(this.renderTable.bind(this));

  var component = this;

  // Save the log data for future access.
  this.data = { entries: [] };

  // Fetch the entry history template that will be used to show detailed log.
  this.entryHistory = this.fetch('components/log-table/entry-history.html')
    // Convert to a template, once fetched.
    .then(function(contents) {
      var template = combyne(contents);

      // Register all filters to the template.
      [].concat(component.filters).forEach(function(filter) {
        template.registerFilter(filter, component[filter]);
      });

      return template;
    });
}

LogPage.prototype = {
  template: 'pages/log/log.html',
  hideNoAuthor: true,
  hidePaid: true,

  events: {
    'click .author': 'toggleNoAuthor',
    'click .reset': 'resetLog',
    'click tbody tr': 'toggleEntryHistory',
    'click .entry-history': 'cancelEvent'
  },

  // Register these functions as filters.
  filters: [
    'formatAccessTime'
  ],

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
    this.table = new LogTableComponent(select('log-table', this.el));
    this.renderTable();
  },

  handleMissingFavicon: function(ev) {
    console.log(ev);
  },

  /**
   * toggleNoAuthor
   *
   * @param ev
   * @return
   */
  toggleNoAuthor: function(ev) {
    this.hideNoAuthor = !this.hideNoAuthor;
    var showOrHide = this.hideNoAuthor ? 'show' : 'hide';

    this.$('.author').removeClass('show hide').addClass(showOrHide);
    this.renderTable();
  },

  toggleEntryHistory: function(ev) {
    var component = this;
    var tr = $(ev.currentTarget);

    // Inside a TH.
    if (tr.parents('th').length) {
      return false;
    }

    // Toggle the active class on click.
    tr.toggleClass('active');

    // Once the history template has been fetched, add the entry history.
    this.entryHistory.then(function(template) {
      var index = Number(tr.data('key'));

      // Only render the current entry.
      if (tr.is('.active')) {
        tr.after(template.render({ entry: component.data.entries[index] }));

        // Enable table sorting.
        new Tablesort(component.$('tr.entry-history table')[0], {
          descending: true
        });
      }
      else {
        tr.next('tr.entry-history').remove();
      }
    });
  },

  /**
   * toArray
   *
   * @param resp
   * @return
   */
  toArray: function(resp) {
    return Object.keys(resp).filter(function(key) {
      // Ensure at least one entry per host.
      return resp[key].length;
    }).map(function(key) {
      return {
        host: key,
        entries: resp[key],
        favicon: resp[key][0].favicon
      };
    });
  },

  /**
   * filter
   *
   * @param entries
   * @return
   */
  filter: function(entry) {
    var authorCount = entry.entries.filter(function(entry) {
      return entry.author && entry.author.list.length;
    }).length;

    // Attach the number of authors to the entry, now that it's calculated.
    entry.authorCount = authorCount;

    // Hide or show entries without any author information.
    if (this.hideNoAuthor && !authorCount) {
      return false;
    }

    // Hide or show entries based on paid status.
    if (this.hidePaid && entry.isPaid) {
      return false;
    }

    return true;
  },

  /**
   * sort
   *
   * @param entries
   * @return
   */
  sort: function(a, b) {
    a = a ? a.entries : [];
    b = b ? b.entries : [];

    var aAccessTime = a && a.length ? a[a.length - 1].accessTime : 0;
    var bAccessTime = b && b.length ? b[b.length - 1].accessTime : 0;

    return bAccessTime - aAccessTime;
  },

  resetLog: function() {
    if (window.confirm('Are you sure you want to wipe out your history?')) {
      storage.set('log', {});
    }
  },

  /**
   * renderTable
   *
   * @return
   */
  renderTable: function() {
    var log = this;

    // Save the log data for future access.
    log.data = {
      entries: []
    };

    // Render with the data found from the log.
    storage.get('log').then(function(resp) {
      var filteredAndSorted = log
        // Convert the log Object to a filterable/sortable Array.
        .toArray(resp)
        // Sort and filter passing along the log component instance as context.
        .filter(log.filter, log)
        .sort(log.sort, log);

      return filteredAndSorted;
    }).then(function(entries) {
      log.data.entries = entries;

      if (log.table) {
        log.table.render(log.data);
      }
    }).catch(function(ex) {
      console.log(ex);
      console.log(ex.stack);
    });
  }
};

LogPage.prototype.__proto__ = Component.prototype;

export default LogPage;
