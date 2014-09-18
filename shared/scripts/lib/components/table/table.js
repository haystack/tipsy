'use strict';

import Component from '../../component';

function TableComponent() {
  Component.prototype.constructor.apply(this, arguments);
}

TableComponent.prototype = {
  template: 'components/table/table.html'
};

TableComponent.prototype.__proto__ = Component.prototype;

export default TableComponent;
