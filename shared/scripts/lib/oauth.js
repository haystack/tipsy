'use strict';

import { environment } from './environment';
import storage from './storage';

// Keep a cache of registered providers.
var providers = {};

// Oauth URL template.
var tmpl = combyne([
  '{{url}}?',
  'client_id={{client_id}}&',
  'redirect_uri={{redirect_uri}}&',
  'response_type={{response_type}}&',
  'scope={{scope}}'
].join(''));

function Provider(name, options) {
  this.name = name;
  this.options = options;

  // Standard redirect URL for chrome.
  if (environment === 'chrome') {
    this.options.redirect_uri = 'https://ajcjbhihdfmefgbenbkpgalkjglcbmmp.chromiumapp.org/provider_cb';
  }
}

Provider.prototype._makeCallback = function(callback) {
  var token = '';

  if (environment === 'chrome') {
    console.log(tmpl.render(this.options));
    chrome.identity.launchWebAuthFlow({
      url: tmpl.render(this.options),
      interactive: true
    }, function(redirect_url) {
      if (!redirect_url) {
        return callback(new Error('Missing redirect url'));
      }

      // Split the token from the return URL.
      token = redirect_url.split('code=')[1];

      callback(null, token);
    });
  }
  else if (environment === 'firefox') {
    callback(null, token);
  }
};

Provider.prototype.authorize = function() {
  var provider = this;

  return new Promise(function(resolve, reject) {
    provider._makeCallback(function(err, token) {
      if (err) {
        return reject(err);
      }

      storage.get('settings').then(function(settings) {
        var providers = settings.providers || {};

        providers[provider.name] = {
          token: token
        };

        // Ensure that the providers object is set.
        settings.providers = providers;

        return storage.set('settings', settings).then(function() {
          return token;
        });
      }).then(resolve, reject);
    });
  });
};

export function defineAdapter(name, impl) {
  var provider = providers[name] = new Provider(name, impl.options);

  // Attach the `sendMoney` method to the prototype.
  provider.sendMoney = impl.sendMoney;
}

export function useProvider(name) {
  var provider = providers[name];

  if (!provider) {
    throw new Error('Missing provider: ' + name);
  }

  return provider;
}
