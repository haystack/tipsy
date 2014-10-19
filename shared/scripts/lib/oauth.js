'use strict';

import { environment } from './environment';
import storage from './storage';

// Keep a cache of registered providers.
var providers = {};

// Oauth URL template.
var tmpl = combyne([
  '{{url}}/authenticate?',
  'client_id={{client_id}}&',
  'client_secret={{client_secret}}&',
  'redirect_uri={{redirect_uri}}&',
  'response_type={{response_type}}&',
  'scope={{scope}}&',
  '{%each additional%}{{.}}&{%endeach%}'
].join(''));

function Provider(name, options) {
  this.name = name;

  // Standard redirect URL for chrome.
  if (environment === 'chrome') {
    this.options = options.chrome;
    this.options.redirect_uri = 'https://' + chrome.runtime.id + '.chromiumapp.org/provider_cb';
  }

  else if (environment === 'firefox') {
    this.options = options.firefox;
  }
}

Provider.prototype._makeCallback = function(callback) {
  var token = '';
  var provider = this;

  if (environment === 'chrome') {
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
};

Provider.prototype.authorize = function() {
  var provider = this;

  return new Promise(function(resolve, reject) {
    provider._makeCallback(function(err, code) {
      if (err) {
        return reject(err);
      }

      // Request the `access_token`.
      return $.ajax({
        url: provider.options.url + '/token',
        type: 'POST',
        dataType: 'json',
        processData: false,
        contentType: 'application/json',
        data: JSON.stringify({
          "client_id": provider.options.client_id,
          "client_secret": provider.options.client_secret,
          "code": decodeURIComponent(code),
          "grant_type": "authorization_code",
          "redirect_uri": provider.options.redirect_uri
        })
      }).then(function(resp) {
        return storage.get('settings').then(function(settings) {
          var providers = settings.providers || {};

          // Assign the `access_token` into the list of providers.
          providers[provider.name] = {
            token: resp.access_token
          };

          // Ensure that the providers object is set.
          settings.providers = providers;

          return storage.set('settings', settings).then(function() {
            return resp.access_token;
          });
        }).then(resolve, reject);
      });
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
