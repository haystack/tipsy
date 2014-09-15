'use strict';

/**
 * toArray
 *
 * @return
 */
function toArray() {
  return Array.prototype.slice.call(arguments[0]);
}

/**
 * select
 *
 * @param selector
 * @return
 */
export function select(selector, ctx) {
  ctx = ctx || document;
  return ctx.querySelector(selector);
}

/**
 * selectAll
 *
 * @param selector
 * @return
 */
export function selectAll(selector, ctx) {
  ctx = ctx || document;
  return toArray(ctx.querySelectorAll(selector));
}
