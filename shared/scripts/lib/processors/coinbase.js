'use strict';

var url = 'https://www.coinbase.com/checkouts/56aa4626057f2e415444b373f5f9d6aa';

export function inject($el, amount, token) {
  $('<a>')
    .addClass('coinbase-button')
    .attr({
      'href': url,
      'data-code': token,
      'data-button-style': 'custom_small',
      'data-button-price-string': '1.0',
      'data-button-price_string': '1.0',
      'data-price_string': '1.0',
      'data-price-string': '1.0',
      'data-price': '1.0'
    })
  .appendTo($el);

  $('<script>')
    .attr('src', 'https://www.coinbase.com/assets/button.js')
  .appendTo($el);
}
