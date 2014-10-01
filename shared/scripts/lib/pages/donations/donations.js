'use strict';

import Component from '../../component';

function DonationsPage() {
  Component.prototype.constructor.apply(this, arguments);
}

DonationsPage.prototype = {
  template: 'pages/donations/donations.html',

  serialize: function() {
    return { entries: [] };
  }
};

DonationsPage.prototype.__proto__ = Component.prototype;

export default DonationsPage;
