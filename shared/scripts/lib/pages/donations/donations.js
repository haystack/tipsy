'use strict';

import Component from '../../component';
import storage from '../../storage';
import { inject as injectDwolla } from '../../processors/dwolla';

function DonationsPage() {
  Component.prototype.constructor.apply(this, arguments);

  this.renderTable();

  // Whenever the data changes re-render the table.
  storage.onChange(this.renderTable.bind(this));
}

DonationsPage.prototype = {
  template: 'pages/donations/donations.html',

  events: {
    'keyup input': 'filterInput',
    'blur input': 'formatAndSave',
    'change input': 'formatAndSave'
  },

  filters: [
    'timeSpent'
  ],

  /**
   * timeSpent
   *
   * @param val
   * @return
   */
  timeSpent: function(val) {
    return moment.duration(val, 'milliseconds').humanize();
  },

  /**
   * Render the donations table.
   *
   * @return
   */
  renderTable: function() {
    var component = this;

    // Set the default data.
    component.data = {
      entries: []
    };

    // Render with the data found from the log.
    storage.get('settings').then(function(settings) {
      storage.get('log').then(function(resp) {
        var filteredAndSorted = component
          // Convert the log Object to a filterable/sortable Array.
          .toArray(resp, settings)
          // Sort and filter passing along the log component instance as
          // context.
          .filter(component.filter, component);

        return filteredAndSorted;
      }).then(function(entries) {
        component.data.entries = entries;
        component.render();
      });
    });
  },

  serialize: function() {
    return {
      entries: this.data.entries
    };
  },

  filterInput: function(ev) {
    var val = ev.target.value.replace(/[^0-9.]/g, '');
    this.$(ev.currentTarget).val('$' + val);
  },

  formatAndSave: function(ev) {
    var val = ev.target.value.replace(/[^0-9.]/g, '');
    var currency = '$' + parseFloat(val).toFixed(2);

    this.$(ev.currentTarget).val(currency);

    // Update any payment methods on this element.
    var row = $(ev.currentTarget).closest('tr.entry').data();

    if (row.dwolla) {
      row.dwolla.update(currency);
    }
  },

  /**
   * toArray
   *
   * @param resp
   * @return
   */
  toArray: function(resp, settings) {
    var entries = [];

    Object.keys(resp).forEach(function(key) {
      entries.push.apply(entries, resp[key].map(
        this.calculate.bind(this, settings)
      ));
    }, this);

    return entries;
  },

  /**
   * Calculates the estimated amount per entry.
   *
   * @param settings
   * @param entry
   * @return
   */
  calculate: function(settings, entry) {
    // Convert timespent to hours.
    var timeSpent = entry.timeSpent / 1000 / 60 / 60;

    // The donation goal amount is saved as a currency string, so we want
    // to emulate the empty amount if nothing was set.
    var donationGoal = settings.donationGoal || '$0';
    donationGoal = Number(donationGoal.slice(1));

    // Assign the estimated amount to the entry item.
    entry.estimatedAmount = Math.round(timeSpent * donationGoal).toFixed(2);

    return entry;
  },

  filter: function(entry) {
    return entry.author && entry.author.list.length;
  },

  afterRender: function() {
    this.$('tr.entry').each(function() {
      var $this = $(this);
      // Extract the estimated value.
      var amount = $this.find('.amount').val().slice(1);

      // The payment container.
      var payment = $this.find('.payment');
      var dwollaToken = $this.data('dwolla');

      // Hide the no processors text.
      if (dwollaToken) {
        payment.empty();
      }

      // Only inject if the author has dwolla.
      if (dwollaToken) {
        $this.data().dwolla = injectDwolla(payment, amount, dwollaToken);
      }
    });
  }
};

DonationsPage.prototype.__proto__ = Component.prototype;

export default DonationsPage;
