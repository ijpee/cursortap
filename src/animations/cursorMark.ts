import { register } from './registry';
import { getStage, scatterPoint } from './stage';
import { drawCursorMark } from './cursorShapes';
import { hexToRgba } from './palette';
import { easeInExpo, easeOutExpo, rand, type AnimationDef } from './types';

/** Cursor logo mark punches in at center / offset, scales, fades. */
const cursorMark: AnimationDef = {
  name: 'cursorMark',
  layer: 'foreground',
  life: 900,
  start({ width, height, dir }) {
    const p = scatterPoint(width, height, dir, 0.14);
    return {
      x: p.x,
      y: p.y,
      max: getStage().minDim * rand(0.22, 0.4),
    };
  },
  draw(ctx, _w, _h, t, anim) {
    const x = anim.state.x as number;
    const y = anim.state.y as number;
    const max = anim.state.max as number;
    const enter = easeOutExpo(Math.min(1, t * 1.8));
    const fade = t > 0.55 ? easeInExpo((t - 0.55) / 0.45) : 0;
    const scale = enter * (1 + 0.06 * Math.sin(Math.min(1, t * 4) * Math.PI));
    const size = max * scale;
    const alpha = 1 - fade;

    const glowR = size * 0.85;
    const g = ctx.createRadialGradient(x, y, 0, x, y, Math.max(1, glowR));
    g.addColorStop(0, hexToRgba(anim.color, alpha * 0.35));
    g.addColorStop(0.55, hexToRgba(anim.color, alpha * 0.12));
    g.addColorStop(1, hexToRgba(anim.color, 0));
    ctx.globalAlpha = 1;
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(x, y, glowR, 0, Math.PI * 2);
    ctx.fill();

    ctx.globalAlpha = alpha;
    drawCursorMark(ctx, x, y, size, anim.color);
  },
};

register(cursorMark);
