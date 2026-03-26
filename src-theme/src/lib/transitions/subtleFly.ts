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
  easing?: (t: number) => number;
  x?: number;
  y?: number;
  baseOpacity?: number; // starting opacity (0..1)
}

export function subtleFly(node: Element, opts: Options = {}) {
  const style = getComputedStyle(node);
  const transform = style.transform === 'none' ? '' : style.transform;
  const { delay = 0, duration = 300, easing = cubicOut, x = 0, y = 0, baseOpacity = 0.9 } = opts;

  // Apply global scaling
  const scaledDuration = scaleDuration(duration);
  const scaledDelay = scaleDelay(delay);

  const fromOpacity = Math.max(0, Math.min(1, baseOpacity));

  return {
    delay: scaledDelay,
    duration: scaledDuration,
    easing,
    css: (t: number) => {
      const tx = (1 - t) * x;
      const ty = (1 - t) * y;
      const o = fromOpacity + (1 - fromOpacity) * t;
      return `transform: ${transform} translate(${tx}px, ${ty}px); opacity: ${o}`;
    }
  };
}


