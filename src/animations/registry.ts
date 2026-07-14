import {
  flashBackground,
  getPalette,
  hexToRgba,
  tickPalette,
} from './palette';
import { resizeStage } from './stage';
import type { ActiveAnimation, AnimationDef, StartOpts } from './types';

const MAX_ACTIVE = 14;

const defs = new Map<string, AnimationDef>();
let active: ActiveAnimation[] = [];
let pulse = 0;

export function register(def: AnimationDef): void {
  if (defs.has(def.name)) {
    throw new Error(`Animation already registered: ${def.name}`);
  }
  defs.set(def.name, def);
}

export function hasAnimation(name: string): boolean {
  return defs.has(name);
}

export function listAnimations(): string[] {
  return [...defs.keys()];
}

export function resizeAnimations(width: number, height: number): void {
  resizeStage(width, height);
}

export function triggerAnimation(
  name: string,
  opts: Omit<StartOpts, 'now'> & { now?: number },
): void {
  const def = defs.get(name);
  if (!def) return;

  const now = opts.now ?? performance.now();
  let state;
  try {
    state = def.start({
      color: opts.color,
      dir: opts.dir,
      width: opts.width,
      height: opts.height,
      now,
    });
  } catch (err) {
    console.error(`[cursortap] start failed: ${name}`, err);
    return;
  }

  // Space owns permanent theme changes — anims may only flash briefly
  if (def.palette === 'flash' || def.palette === 'both') {
    flashBackground(opts.color, 160);
  }

  active.push({
    name: def.name,
    layer: def.layer,
    born: now,
    life: def.life,
    color: opts.color,
    dir: opts.dir,
    state,
    draw: def.draw,
  });

  while (active.length > MAX_ACTIVE) {
    active.shift();
  }

  pulse = 1;
}

export function getPulse(): number {
  return pulse;
}

export function tickAnimations(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  now: number,
): void {
  resizeStage(width, height);

  const { bg, flashing } = tickPalette(now);
  const palette = getPalette();

  ctx.globalAlpha = 1;
  ctx.globalCompositeOperation = 'source-over';
  ctx.fillStyle = flashing ? hexToRgba(bg, 1) : bg;
  ctx.fillRect(0, 0, width, height);

  if (pulse > 0.02) {
    const radius = Math.max(1, Math.min(width, height) * 0.55);
    const g = ctx.createRadialGradient(
      width / 2,
      height / 2,
      0,
      width / 2,
      height / 2,
      radius,
    );
    g.addColorStop(0, hexToRgba(palette.accent, 0.12 * pulse));
    g.addColorStop(1, hexToRgba(palette.accent, 0));
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, width, height);
    pulse *= 0.88;
  }

  active = active.filter((a) => now - a.born < a.life);

  const order: ActiveAnimation['layer'][] = [
    'background',
    'middleground',
    'foreground',
  ];

  for (const layer of order) {
    for (const anim of active) {
      if (anim.layer !== layer) continue;
      const t = Math.min(1, (now - anim.born) / anim.life);
      ctx.save();
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = 'source-over';
      try {
        anim.draw(ctx, width, height, t, anim);
      } catch (err) {
        console.error(`[cursortap] draw failed: ${anim.name}`, err);
        anim.life = 0;
      }
      ctx.restore();
    }
  }
}

export function clearAnimations(): void {
  active = [];
  pulse = 0;
}
