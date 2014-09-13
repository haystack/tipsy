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
export function select(selector) {
  return document.querySelector(selector);
}

/**
 * selectAll
 *
 * @param selector
 * @return
 */
export function selectAll(selector) {
  return toArray(document.querySelectorAll(selector));
}
