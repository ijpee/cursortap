import { register } from './registry';
import { getStage, scatterPoint } from './stage';
import { drawCaret } from './cursorShapes';
import { easeInExpo, easeOutExpo, rand, type AnimationDef } from './types';

/** Inline edit brackets + caret flash. */
const inlineEdit: AnimationDef = {
  name: 'inlineEdit',
  layer: 'foreground',
  life: 850,
  start({ width, height, dir }) {
    const p = scatterPoint(width, height, dir, 0.14);
    return {
      x: p.x,
      y: p.y,
      w: getStage().minDim * rand(0.2, 0.4),
      h: getStage().minDim * rand(0.07, 0.12),
    };
  },
  draw(ctx, _w, _h, t, anim) {
    const x = anim.state.x as number;
    const y = anim.state.y as number;
    const w = anim.state.w as number;
    const h = anim.state.h as number;
    const e = easeOutExpo(Math.min(1, t * 1.7));
    const fade = t > 0.6 ? easeInExpo((t - 0.6) / 0.4) : 0;
    const alpha = 1 - fade;
    const bw = w * e;

    ctx.globalAlpha = alpha * 0.3;
    ctx.fillStyle = anim.color;
    ctx.fillRect(x - bw / 2, y - h / 2, bw, h);

    ctx.globalAlpha = alpha;
    ctx.strokeStyle = anim.color;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(x - bw / 2 + 12, y - h / 2);
    ctx.lineTo(x - bw / 2, y - h / 2);
    ctx.lineTo(x - bw / 2, y + h / 2);
    ctx.lineTo(x - bw / 2 + 12, y + h / 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x + bw / 2 - 12, y - h / 2);
    ctx.lineTo(x + bw / 2, y - h / 2);
    ctx.lineTo(x + bw / 2, y + h / 2);
    ctx.lineTo(x + bw / 2 - 12, y + h / 2);
    ctx.stroke();

    const blink = Math.sin(t * 22) > 0 ? 1 : 0.2;
    ctx.globalAlpha = alpha * blink;
    drawCaret(ctx, x, y, h * 0.7, 4, anim.color);
  },
};

register(inlineEdit);
