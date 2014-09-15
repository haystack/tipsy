'use strict';

import Component from '../../../component';

function GettingStartedPage() {
  Component.prototype.constructor.apply(this, arguments);
}

GettingStartedPage.prototype = {
  template: 'pages/getting-started/getting-started.html'
};

GettingStartedPage.prototype.__proto__ = Component.prototype;

export default GettingStartedPage;
