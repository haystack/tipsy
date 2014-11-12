'use strict';

import { defineAdapter } from '../oauth';

defineAdapter('dwolla', {
  options: {
    chrome: {
      url: 'https://www.dwolla.com/oauth/v2',
      client_id: 'kkAqjKVW2IN463Y9M3MgWBpGgtnTa/9i/DswI9/IPgRJspzqOP',
      client_secret: 'FLpat4wFWsyyiJz+DBPyJaKzovgeGQ1OlE/pomduztYOS/KSkq',
      scope: 'send',
      response_type: 'code'
    },

    firefox: {}
  },

  sendMoney: function(to, amount) {

  }
});
