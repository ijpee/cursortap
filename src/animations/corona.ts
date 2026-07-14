import { register } from './registry';
import { getStage, scatterPoint, TWO_PI } from './stage';
import { easeOutCubic, rand, type AnimationDef } from './types';

/** Radial corona / sunburst rings. */
const corona: AnimationDef = {
  name: 'corona',
  layer: 'middleground',
  life: 950,
  start({ width, height, dir }) {
    const p = scatterPoint(width, height, dir, 0.12);
    return {
      x: p.x,
      y: p.y,
      rays: Math.floor(rand(16, 28)),
      maxR: getStage().minDim * rand(0.32, 0.6),
      rot: rand(0, TWO_PI),
    };
  },
  draw(ctx, _w, _h, t, anim) {
    const x = anim.state.x as number;
    const y = anim.state.y as number;
    const rays = anim.state.rays as number;
    const maxR = anim.state.maxR as number;
    const rot = anim.state.rot as number;
    const e = easeOutCubic(t);
    const r = maxR * e;
    const alpha = 1 - t;
    if (r < 0.5 || alpha < 0.01) return;

    ctx.globalAlpha = alpha * 0.9;
    ctx.strokeStyle = anim.color;
    ctx.fillStyle = anim.color;

    ctx.lineWidth = 3 + (1 - t) * 6;
    ctx.beginPath();
    ctx.arc(x, y, Math.max(0.5, r * 0.35), 0, TWO_PI);
    ctx.stroke();

    ctx.lineWidth = 2;
    for (let i = 0; i < rays; i++) {
      const a = rot + (i / rays) * TWO_PI;
      const inner = r * 0.4;
      const outer = r * (0.85 + 0.15 * Math.sin(i * 1.7));
      ctx.globalAlpha = alpha * (0.5 + 0.5 * ((i % 3) / 3));
      ctx.beginPath();
      ctx.moveTo(x + Math.cos(a) * inner, y + Math.sin(a) * inner);
      ctx.lineTo(x + Math.cos(a) * outer, y + Math.sin(a) * outer);
      ctx.stroke();
    }

    ctx.globalAlpha = alpha;
    ctx.beginPath();
    ctx.arc(x, y, 8 * (1 - t * 0.5), 0, TWO_PI);
    ctx.fill();
  },
};

register(corona);
