'use strict';

import { defineAdapter } from '../oauth';

defineAdapter('paypal', {
  options: {
    url: 'https://www.sandbox.paypal.com/webapps/auth/protocol/openidconnect/v1/authorize',
    client_id: 'Acwk0RBhqPB6wLvFqZCAbi2jFXw8YLMfzTZv1fGyRNn1mVJfXlMTOodKM-vS',
    response_type: 'code'
  },

  sendMoney: function(to, amount) {

  }
});
