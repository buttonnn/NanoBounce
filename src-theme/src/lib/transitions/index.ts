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

import { fly as svelteFly, fade as svelteFade, slide as svelteSlide } from 'svelte/transition';
import { scaleDuration, scaleDelay } from './config';

export function fly(node: Element, opts: any = {}) {
  const options = { ...opts };
  options.duration = scaleDuration(options.duration ?? 300);
  options.delay = scaleDelay(options.delay ?? 0);
  return svelteFly(node, options as any);
}

export function fade(node: Element, opts: any = {}) {
  const options = { ...opts };
  options.duration = scaleDuration(options.duration ?? 200);
  options.delay = scaleDelay(options.delay ?? 0);
  return svelteFade(node, options as any);
}

export function slide(node: Element, opts: any = {}) {
  const options = { ...opts };
  options.duration = scaleDuration(options.duration ?? 200);
  options.delay = scaleDelay(options.delay ?? 0);
  return svelteSlide(node, options as any);
}

export { subtleFly } from './subtleFly';
export { subtleFade } from './subtleFade';

