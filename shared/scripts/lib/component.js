'use strict';

import { select, selectAll } from './dom';

/**
 * Represents a Component
 */
function Component() {
  this.constructor.apply(this, arguments);
}

/**
 * Sets up the component with an element and template.  This will also fetch
 * the associated template and compile it to a function.
 *
 * @param {Object} element - to associate with the component.
 * @param {string} template - path to fetch.
 */
Component.prototype.constructor = function(element, template) {
  this.el = element;
  this.template = template || this.template;

  var component = this;

  this.compiled = this.fetch(this.template).then(function(contents) {
    var template = combyne(contents);

    // Register all filters to the template.
    [].concat(component.filters).forEach(function(filter) {
      template.registerFilter(filter, component[filter]);
    });

    return template;
  });

  this.bindEvents();
};

/**
 * Extracts declarative events and binds to the internal element, very similar
 * to `Backbone.View#events`.
 */
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
    $(el).on(event, selector, function(ev) {
      ev.stopImmediatePropagation();
      return component[fn].call(component, ev);
    });
  }, this);
};

/**
 * Makes an asynchronous request to the extension filesystem to retrieve a
 * template.
 *
 * @param {string} template - to fetch.
 * @return {Promise} that resolves once the template is fetched.
 */
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

/**
 * Extracts the component's data (context) from the arguments or serialize
 * function.  This data is then passed into the previously fetched and compiled
 * template.  From there the result is injected into the component's internal
 * element.  Finally the `afterRender` is triggered if it exists.
 *
 * @param {Object} context - data to render in the template.
 * @return {Promise} that resolves when the rendering completes.
 */
Component.prototype.render = function(context) {
  var component = this;
  var element = this.el;

  context = context || (component.serialize ? component.serialize() : {});

  return this.compiled.then(function(template) {
    return template.render(context);
  }).then(function(contents) {
    element.innerHTML = contents;
    return contents;
  }).then(function() {
    if (component.afterRender) {
      component.afterRender();
    }
  }).catch(function(ex) {
    console.log(component, context);
    console.log(ex.stack);
  });
};

/**
 * A scoped (to the component's internal element) jQuery lookup.
 *
 * @param {string} selector - to search for.
 * @return {Object} jQuery wrapped object containing the matched elements.
 */
Component.prototype.$ = function(selector) {
  return $(selector, this.el);
};

/**
 * Loops through matching elements and initializes a component instance into
 * each one.
 *
 * @param {string} selector - to search for matching elements.
 * @param {Function} Component - constructor to initialize.
 * @param {Object} context - element to scope selector matching to.
 */
Component.register = function(selector, Component, context) {
  $(selector, context).each(function() {
    new Component(this);
  });
};

Component.registerPage = function(selector, Component, context) {
  var element = select(selector, context);
  return new Component(element);
};

export default Component;
