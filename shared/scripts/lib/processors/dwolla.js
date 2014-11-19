'use strict';

export function inject($el, amount, token) {
  $('<script>')
    .addClass('dwolla_button')
    .attr({
      'src': 'https://www.dwolla.com/scripts/button.min.js',
      'data-key': token,
      'data-redirect': 'http://google.com/',
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
}
