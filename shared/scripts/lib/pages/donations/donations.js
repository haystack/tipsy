'use strict';

import Component from '../../component';
import storage from '../../storage';

function DonationsPage() {
  Component.prototype.constructor.apply(this, arguments);

  var component = this;

  this.render();

  storage.get('log').then(function(log) {

  });
}

DonationsPage.prototype = {
  template: 'pages/donations/donations.html',

  events: {
    'keyup input': 'filterInput',
    'blur input': 'formatAndSave',
    'change input': 'formatAndSave'
  },

  // Always default to an empty array when no data is passed.
  serialize: function() {
    return {
      entries: []
    };
  },

  payBitcoin: function() {

  },

  payDwolla: function() {

  },

  filterInput: function(ev) {
    var val = ev.target.value.replace(/[^0-9.]/g, '');
    this.$('input').val('$' + val);
  },

  formatAndSave: function(ev) {
    var val = ev.target.value.replace(/[^0-9.]/g, '');
    var currency = '$' + parseFloat(val).toFixed(2);

    this.$('input').val(currency);
  },

  filter: function(entry) {
    var authorCount = entry.entries.filter(function(entry) {
      return entry.author && entry.author.list.length;
    }).length;

    // Attach the number of authors to the entry, now that it's calculated.
    entry.authorCount = authorCount;

    return true;
  },

  afterRender: function() {
    var component = this;
    var data = {
      entries: []
    };

    // Render with the data found from the log.
    storage.get('log').then(function(resp) {
      var filteredAndSorted = component
        // Convert the log Object to a filterable/sortable Array.
        .toArray(resp)
        // Sort and filter passing along the log component instance as context.
        .filter(component.filter, component);

      return filteredAndSorted;
    }).then(function(entries) {
      data.entries = entries;
      //component.render(data);
    });
  }
};

DonationsPage.prototype.__proto__ = Component.prototype;

export default DonationsPage;
