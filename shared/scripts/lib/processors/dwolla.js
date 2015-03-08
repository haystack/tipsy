'use strict';

export function inject($el, amount, token) {
  var root = 'http://tipsy.csail.mit.edu/redirect';
  var base = location.href.split('#')[0];
  base = base.replace(/\//g, '$');
  base = encodeURIComponent(base);

  var redirect = [root, base, 'Dwolla user', amount].join('/');
  var src = 'https://www.dwolla.com/scripts/button.min.js';

  // If we're in testing, swap the token with our test account.
  if (localStorage.testing === 'true') {
    token = 'lYNGTjRZRQAU4j32+qB4fBAPNDTQQGeZHF9cZFrH+83qm21sTL';
    src = base + '/../../vendor/dwolla.js';
  }

  var script = $('<script>')
    .addClass('dwolla_button')
    .attr({
      'src': src,
      'data-key': token,
      'data-redirect': redirect,
      'data-label': 'Pay with Dwolla',
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

      // Update the redirect as well.
      var redirect = [root, base, 'Dwolla user', amount].join('/');
      script.next('a.d-btn').attr('data-redirect', redirect);
    }
  };
}
