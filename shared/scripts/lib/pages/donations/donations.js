'use strict';

import Component from '../../component';
import storage from '../../storage';

function DonationsPage() {
  Component.prototype.constructor.apply(this, arguments);

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

  filterInput: function(ev) {
    var val = ev.target.value.replace(/[^0-9.]/g, '');
    this.$('input').val('$' + val);
  },

  formatAndSave: function(ev) {
    var val = ev.target.value.replace(/[^0-9.]/g, '');
    var currency = '$' + parseFloat(val).toFixed(2);

    this.$('input').val(currency);
  },

  serialize: function() {
    return {
      entries: [{
        name: 'Tim Branyen',
        timeSpent: moment.duration(1500, 'milliseconds').humanize(),
        estimatedAmount: 15.00,
        payMethods: 'Bitcoin'
      }]
    };
  }
};

DonationsPage.prototype.__proto__ = Component.prototype;

export default DonationsPage;
