'use strict';

import Component from '../../../component';
import { select } from '../../../dom';
import storage from '../../../storage';
import TableComponent from '../../table/table';

function LogPage() {
  var log = this;

  Component.prototype.constructor.apply(log, arguments);

  // Initially render and then bind the table component.
  log.render().then(function() {
    // Create a scoped table component to show the activity.
    log.table = new TableComponent(select('table', log.el));

    // Add filters.
    log.table.compiled.then(function(template) {
      template.registerFilter('timeSpent', function(val) {
        return (val.reduce(function(prev, current) {
          return prev + current.timeSpent;
        }, 0) / 1000) + ' seconds';
      });

      template.registerFilter('lastAccess', function(val) {
        return new Date(val[val.length - 1].accessTime).toString();
      });
    });

    // Render the empty table initially.
    log.table.render();

    // Render with the data found from the log.
    storage.get('log').then(function(log) {
      return { log: log };
    }).then(function(context) {
      log.table.render(context);
    });
  });
}

LogPage.prototype = {
  template: 'pages/log/log.html'
};

LogPage.prototype.__proto__ = Component.prototype;

export default LogPage;
