import { register } from './registry';
import { randomEdgePoint, TWO_PI } from './stage';
import { easeInCirc, lerp, rand, type AnimationDef } from './types';

/** Soft closed curve that collapses toward an impact point. */
const clay: AnimationDef = {
  name: 'clay',
  layer: 'middleground',
  life: 900,
  start({ width, height }) {
    const amount = Math.floor(rand(10, 18));
    const edge = randomEdgePoint();
    const impactX = width * rand(0.25, 0.75);
    const impactY = height * rand(0.25, 0.75);
    const distance = Math.max(width, height) * 0.9;
    const pts: number[] = [];
    const dests: number[] = [];

    for (let i = 0; i < amount; i++) {
      const pct = i / amount;
      const ptheta = pct * TWO_PI;
      const ox = distance * Math.cos(ptheta);
      const oy = distance * Math.sin(ptheta);
      pts.push(ox, oy);

      const dx = impactX - (edge.x + ox);
      const dy = impactY - (edge.y + oy);
      const d = Math.sqrt(dx * dx + dy * dy) || 1;
      const a = (12 * distance) / Math.sqrt(d);
      const theta = Math.atan2(dy, dx) - ptheta;
      dests.push(a * Math.cos(theta) + ox, a * Math.sin(theta) + oy);
    }

    return {
      ox: edge.x,
      oy: edge.y,
      n: amount,
      pts,
      dests,
    };
  },
  draw(ctx, _w, _h, t, anim) {
    const n = anim.state.n as number;
    const pts = anim.state.pts as number[];
    const dests = anim.state.dests as number[];
    const ox = anim.state.ox as number;
    const oy = anim.state.oy as number;
    const ending = easeInCirc(Math.min(1, t * 1.15));
    const alpha = 1 - Math.max(0, (t - 0.7) / 0.3);

    ctx.globalAlpha = alpha;
    ctx.fillStyle = anim.color;
    ctx.beginPath();
    for (let i = 0; i < n; i++) {
      const x = lerp(pts[i * 2], dests[i * 2], ending) + ox;
      const y = lerp(pts[i * 2 + 1], dests[i * 2 + 1], ending) + oy;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fill();
  },
};

register(clay);
