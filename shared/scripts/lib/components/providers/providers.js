'use strict';

import Component from '../../component';
import storage from '../../storage';
import { useProvider } from '../../oauth';
import '../../providers/dwolla';

function ProviderComponent() {
  Component.prototype.constructor.apply(this, arguments);
}

ProviderComponent.prototype = {
  template: 'components/providers/providers.html',

  events: {
    'click .dwolla': 'enableDwolla',
    'click .paypal': 'enablePayPal',
    'click .stripe': 'enableStripe'
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

    chrome.identity.launchWebAuthFlow({
      url: 'https://connect.stripe.com/oauth/authorize?client_id=ca_4p4SQSiq8XqZN9mOhoUTVgKoJ5SGJXQi&redirect_uri=https://ajcjbhihdfmefgbenbkpgalkjglcbmmp.chromiumapp.org/provider_cb&response_type=code&scope=read_write',
      'interactive': true
    }, function(redirect_url) {
      storage.get('settings').then(function(settings) {
        var providers = settings.providers || {};

        providers.stripe = {
          url: redirect_url
        };

        // Ensure that the providers object is set.
        settings.providers = providers;

        return storage.set('settings', settings);
      }).then(function() {
        element.classList.add('verified');
      });
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
