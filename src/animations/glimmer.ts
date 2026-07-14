import { register } from './registry';
import { getStage, TWO_PI } from './stage';
import { easeOutCubic, rand, type AnimationDef } from './types';

/** Twinkling glimmer dots across the field. */
const glimmer: AnimationDef = {
  name: 'glimmer',
  layer: 'foreground',
  life: 900,
  start({ width, height }) {
    const count = Math.floor(rand(18, 32));
    const xs: number[] = [];
    const ys: number[] = [];
    const phases: number[] = [];
    const sizes: number[] = [];
    for (let i = 0; i < count; i++) {
      xs.push(width * rand(0.05, 0.95));
      ys.push(height * rand(0.05, 0.95));
      phases.push(rand(0, TWO_PI));
      sizes.push(getStage().minDim * rand(0.004, 0.014));
    }
    return { count, xs, ys, phases, sizes };
  },
  draw(ctx, _w, _h, t, anim) {
    const count = anim.state.count as number;
    const xs = anim.state.xs as number[];
    const ys = anim.state.ys as number[];
    const phases = anim.state.phases as number[];
    const sizes = anim.state.sizes as number[];
    const envelope = easeOutCubic(Math.min(1, t * 2)) * (1 - Math.max(0, (t - 0.5) * 2));

    ctx.fillStyle = anim.color;
    for (let i = 0; i < count; i++) {
      const twinkle = 0.4 + 0.6 * Math.abs(Math.sin(t * 8 + phases[i]));
      const r = sizes[i] * twinkle * (0.7 + envelope);
      ctx.globalAlpha = envelope * twinkle;
      ctx.beginPath();
      ctx.arc(xs[i], ys[i], r, 0, TWO_PI);
      ctx.fill();
    }
  },
};

register(glimmer);
