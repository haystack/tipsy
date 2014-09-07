'use strict';

function toArray() {
  return Array.prototype.slice.call(arguments[0]);
}

export function select(selector) {
  return document.querySelector(selector);
}

export function selectAll(selector) {
  return toArray(document.querySelectorAll(selector));
}
