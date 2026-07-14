import { register } from './registry';
import { getStage, TWO_PI } from './stage';
import { easeOutCubic, rand, type AnimationDef } from './types';

/** Expanding Archimedean spiral. */
const spiral: AnimationDef = {
  name: 'spiral',
  layer: 'middleground',
  life: 1100,
  start({ dir, width, height }) {
    return {
      x: width * rand(0.35, 0.65),
      y: height * rand(0.35, 0.65),
      turns: rand(2.5, 4.5),
      maxR: getStage().minDim * rand(0.3, 0.5),
      dir,
      thick: rand(3, 8),
    };
  },
  draw(ctx, _w, _h, t, anim) {
    const x = anim.state.x as number;
    const y = anim.state.y as number;
    const turns = anim.state.turns as number;
    const maxR = anim.state.maxR as number;
    const dir = anim.state.dir as number;
    const thick = anim.state.thick as number;
    const e = easeOutCubic(t);
    const steps = Math.floor(80 * e) + 2;
    const alpha = 1 - Math.pow(t, 1.3);

    ctx.globalAlpha = alpha;
    ctx.strokeStyle = anim.color;
    ctx.lineWidth = thick * (1 - t * 0.5);
    ctx.lineCap = 'round';
    ctx.beginPath();

    for (let i = 0; i <= steps; i++) {
      const pct = i / 80;
      const a = dir * pct * turns * TWO_PI;
      const r = maxR * pct;
      const px = x + Math.cos(a) * r;
      const py = y + Math.sin(a) * r;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();
  },
};

register(spiral);
