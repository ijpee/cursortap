import { register } from './registry';
import { getPalette } from './palette';
import { getStage, scatterPoint } from './stage';
import { drawRing } from './cursorShapes';
import { easeInExpo, easeOutCubic, rand, type AnimationDef } from './types';

/** Agent / composer orb with soft rings. */
const agentOrb: AnimationDef = {
  name: 'agentOrb',
  layer: 'middleground',
  life: 1100,
  start({ width, height, dir }) {
    const p = scatterPoint(width, height, dir, 0.12);
    return {
      x: p.x,
      y: p.y,
      maxR: getStage().minDim * rand(0.18, 0.36),
      rings: Math.floor(rand(3, 5)),
    };
  },
  draw(ctx, _w, _h, t, anim) {
    const x = anim.state.x as number;
    const y = anim.state.y as number;
    const maxR = anim.state.maxR as number;
    const rings = anim.state.rings as number;
    const e = easeOutCubic(Math.min(1, t * 1.15));
    const fade = t > 0.6 ? easeInExpo((t - 0.6) / 0.4) : 0;
    const alpha = 1 - fade;
    const r = maxR * e;

    const g = ctx.createRadialGradient(x, y, 0, x, y, Math.max(1, r));
    g.addColorStop(0, anim.color);
    g.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.globalAlpha = alpha * 0.35;
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();

    for (let i = 0; i < rings; i++) {
      const rt = Math.min(1, e + i * 0.08);
      const rr = maxR * easeOutCubic(rt) * (0.35 + i * 0.22);
      drawRing(ctx, x, y, rr, 2 + (1 - t) * 3, anim.color, alpha * (1 - i * 0.2));
    }

    ctx.globalAlpha = alpha;
    ctx.fillStyle = getPalette().foreground;
    ctx.beginPath();
    ctx.arc(x, y, Math.max(2, 7 * (1 - t * 0.4)), 0, Math.PI * 2);
    ctx.fill();
  },
};

register(agentOrb);
