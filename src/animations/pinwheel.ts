import { register } from './registry';
import { getStage, TWO_PI } from './stage';
import { easeOutCubic, rand, type AnimationDef } from './types';

/** Spinning radial blades from center. */
const pinwheel: AnimationDef = {
  name: 'pinwheel',
  layer: 'middleground',
  life: 1000,
  start({ dir }) {
    const blades = Math.floor(rand(5, 9));
    return {
      blades,
      spin: dir * rand(0.8, 1.6),
      maxR: getStage().minDim * rand(0.35, 0.55),
    };
  },
  draw(ctx, width, height, t, anim) {
    const blades = anim.state.blades as number;
    const spin = anim.state.spin as number;
    const maxR = anim.state.maxR as number;
    const r = maxR * easeOutCubic(Math.min(1, t * 1.2));
    const rot = spin * TWO_PI * easeOutCubic(t);
    const alpha = 1 - Math.pow(t, 1.5);
    if (r < 0.5 || alpha < 0.01 || blades < 1) return;
    const cx = width / 2;
    const cy = height / 2;

    ctx.globalAlpha = alpha;
    ctx.fillStyle = anim.color;
    for (let i = 0; i < blades; i++) {
      const a0 = rot + (i / blades) * TWO_PI;
      const a1 = a0 + (Math.PI / blades) * 0.85;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, r, a0, a1);
      ctx.closePath();
      ctx.fill();
    }
  },
};

register(pinwheel);
