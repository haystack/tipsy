'use strict';

export function inject($el, amount, token) {
  var redirect = 'http://97.107.132.235:9999?redirect=' +
    encodeURIComponent(location.href.split('#')[0]);

  var script = $('<script>')
    .addClass('dwolla_button')
    .attr({
      'src': 'https://www.dwolla.com/scripts/button.min.js',
      'data-key': token,
      'data-redirect': redirect,
      'data-label': 'Donate with Dwolla',
      'data-name': 'Tipsy',
      'data-description': 'Tipsy',
      'data-amount': amount,
      'data-shipping': '0.00',
      'data-tax': '0.00',
      'data-guest-checkout': 'true',
      'data-type': 'simple'
    })
  .appendTo($el);

  return {
    update: function(amount) {
      script.next('a.d-btn').attr('data-amount', amount.slice(1));
    }
  };
}
