'use strict';

import Component from '../../component';
import storage from '../../storage';
import { useProvider } from '../../oauth';
import '../../providers/bitcoin';
import '../../providers/dwolla';
import '../../providers/paypal';
import '../../providers/stripe';

function ProviderComponent() {
  Component.prototype.constructor.apply(this, arguments);
}

ProviderComponent.prototype = {
  template: 'components/providers/providers.html',

  events: {
    'click .bitcoin': 'enableBitcoin',
    'click .dwolla': 'enableDwolla',
    'click .paypal': 'enablePayPal',
    'click .stripe': 'enableStripe'
  },

  enableBitcoin: function(ev) {
    ev.preventDefault();

    var element = $(ev.currentTarget);

    return useProvider('bitcoin').authorize().then(function() {
      element.addClass('verified');
    }, function() {
      window.alert('Unable to link properly, please try again.');
      element.removeClass('verified');
    });
  },

  enableDwolla: function(ev) {
    ev.preventDefault();

    var element = $(ev.currentTarget);

    return useProvider('dwolla').authorize().then(function() {
      element.addClass('verified');
    }, function() {
      window.alert('Unable to link properly, please try again.');
      element.removeClass('verified');
    });
  },

  enablePayPal: function(ev) {
    ev.preventDefault();

    var element = $(ev.currentTarget);

    return useProvider('paypal').authorize().then(function() {
      element.addClass('verified');
    }, function() {
      window.alert('Unable to link properly, please try again.');
      element.removeClass('verified');
    });
  },

  enableStripe: function(ev) {
    ev.preventDefault();

    var element = ev.currentTarget;

    return useProvider('stripe').authorize().then(function() {
      element.addClass('verified');
    }, function() {
      window.alert('Unable to link properly, please try again.');
      element.removeClass('verified');
    });
  },

  afterRender: function() {
    var parent = this.el;

    storage.get('settings').then(function(settings) {
      // Change the logos to match added providers.
      if (settings.providers) {
        Object.keys(settings.providers).forEach(function(key) {
          // We're looking for matching classes to make this lookup easier.
          $('.' + key, parent).addClass('verified');
        });
      }
    });
  }
};

ProviderComponent.prototype.__proto__ = Component.prototype;

export default ProviderComponent;
