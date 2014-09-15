'use strict';

import Component from '../../component';

function SettingsPage() {
  Component.prototype.constructor.apply(this, arguments);
}

SettingsPage.prototype = {
  template: 'pages/settings/settings.html'
};

SettingsPage.prototype.__proto__ = Component.prototype;

export default SettingsPage;
