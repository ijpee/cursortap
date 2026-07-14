import { register } from './registry';
import { getSurface } from './palette';
import { getStage, scatterY } from './stage';
import { roundRectPath } from './cursorShapes';
import { easeInExpo, easeOutExpo, rand, type AnimationDef } from './types';

/** ⌘K-style command palette bar slides into center. */
const cmdPalette: AnimationDef = {
  name: 'cmdPalette',
  layer: 'middleground',
  life: 950,
  start({ width, height }) {
    return {
      w: Math.min(width * rand(0.48, 0.7), getStage().minDim * 0.95),
      h: getStage().minDim * rand(0.08, 0.11),
      y: scatterY(height, 0.22),
      xJitter: width * rand(-0.12, 0.12),
      rows: Math.floor(rand(2, 4)),
    };
  },
  draw(ctx, width, _h, t, anim) {
    const w = anim.state.w as number;
    const h = anim.state.h as number;
    const y = anim.state.y as number;
    const xJitter = anim.state.xJitter as number;
    const rows = anim.state.rows as number;
    const enter = easeOutExpo(Math.min(1, t * 1.8));
    const fade = t > 0.6 ? easeInExpo((t - 0.6) / 0.4) : 0;
    const x = (width - w) / 2 + xJitter;
    const scaleY = 0.7 + 0.3 * enter;
    const alpha = 1 - fade;

    ctx.globalAlpha = alpha * 0.95;
    ctx.fillStyle = anim.color;
    roundRectPath(ctx, x, y, w, h * scaleY, 14);
    ctx.fill();

    ctx.globalAlpha = alpha * (Math.sin(t * 20) > 0 ? 0.9 : 0.2);
    ctx.fillStyle = getSurface();
    ctx.fillRect(x + 28, y + h * scaleY * 0.28, 3, h * scaleY * 0.44);

    for (let i = 0; i < rows; i++) {
      const stagger = 0.15 + i * 0.08;
      const local = Math.max(0, Math.min(1, (t - stagger) / 0.35));
      const e = easeOutExpo(local);
      const rw = w * 0.92 * e;
      const rh = h * 0.7;
      const rx = x + (w - rw) / 2;
      const ry = y + h * scaleY + 12 + i * (rh + 8);
      ctx.globalAlpha = e * alpha * 0.55;
      ctx.fillStyle = anim.color;
      roundRectPath(ctx, rx, ry, rw, rh, 10);
      ctx.fill();
    }
  },
};

register(cmdPalette);
