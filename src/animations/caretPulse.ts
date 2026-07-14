import { register } from './registry';
import { getStage, scatterPoint } from './stage';
import { drawCaret } from './cursorShapes';
import { easeInExpo, easeOutExpo, rand, type AnimationDef } from './types';

/** Oversized blinking caret — Cursor editor DNA. */
const caretPulse: AnimationDef = {
  name: 'caretPulse',
  layer: 'foreground',
  life: 900,
  start({ width, height, dir }) {
    const p = scatterPoint(width, height, dir, 0.1);
    return {
      x: p.x,
      y: p.y,
      h: getStage().minDim * rand(0.18, 0.4),
      w: getStage().minDim * rand(0.012, 0.025),
    };
  },
  draw(ctx, _w, _h, t, anim) {
    const x = anim.state.x as number;
    const y = anim.state.y as number;
    const h = anim.state.h as number;
    const w = anim.state.w as number;
    const enter = easeOutExpo(Math.min(1, t * 2));
    const fade = t > 0.6 ? easeInExpo((t - 0.6) / 0.4) : 0;
    const blink = Math.sin(t * Math.PI * 5) > 0 ? 1 : 0.15;
    const scale = enter * (1.05 - t * 0.1);

    ctx.globalAlpha = blink * (1 - fade);
    drawCaret(ctx, x, y, h * scale, w * scale, anim.color);

    ctx.globalAlpha = blink * (1 - fade) * 0.25;
    drawCaret(ctx, x, y, h * scale * 1.15, w * scale * 4, anim.color);
  },
};

register(caretPulse);
