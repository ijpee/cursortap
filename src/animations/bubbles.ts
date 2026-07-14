import { register } from './registry';
import { getStage, TWO_PI } from './stage';
import { easeOutCubic, rand, type AnimationDef } from './types';

/** Rising bubble circles. */
const bubbles: AnimationDef = {
  name: 'bubbles',
  layer: 'foreground',
  life: 1100,
  start({ width, height }) {
    const count = Math.floor(rand(8, 16));
    const xs: number[] = [];
    const ys: number[] = [];
    const rs: number[] = [];
    const speeds: number[] = [];
    for (let i = 0; i < count; i++) {
      xs.push(width * rand(0.1, 0.9));
      ys.push(height * rand(0.4, 1.05));
      rs.push(getStage().minDim * rand(0.02, 0.08));
      speeds.push(rand(0.35, 0.9));
    }
    return { count, xs, ys, rs, speeds };
  },
  draw(ctx, _w, height, t, anim) {
    const count = anim.state.count as number;
    const xs = anim.state.xs as number[];
    const ys = anim.state.ys as number[];
    const rs = anim.state.rs as number[];
    const speeds = anim.state.speeds as number[];
    const e = easeOutCubic(t);
    const alpha = 1 - Math.pow(t, 1.2);

    ctx.globalAlpha = alpha;
    ctx.strokeStyle = anim.color;
    ctx.fillStyle = anim.color;
    for (let i = 0; i < count; i++) {
      const y = ys[i] - height * speeds[i] * e;
      const r = rs[i] * (0.5 + 0.5 * e);
      ctx.lineWidth = 2;
      ctx.globalAlpha = alpha * (0.4 + 0.6 * ((i % 3) / 3));
      ctx.beginPath();
      ctx.arc(xs[i], y, r, 0, TWO_PI);
      if (i % 2 === 0) ctx.fill();
      else ctx.stroke();
    }
  },
};

register(bubbles);
