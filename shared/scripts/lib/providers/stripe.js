'use strict';

import { defineAdapter } from '../oauth';

defineAdapter('stripe', {
  options: {
    chrome: {
      url: 'https://connect.stripe.com/oauth/authorize',
      client_id: 'ca_4p4SQSiq8XqZN9mOhoUTVgKoJ5SGJXQi',
      scope: 'read_write',
      response_type: 'code'
    },

    firefox: {}
  },

  sendMoney: function(to, amount) {

  }
});
