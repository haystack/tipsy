'use strict';

import { defineAdapter } from '../oauth';

defineAdapter('paypal', {
  options: {
    chrome: {
      url: 'https://www.sandbox.paypal.com/webapps/auth/protocol/openidconnect/v1/authorize',
      client_id: 'Acwk0RBhqPB6wLvFqZCAbi2jFXw8YLMfzTZv1fGyRNn1mVJfXlMTOodKM-vS',
      response_type: 'code'
    },

    firefox: {}
  },

  sendMoney: function(to, amount) {

  }
});
