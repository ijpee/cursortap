import { register } from './registry';
import { scatterPoint } from './stage';
import { easeInExpo, easeOutExpo, rand, type AnimationDef } from './types';

/** Selection rectangle expands like highlighting code. */
const selectionBox: AnimationDef = {
  name: 'selectionBox',
  layer: 'background',
  life: 850,
  start({ width, height, dir }) {
    const p = scatterPoint(width, height, dir, 0.1);
    const maxW = width * rand(0.28, 0.55);
    const maxH = height * rand(0.14, 0.35);
    return {
      x: Math.max(width * 0.04, Math.min(p.x - maxW * 0.3, width - maxW - width * 0.04)),
      y: Math.max(height * 0.06, Math.min(p.y - maxH * 0.3, height - maxH - height * 0.06)),
      maxW,
      maxH,
    };
  },
  draw(ctx, _w, _h, t, anim) {
    const x = anim.state.x as number;
    const y = anim.state.y as number;
    const maxW = anim.state.maxW as number;
    const maxH = anim.state.maxH as number;
    const e = easeOutExpo(Math.min(1, t * 1.5));
    const fade = t > 0.55 ? easeInExpo((t - 0.55) / 0.45) : 0;
    const w = maxW * e;
    const h = maxH * Math.min(1, e * 1.2);

    ctx.globalAlpha = (1 - fade) * 0.35;
    ctx.fillStyle = anim.color;
    ctx.fillRect(x, y, w, h);

    ctx.globalAlpha = (1 - fade) * 0.9;
    ctx.strokeStyle = anim.color;
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, w, h);
  },
};

register(selectionBox);
