import { register } from './registry';
import { getStage, TWO_PI } from './stage';
import { easeOutCubic, rand, type AnimationDef } from './types';

/** Floating suspended dots / particles that drift upward. */
const suspension: AnimationDef = {
  name: 'suspension',
  layer: 'middleground',
  life: 1300,
  start({ width, height }) {
    const count = Math.floor(rand(20, 36));
    const xs: number[] = [];
    const ys: number[] = [];
    const rs: number[] = [];
    const drifts: number[] = [];
    for (let i = 0; i < count; i++) {
      xs.push(width * rand(0.1, 0.9));
      ys.push(height * rand(0.55, 1.05));
      rs.push(getStage().minDim * rand(0.006, 0.025));
      drifts.push(rand(-40, 40));
    }
    return { count, xs, ys, rs, drifts };
  },
  draw(ctx, _w, height, t, anim) {
    const count = anim.state.count as number;
    const xs = anim.state.xs as number[];
    const ys = anim.state.ys as number[];
    const rs = anim.state.rs as number[];
    const drifts = anim.state.drifts as number[];
    const e = easeOutCubic(t);
    const alpha = 1 - Math.pow(t, 1.1);

    ctx.fillStyle = anim.color;
    for (let i = 0; i < count; i++) {
      const x = xs[i] + drifts[i] * e;
      const y = ys[i] - height * 0.55 * e;
      ctx.globalAlpha = alpha * (0.4 + 0.6 * ((i % 4) / 4));
      ctx.beginPath();
      ctx.arc(x, y, rs[i] * (1 - t * 0.3), 0, TWO_PI);
      ctx.fill();
    }
  },
};

register(suspension);
