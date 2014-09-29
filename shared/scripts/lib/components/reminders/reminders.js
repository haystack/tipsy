'use strict';

import Component from '../../component';
import storage from '../../storage';

function RemindersComponent() {
  Component.prototype.constructor.apply(this, arguments);
}

RemindersComponent.prototype = {
  template: 'components/reminders/reminders.html',

  map: [
    'Hourly',
    'Daily',
    'Weekly',
    'Monthly',
    'Yearly'
  ],

  afterRender: function() {
    // Set the default.
    this.updateOutput(2);
  },

  events: {
    'input input[type=range]': 'updateOutput'
  },

  updateOutput: function(ev) {
    var output = this.$('output');
    var index = ev.target ? ev.target.value : ev;

    // 18% is out baseline, 12% increments for each item
    output.css('left', (16 + (index * 16)) + '%');
    output.val(this.map[index]);
  }
};

RemindersComponent.prototype.__proto__ = Component.prototype;

export default RemindersComponent;
