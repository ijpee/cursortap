import { register } from './registry';
import { getStage, scatterPoint } from './stage';
import { easeInExpo, easeOutCubic, rand, type AnimationDef } from './types';

const GLYPHS = '=>{}[]()/$*#@|;:'.split('');

/** Code glyph shards burst from a scattered origin. */
const codeShards: AnimationDef = {
  name: 'codeShards',
  layer: 'foreground',
  life: 1000,
  start({ width, height, dir }) {
    const origin = scatterPoint(width, height, dir, 0.15);
    const count = Math.floor(rand(16, 26));
    const xs: number[] = [];
    const ys: number[] = [];
    const vxs: number[] = [];
    const vys: number[] = [];
    const glyphs: string[] = [];
    const sizes: number[] = [];
    for (let i = 0; i < count; i++) {
      const a = rand(0, Math.PI * 2);
      const speed = getStage().minDim * rand(0.12, 0.42);
      xs.push(origin.x);
      ys.push(origin.y);
      vxs.push(Math.cos(a) * speed);
      vys.push(Math.sin(a) * speed);
      glyphs.push(GLYPHS[Math.floor(Math.random() * GLYPHS.length)]);
      sizes.push(getStage().minDim * rand(0.03, 0.07));
    }
    return { count, xs, ys, vxs, vys, glyphs: glyphs.join('\0'), sizes };
  },
  draw(ctx, _w, _h, t, anim) {
    const count = anim.state.count as number;
    const xs = anim.state.xs as number[];
    const ys = anim.state.ys as number[];
    const vxs = anim.state.vxs as number[];
    const vys = anim.state.vys as number[];
    const glyphs = (anim.state.glyphs as string).split('\0');
    const sizes = anim.state.sizes as number[];
    const e = easeOutCubic(t);
    const fade = t > 0.55 ? easeInExpo((t - 0.55) / 0.45) : 0;

    ctx.fillStyle = anim.color;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    for (let i = 0; i < count; i++) {
      const x = xs[i] + vxs[i] * e;
      const y = ys[i] + vys[i] * e;
      ctx.globalAlpha = (1 - fade) * (0.5 + (i % 3) * 0.2);
      ctx.font = `600 ${sizes[i] * (1 - t * 0.3)}px "Berkeley Mono", ui-monospace, Menlo, monospace`;
      ctx.fillText(glyphs[i] || '>', x, y);
    }
  },
};

register(codeShards);
