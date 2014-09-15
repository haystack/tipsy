'use strict';

import Component from '../../../component';

function BillingPage() {
  Component.prototype.constructor.apply(this, arguments);
}

BillingPage.prototype = {
  template: 'pages/billing/billing.html'
};

BillingPage.prototype.__proto__ = Component.prototype;

export default BillingPage;
