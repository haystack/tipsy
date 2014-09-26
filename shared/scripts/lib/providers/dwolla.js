'use strict';

import { defineAdapter } from '../oauth';

defineAdapter('dwolla', {
  options: {
    url: 'https://www.dwolla.com/oauth/v2/authenticate',
    client_id: 'kkAqjKVW2IN463Y9M3MgWBpGgtnTa/9i/DswI9/IPgRJspzqOP',
    scope: 'send',
    response_type: 'code'
  },

  sendMoney: function(to, amount) {

  }
});
