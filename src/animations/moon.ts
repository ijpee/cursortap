import { register } from './registry';
import { getStage, TWO_PI } from './stage';
import { easeInOut, easeOutCubic, rand, type AnimationDef } from './types';

/** Crescent moon that grows and fades. */
const moon: AnimationDef = {
  name: 'moon',
  layer: 'middleground',
  life: 1000,
  start({ width, height }) {
    return {
      x: width * rand(0.25, 0.75),
      y: height * rand(0.2, 0.7),
      maxR: getStage().minDim * rand(0.18, 0.32),
      offset: rand(0.35, 0.55),
    };
  },
  draw(ctx, _w, _h, t, anim) {
    const x = anim.state.x as number;
    const y = anim.state.y as number;
    const maxR = anim.state.maxR as number;
    const offset = anim.state.offset as number;
    const grow = easeOutCubic(Math.min(1, t * 1.4));
    const fade = t > 0.55 ? easeInOut((t - 0.55) / 0.45) : 0;
    const r = maxR * grow;
    const alpha = 1 - fade;
    if (r < 1 || alpha < 0.01) return;

    ctx.globalAlpha = alpha;
    ctx.fillStyle = anim.color;

    // Crescent: full disc, then punch hole with destination-out
    ctx.beginPath();
    ctx.arc(x, y, r, 0, TWO_PI);
    ctx.fill();
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x + r * offset, y - r * 0.1, r * 0.92, 0, TWO_PI);
    ctx.fill();
  },
};

register(moon);
