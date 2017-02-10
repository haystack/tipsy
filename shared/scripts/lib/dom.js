'use strict';

/**
 * Coerces a NodeList to an Array.
 *
 * @return {Array} of elements.
 */
function toArray() {
  return Array.prototype.slice.call(arguments[0]);
}

/**
 * Alias to `Document#querySelector` that optionally accepts a context to scope
 * lookups to.
 *
 * @param {string} selector - to match an element.
 * @return {Object} matched element.
 */
export function select(selector, ctx) {
  ctx = ctx || document;
  return ctx.querySelector(selector);
}

/**
 * Alias to `Document#querySelectorAll` that optionally accepts a context to
 * scope lookups to.
 *
 * @param {string} selector - to match elements.
 * @param {Object} context - element to scope lookups to.
 * @return {Array} of matched elements.
 */
export function selectAll(selector, ctx) {
  ctx = ctx || document;
  return toArray(ctx.querySelectorAll(selector));
}
