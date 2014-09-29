'use strict';

import Component from '../../component';
import storage from '../../storage';
import { select } from '../../dom';
import ProvidersComponent from '../../components/providers/providers';
import DonationGoalComponent from '../../components/donation-goal/donation-goal';
import RemindersComponent from '../../components/reminders/reminders';

function GettingStartedPage() {
  Component.prototype.constructor.apply(this, arguments);

  // Ensure that start is correctly bound.
  this.start = this.start.bind(this);
}

GettingStartedPage.prototype = {
  template: 'pages/getting-started/getting-started.html',

  render: function() {
    return Component.prototype.render.apply(this, arguments)
      .then(this.afterRender.bind(this));
  },

  events: {
    'click button': 'skipConfiguration',
    'click .to-donation': 'toDonation'
  },

  toDonation: function(ev) {
    ev.preventDefault();
    this.advance();
  },

  // Determines which direction to go into.
  state: 0,

  // Test code to ensure parity between client and background scripts.
  skipConfiguration: function(ev) {
    ev.stopPropagation();
    ev.preventDefault();

    storage.get('settings').then(function(settings) {
      settings.showLog = !settings.showLog;
      storage.set('settings', settings);

      // Redirect the user to the log page after clicking skip.
      location.hash = '#log';
    });
  },

  start: function(ev) {
    this.advance();
  },

  recede: function() {
    var end = --this.state;
    var lis = this.$('ol li');

    lis.removeClass('collapse expand');

    // Collapse the previous and expand to the end.
    lis.slice(end).addClass('collapse');
    lis.eq(end - 1).addClass('expand');
  },

  advance: function() {
    var end = ++this.state;
    var lis = this.$('ol li');

    lis.removeClass('collapse expand');

    // Collapse the previous and expand to the end.
    lis.slice(0, end).addClass('collapse');
    lis.eq(end).addClass('expand');
  },

  afterRender: function() {
    new ProvidersComponent(select('set-providers', this.el)).render();
    new DonationGoalComponent(select('set-donation-goal', this.el)).render();
    new RemindersComponent(select('set-reminders', this.el)).render();

    setTimeout(function() {
      select('form', this.el).classList.add('fade');
    }.bind(this), 250);

    // After each render, unbind the advance script that can handle a click
    // from anywhere on the page.
    $('body').unbind(this.start).one('click', this.start);
  }
};

GettingStartedPage.prototype.__proto__ = Component.prototype;

export default GettingStartedPage;
