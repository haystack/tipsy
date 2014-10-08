'use strict';

import { displayCustom, defineAdapter } from '../oauth';

defineAdapter('bitcoin', {
  options: {
    url: 'https://www.coinbase.com/oauth/authorize',
    client_id: '2d5fa601e8bac085463367e37ac9b5b1a6c56a2537624afaad87a3bb73475236',
    scope: 'send',
    response_type: 'code'
  },

  sendMoney: function(to, amount) {

  }
});
