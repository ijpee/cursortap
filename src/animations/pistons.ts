import { register } from './registry';
import { easeOutCubic, rand, type AnimationDef } from './types';

/** Vertical piston bars slam in from top/bottom. */
const pistons: AnimationDef = {
  name: 'pistons',
  layer: 'middleground',
  life: 700,
  start({ width, height }) {
    const count = Math.floor(rand(4, 8));
    const xs: number[] = [];
    const fromTop: number[] = [];
    const widths: number[] = [];
    const depths: number[] = [];
    const gap = width / (count + 1);
    for (let i = 0; i < count; i++) {
      xs.push(gap * (i + 1));
      fromTop.push(Math.random() > 0.5 ? 1 : 0);
      widths.push(gap * rand(0.35, 0.7));
      depths.push(height * rand(0.45, 0.85));
    }
    return { count, xs, fromTop, widths, depths };
  },
  draw(ctx, _w, _h, t, anim) {
    const count = anim.state.count as number;
    const xs = anim.state.xs as number[];
    const fromTop = anim.state.fromTop as number[];
    const widths = anim.state.widths as number[];
    const depths = anim.state.depths as number[];
    const slam = easeOutCubic(Math.min(1, t * 1.6));
    const retract = t > 0.55 ? (t - 0.55) / 0.45 : 0;
    const amount = slam * (1 - retract);
    const alpha = 1 - Math.max(0, (t - 0.75) / 0.25);

    ctx.globalAlpha = alpha;
    ctx.fillStyle = anim.color;
    for (let i = 0; i < count; i++) {
      const w = widths[i];
      const d = depths[i] * amount;
      const x = xs[i] - w / 2;
      if (fromTop[i]) {
        ctx.fillRect(x, 0, w, d);
      } else {
        ctx.fillRect(x, _h - d, w, d);
      }
    }
  },
};

register(pistons);
