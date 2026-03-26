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

import { cubicOut } from 'svelte/easing';
import { scaleDuration, scaleDelay } from './config';

interface Options {
  delay?: number;
  duration?: number;
  base?: number; // starting opacity (0..1)
  easing?: (t: number) => number;
}

export function subtleFade(node: Element, opts: Options = {}) {
  const { delay = 0, duration = 200, base = 0.9, easing = cubicOut } = opts;
  const from = Math.max(0, Math.min(1, base));

  const scaledDuration = scaleDuration(duration);
  const scaledDelay = scaleDelay(delay);

  return {
    delay: scaledDelay,
    duration: scaledDuration,
    easing,
    css: (t: number) => `opacity: ${from + (1 - from) * t}`
  };
}

