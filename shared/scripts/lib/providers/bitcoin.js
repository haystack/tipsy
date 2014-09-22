'use strict';

import { displayCustom } from './oauth';

defineAdapter('dwolla', {
  options: {},

  authorize: function() {
    return displayCustom({
      
    })
  },

  sendMoney: function(to, amount) {

  }
});
