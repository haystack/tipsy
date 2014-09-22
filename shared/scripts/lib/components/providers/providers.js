'use strict';

import Component from '../../component';

function ProviderComponent() {
  Component.prototype.constructor.apply(this, arguments);
}

ProviderComponent.prototype = {
  template: 'components/providers/providers.html',

  events: {
    'click .dwolla': 'enableDwolla'
  },

  enableDwolla: function(ev) {
    ev.preventDefault();

    chrome.identity.launchWebAuthFlow({
      url: 'https://www.dwolla.com/oauth/v2/authenticate?client_id=kkAqjKVW2IN463Y9M3MgWBpGgtnTa/9i/DswI9/IPgRJspzqOP&redirect_uri=https://ajcjbhihdfmefgbenbkpgalkjglcbmmp.chromiumapp.org/provider_cb&response_type=code&scope=send',
      'interactive': true
    }, function(redirect_url) {
      window.alert(redirect_url); 
    });
  }
};

ProviderComponent.prototype.__proto__ = Component.prototype;

export default ProviderComponent;
