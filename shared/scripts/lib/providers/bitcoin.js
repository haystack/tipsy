'use strict';

import { displayCustom, defineAdapter } from '../oauth';
import '../storage';

defineAdapter('bitcoin', {
  options: {
    chrome: {
      url: 'https://www.coinbase.com/oauth/authorize',
      client_id: '2d5fa601e8bac085463367e37ac9b5b1a6c56a2537624afaad87a3bb73475236',
      client_secret: '09c1824af9fd537cbcb59b5ba77396af41af74868331ec77d66d09e9f24e11a1',
      scope: 'send',
      response_type: 'code'
    },

    firefox: {}
  },

  sendMoney: function(to, amount) {
  }
});
