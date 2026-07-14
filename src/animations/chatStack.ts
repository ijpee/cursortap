import { register } from './registry';
import { getSurface } from './palette';
import { getStage, scatterPoint } from './stage';
import { roundRectPath } from './cursorShapes';
import { easeInExpo, easeOutExpo, rand, type AnimationDef } from './types';

/** Chat bubbles stack up — Agents window energy. */
const chatStack: AnimationDef = {
  name: 'chatStack',
  layer: 'foreground',
  life: 1000,
  start({ width, height, dir }) {
    const p = scatterPoint(width, height, dir, 0.12);
    const count = Math.floor(rand(3, 5));
    const ws: number[] = [];
    const hs: number[] = [];
    for (let i = 0; i < count; i++) {
      ws.push(getStage().minDim * rand(0.16, 0.3));
      hs.push(getStage().minDim * rand(0.055, 0.095));
    }
    return { count, baseX: p.x, baseY: p.y, ws, hs, dir };
  },
  draw(ctx, _w, _h, t, anim) {
    const count = anim.state.count as number;
    const baseX = anim.state.baseX as number;
    const baseY = anim.state.baseY as number;
    const ws = anim.state.ws as number[];
    const hs = anim.state.hs as number[];
    const dir = anim.state.dir as number;
    const fade = t > 0.65 ? easeInExpo((t - 0.65) / 0.35) : 0;

    for (let i = 0; i < count; i++) {
      const stagger = i * 0.12;
      const local = Math.max(0, Math.min(1, (t - stagger) / 0.4));
      const e = easeOutExpo(local);
      if (e <= 0) continue;
      const w = ws[i];
      const h = hs[i];
      const x = baseX - w / 2 + dir * (1 - e) * 60;
      const y = baseY - i * (h + 14) - (1 - e) * 40;
      ctx.globalAlpha = e * (1 - fade) * (0.55 + i * 0.12);
      ctx.fillStyle = anim.color;
      roundRectPath(ctx, x, y, w * e, h, 12);
      ctx.fill();

      ctx.globalAlpha = e * (1 - fade) * 0.35;
      ctx.fillStyle = getSurface();
      const lineW = w * e * 0.55;
      ctx.fillRect(x + 14, y + h * 0.35, lineW, 3);
      ctx.fillRect(x + 14, y + h * 0.58, lineW * 0.65, 3);
    }
  },
};

register(chatStack);
