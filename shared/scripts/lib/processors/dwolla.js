'use strict';

export function inject($el, amount, token) {
  $('<script>')
    .attr('src', 'https://www.dwolla.com/scripts/button.min.js')
    .addClass('dwolla_button')
    .data({
      key: token,
      redirect: 'http://google.com/',
      label: 'Donate with Dwolla',
      name: 'Tipsy',
      description: 'Tipsy',
      amount: amount,
      shipping: '0.00',
      tax: '0.00',
      'guest-checkout': 'true',
      type: 'simple'
    })
  .appendTo($el);
}
