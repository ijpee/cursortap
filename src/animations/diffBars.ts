import { register } from './registry';
import { easeInExpo, easeOutExpo, rand, type AnimationDef } from './types';

/** Diff hunk bars slam in — review / apply energy. */
const diffBars: AnimationDef = {
  name: 'diffBars',
  layer: 'middleground',
  life: 800,
  start({ width, height, dir }) {
    const count = Math.floor(rand(4, 7));
    const ys: number[] = [];
    const widths: number[] = [];
    const kinds: number[] = [];
    for (let i = 0; i < count; i++) {
      ys.push(height * (0.18 + i * 0.1));
      widths.push(width * rand(0.35, 0.7));
      kinds.push(i % 2);
    }
    return { count, ys, widths, kinds, dir };
  },
  draw(ctx, width, _h, t, anim) {
    const count = anim.state.count as number;
    const ys = anim.state.ys as number[];
    const widths = anim.state.widths as number[];
    const kinds = anim.state.kinds as number[];
    const dir = anim.state.dir as number;
    const fade = t > 0.6 ? easeInExpo((t - 0.6) / 0.4) : 0;

    for (let i = 0; i < count; i++) {
      const stagger = i * 0.06;
      const local = Math.max(0, Math.min(1, (t - stagger) / 0.4));
      const e = easeOutExpo(local);
      const w = widths[i] * e;
      const h = 14 + (kinds[i] ? 4 : 0);
      const x = dir < 0 ? width - w - width * 0.08 : width * 0.08;
      ctx.globalAlpha = e * (1 - fade) * (kinds[i] ? 0.55 : 0.85);
      ctx.fillStyle = anim.color;
      ctx.fillRect(x, ys[i], w, h);
      ctx.globalAlpha = e * (1 - fade);
      ctx.fillRect(dir < 0 ? width - 10 : 4, ys[i], 4, h);
    }
  },
};

register(diffBars);
