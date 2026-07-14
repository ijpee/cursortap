import { register } from './registry';
import { getStage, scatterPoint } from './stage';
import { easeOutCubic, rand, type AnimationDef } from './types';

/** Burst of confetti rectangles from a scattered origin. */
const confetti: AnimationDef = {
  name: 'confetti',
  layer: 'foreground',
  life: 1200,
  start({ width, height, dir }) {
    const origin = scatterPoint(width, height, dir, 0.12);
    const count = Math.floor(rand(14, 22));
    const xs: number[] = [];
    const ys: number[] = [];
    const vxs: number[] = [];
    const vys: number[] = [];
    const rots: number[] = [];
    const spins: number[] = [];
    const sizes: number[] = [];
    for (let i = 0; i < count; i++) {
      const a = rand(0, Math.PI * 2);
      const speed = rand(0.2, 0.7) * getStage().minDim;
      xs.push(origin.x);
      ys.push(origin.y);
      vxs.push(Math.cos(a) * speed);
      vys.push(Math.sin(a) * speed - rand(40, 120));
      rots.push(rand(0, Math.PI * 2));
      spins.push(rand(-4, 4));
      sizes.push(rand(4, 14));
    }
    return { count, xs, ys, vxs, vys, rots, spins, sizes };
  },
  draw(ctx, _w, _h, t, anim) {
    const count = anim.state.count as number;
    const xs = anim.state.xs as number[];
    const ys = anim.state.ys as number[];
    const vxs = anim.state.vxs as number[];
    const vys = anim.state.vys as number[];
    const rots = anim.state.rots as number[];
    const spins = anim.state.spins as number[];
    const sizes = anim.state.sizes as number[];
    const e = easeOutCubic(t);
    const alpha = 1 - Math.pow(t, 0.9);

    ctx.fillStyle = anim.color;
    for (let i = 0; i < count; i++) {
      const x = xs[i] + vxs[i] * e;
      const y = ys[i] + vys[i] * e + 400 * t * t;
      const rot = rots[i] + spins[i] * t;
      const s = sizes[i] * (1 - t * 0.3);
      ctx.save();
      ctx.globalAlpha = alpha * (0.5 + (i % 3) * 0.2);
      ctx.translate(x, y);
      ctx.rotate(rot);
      ctx.fillRect(-s / 2, -s / 4, s, s / 2);
      ctx.restore();
    }
  },
};

register(confetti);
