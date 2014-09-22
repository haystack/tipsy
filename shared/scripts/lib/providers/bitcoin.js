'use strict';

import { displayCustom, defineAdapter } from './oauth';

defineAdapter('bitcoin', {
  options: {},

  authorize: function() {
    return displayCustom({

    });
  },

  sendMoney: function(to, amount) {

  }
});
