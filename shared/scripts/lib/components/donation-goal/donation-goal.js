'use strict';

import Component from '../../component';
import storage from '../../storage';

function DonationGoalComponent() {
  Component.prototype.constructor.apply(this, arguments);
}

DonationGoalComponent.prototype = {
  template: 'components/donation-goal/donation-goal.html',

  events: {
    'keyup input': 'filterInput',
    'blur input': 'formatAndSave',
    'change input': 'formatAndSave',
    'change select': 'updateInterval'
  },

  updateInterval: function(ev) {
    var minutes = Number(ev.target.value);
    var component = this;

    return storage.get('settings').then(function(settings) {
      settings.donationInterval = minutes;

      component.updateOwe(settings);

      return storage.set('settings', settings);
    });
  },

  filterInput: function(ev) {
    var val = ev.target.value.replace(/[^0-9.]/g, '');
    this.$('input').val('$' + val);
  },

  formatAndSave: function(ev) {
    var component = this;
    var val = ev.target.value.replace(/[^0-9.]/g, '');
    var currency = '$' + parseFloat(val).toFixed(2);

    this.$('input').val(currency);

    storage.get('settings').then(function(settings) {
      settings.donationGoal = currency;

      component.updateOwe(settings);

      return storage.set('settings', settings);
    });
  },

  updateOwe: function(settings) {
    var donationInterval = settings.donationInterval || 60;
    var est = +settings.donationGoal.slice(1) * (5 / donationInterval);

    this.$('.owe').text('$' + est.toFixed(2));
  },

  afterRender: function() {
    var component = this;
    var input = this.$('input');
    var select = this.$('select');

    storage.get('settings').then(function(settings) {
      input.val(settings.donationGoal);
      select.find('[value=' + settings.donationInterval + ']')
        .attr('selected', true);

      component.updateOwe(settings);
    });
  }
};

DonationGoalComponent.prototype.__proto__ = Component.prototype;

export default DonationGoalComponent;
