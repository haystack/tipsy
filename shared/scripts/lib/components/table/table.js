'use strict';

import Component from '../../component';

function TableComponent() {
  Component.prototype.constructor.apply(this, arguments);
}

TableComponent.prototype = {
  template: 'components/table/table.html',

  columns: function(array) {
    this.columns = array || [];
  },

  render: function(context) {
    context = context || {};
    context.columns = this.columns;

    return Component.prototype.render.apply(this, arguments);
  }
};

TableComponent.prototype.__proto__ = Component.prototype;

export default TableComponent;
