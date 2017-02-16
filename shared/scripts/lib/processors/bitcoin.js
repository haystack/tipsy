'use strict';

export function inject($el, amount, wallet) {

  // TODO: amount

  var form = $('<div>');

  // Add in the Bitcoin donate button.
  form.append('<a href="bitcoin:' + wallet + '?label=Tipsy%20contribution"><img src="../../img/bitcoin.png" alt="Donate with Bitcoin"></a>');

  form.appendTo($el);
}
