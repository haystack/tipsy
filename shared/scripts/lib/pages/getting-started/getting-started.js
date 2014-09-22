'use strict';

import Component from '../../component';
import storage from '../../storage';
import { select } from '../../dom';
import ProvidersComponent from '../../components/providers/providers';
import DonationGoalComponent from '../../components/donation-goal/donation-goal';

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
    this.advanceTo(2);
  },

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
    this.advanceTo(1);
  },

  recedeTo: function(start) {
    var lis = this.$('ol li');
    var startLi = lis.eq(start);
    var endLi = lis.eq(start + 1);

    startLi.animate({ left: '-90%' }).promise().then(function() {
      return endLi.fadeIn(1000).promise().then(function() {
        return startLi.animate({ opacity: 0.4, left: '-100%' }).promise();
      });
    });
  },

  advanceTo: function(end) {
    var lis = this.$('ol li');
    var startLi = lis.eq(end - 1);
    var endLi = lis.eq(end);

    startLi.animate({ left: '-77%' }).promise().then(function() {
      return endLi.fadeIn(1000).promise().then(function() {
        return startLi.animate({ opacity: 0.4, left: '-80%' }).promise();
      });
    });
  },

  afterRender: function() {
    new ProvidersComponent(select('set-providers', this.el)).render();
    new DonationGoalComponent(select('set-donation-goal', this.el)).render();

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
