'use strict';

import { selectAll } from './dom';

function Component() {
  this.constructor.apply(this, arguments);
}

Component.prototype.constructor = function(element, template) {
  this.el = element;
  this.template = template || this.template;

  this.compiled = this.fetch(this.template).then(function(contents) {
    return combyne(contents);
  });
};

Component.prototype.fetch = function(template) {
  return new Promise(function(resolve, reject) {
    var xhr = new window.XMLHttpRequest();

    xhr.addEventListener('load', function() {
      resolve(this.responseText);
    }, true);

    xhr.addEventListener('error', reject, true);

    xhr.open('GET', '../scripts/lib/components/' + template, true);
    xhr.send();
  });
};

Component.prototype.render = function(context) {
  var element = this.el;

  return this.compiled.then(function(template) {
    return template.render(context);
  }).then(function(contents) {
    element.innerHTML = contents;
  });
};

Component.register = function(selector, Component) {
  selectAll(selector).forEach(function(element) {
    new Component(element).render();
  });
};

export default Component;
