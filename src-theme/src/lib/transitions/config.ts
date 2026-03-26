/*
 * This file is part of LiquidBounce (https://github.com/CCBlueX/LiquidBounce)
 *
 * Copyright (c) 2015 - 2026 CCBlueX
 *
 * LiquidBounce is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * LiquidBounce is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with LiquidBounce. If not, see <https://www.gnu.org/licenses/>.
 */

// Global transition configuration
// Adjust TRANSITION_SCALE to make all transitions faster/slower globally.
// 1.0 => unchanged, 0.5 => twice as fast (durations halved)
export let TRANSITION_SCALE = 0.5;

// When set to true, transitions will use minimal durations/delays to make
// navigation feel instantaneous (used temporarily during route changes).
export let FORCE_FAST_TRANSITIONS = false;

export function setForceFastTransitions(v: boolean) {
  FORCE_FAST_TRANSITIONS = v;
}

export function scaleDuration(d: number) {
  if (FORCE_FAST_TRANSITIONS) return 1; // minimal duration
  return Math.max(1, Math.round(d * TRANSITION_SCALE));
}

export function scaleDelay(d: number) {
  if (FORCE_FAST_TRANSITIONS) return 0; // no delay
  return Math.round(d * TRANSITION_SCALE);
}

