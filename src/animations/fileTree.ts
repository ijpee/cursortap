import { register } from './registry';
import { getStage } from './stage';
import { easeInExpo, easeOutCubic, rand, type AnimationDef } from './types';

/** File-tree zigzag path with varied angles each hit. */
const fileTree: AnimationDef = {
  name: 'fileTree',
  layer: 'middleground',
  life: 950,
  start({ width, height, dir }) {
    const nodes = Math.floor(rand(5, 9));
    const xs: number[] = [];
    const ys: number[] = [];

    // Start near an edge, then wander with irregular angles
    const edge = Math.floor(Math.random() * 4);
    let x: number;
    let y: number;
    if (edge === 0) {
      x = width * rand(0.15, 0.85);
      y = height * rand(0.08, 0.2);
    } else if (edge === 1) {
      x = width * rand(0.15, 0.85);
      y = height * rand(0.8, 0.92);
    } else if (edge === 2) {
      x = width * rand(0.06, 0.18);
      y = height * rand(0.2, 0.8);
    } else {
      x = width * rand(0.82, 0.94);
      y = height * rand(0.2, 0.8);
    }

    // Initial heading biased toward stage center, then drift
    let angle = Math.atan2(height / 2 - y, width / 2 - x);
    angle += rand(-0.7, 0.7);

    const step = getStage().minDim * rand(0.1, 0.16);
    xs.push(x);
    ys.push(y);

    for (let i = 1; i < nodes; i++) {
      // Strong turn each segment — more varied angles than a regular zigzag
      angle += rand(-1.1, 1.1) + dir * rand(-0.25, 0.25);
      const len = step * rand(0.7, 1.35);
      x += Math.cos(angle) * len;
      y += Math.sin(angle) * len;
      // Soft keep-on-stage nudge
      x = Math.max(width * 0.05, Math.min(width * 0.95, x));
      y = Math.max(height * 0.08, Math.min(height * 0.92, y));
      xs.push(x);
      ys.push(y);
    }
    return { nodes, xs, ys, r: getStage().minDim * 0.012 };
  },
  draw(ctx, _w, _h, t, anim) {
    const nodes = anim.state.nodes as number;
    const xs = anim.state.xs as number[];
    const ys = anim.state.ys as number[];
    const r = anim.state.r as number;
    const progress = easeOutCubic(Math.min(1, t * 1.2));
    const visible = Math.floor((nodes - 1) * progress) + 1;
    const fade = t > 0.7 ? easeInExpo((t - 0.7) / 0.3) : 0;
    const alpha = 1 - fade;

    ctx.strokeStyle = anim.color;
    ctx.fillStyle = anim.color;
    ctx.lineWidth = Math.max(2, r);
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.globalAlpha = alpha;

    ctx.beginPath();
    for (let i = 0; i <= visible && i < nodes; i++) {
      if (i === 0) ctx.moveTo(xs[i], ys[i]);
      else ctx.lineTo(xs[i], ys[i]);
    }
    ctx.stroke();

    for (let i = 0; i <= visible && i < nodes; i++) {
      ctx.beginPath();
      ctx.arc(xs[i], ys[i], r * 1.6, 0, Math.PI * 2);
      ctx.fill();
    }
  },
};

register(fileTree);
