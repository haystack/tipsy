'use strict';

import { selectAll } from './dom';
import { environment } from './environment';
import settings from './settings';

/**
 * Monitors the idle state and triggers a callback whenever it changes.
 *
 * @param {Function} isIdle - A callback function to trigger with the state.
 */
export function monitorState(isIdle) {
  var currentState = true;

  var addEvent = function(element, event, state) {
    element.addEventListener(event, function() {
      if (state !== currentState) {
        isIdle(state);
        currentState = state;
      }
    }, true);
  };

  selectAll('audio, video').forEach(function(media) {
    addEvent(media, 'abort', true);
    addEvent(media, 'pause', true);
    addEvent(media, 'playing', false);
  });

  addEvent(document.body, 'scroll', false);
  addEvent(document.body, 'mousemove', false);
}
