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

  this.bindEvents();
};

Component.prototype.bindEvents = function() {
  var events = this.events || {};

  Object.keys(events).forEach(function(eventAndSelector) {
    var fn = events[eventAndSelector];
    var parts = eventAndSelector.split(' ');
    var event = parts[0];
    var selector = parts.slice(1).join(' ');
    var component = this;
    var el = component.el;

    // Bind the event and adding in the necessary code for event delegation.
    el.addEventListener(event, function(ev) {
      // Event delegation.
      if (selector && selectAll(selector, el).indexOf(ev.target) > -1) {
        return component[fn].call(component, ev);
      }
      else if (!selector) {
        return component[fn].call(component, ev);
      }
    });
  }, this);
};

Component.prototype.fetch = function(template) {
  return new Promise(function(resolve, reject) {
    var xhr = new window.XMLHttpRequest();

    xhr.addEventListener('load', function() {
      resolve(this.responseText);
    }, true);

    xhr.addEventListener('error', reject, true);

    xhr.open('GET', '../scripts/lib/' + template, true);
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
