'use strict';

export function inject($el, amount, email) {
  var redirect = 'http://97.107.132.235:9999?redirect=' +
    encodeURIComponent(location.href.split('#')[0]);

  var form = $('<form>').attr({
    name: '_xclick',
    action: 'https://www.paypal.com/cgi-bin/webscr',
    method: 'post'
  });

  // Add in the PayPal donate button.
  form.append('<input type="image" ' +
    'src="https://www.paypalobjects.com/en_US/i/btn/btn_paynow_LG.gif" ' +
    'border="0" name="submit" alt="Donate with PayPal">');

  // These are required hidden fields.
  var hidden = {
    business: email,
    amount: amount,
    cmd: '_xclick',
    currency_code: 'USD',
    item_name: 'Tispy',
    return: redirect,
    cancel_return: redirect
  };

  // Convert all hidden to inputs.
  Object.keys(hidden).forEach(function(name) {
    hidden[name] = $('<input>').attr({
      name: name,
      value: hidden[name],
      type: 'hidden'
    });

    hidden[name].appendTo(form);
  });

  form.appendTo($el);

  return {
    update: function(amount) {
      hidden.amount.attr('value', amount.slice(1));
    }
  };
}
