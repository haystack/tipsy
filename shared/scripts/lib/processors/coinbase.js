/*

          {%if author.bitcoin%}
<a class='coinbase-button' data-code='{{ author.bitcoin }}' data-button-style='custom_small' href=''>Donate with Bitcoin</a>
<script src=''></script>
          {%endif%}

  */

'use strict';

var url = 'https://www.coinbase.com/checkouts/56aa4626057f2e415444b373f5f9d6aa';

export function inject($el, amount, token) {
  $('<a>')
    .attr('href', url)
    .addClass('coinbase-button')
    .data({
      code: token,
      'button-style': 'custom_small'
    })
  .appendTo($el);

  $('<script>')
    .attr('src', 'https://www.coinbase.com/assets/button.js')
  .appendTo($el);
}
