import { register } from './registry';
import { getStage, TWO_PI } from './stage';
import { easeOutCubic, rand, type AnimationDef } from './types';

/** Wavy squiggle path across the stage. */
const squiggle: AnimationDef = {
  name: 'squiggle',
  layer: 'middleground',
  life: 900,
  start({ dir, height }) {
    const points = Math.floor(rand(20, 36));
    const amp = height * rand(0.08, 0.2);
    const y0 = height * rand(0.3, 0.7);
    const freq = rand(2.5, 5);
    return {
      points,
      amp,
      y0,
      freq,
      dir,
      thick: getStage().minDim * rand(0.008, 0.02),
      phase: rand(0, TWO_PI),
    };
  },
  draw(ctx, width, _h, t, anim) {
    const points = anim.state.points as number;
    const amp = anim.state.amp as number;
    const y0 = anim.state.y0 as number;
    const freq = anim.state.freq as number;
    const dir = anim.state.dir as number;
    const thick = anim.state.thick as number;
    const phase = anim.state.phase as number;
    const progress = easeOutCubic(Math.min(1, t * 1.1));
    const visible = Math.floor(points * progress) + 1;
    const alpha = 1 - Math.max(0, (t - 0.7) / 0.3);

    ctx.globalAlpha = alpha;
    ctx.strokeStyle = anim.color;
    ctx.lineWidth = thick * (1 - t * 0.3);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();

    for (let i = 0; i <= visible && i <= points; i++) {
      const pct = i / points;
      const x = dir < 0 ? width * (1 - pct) : width * pct;
      const y = y0 + Math.sin(pct * freq * TWO_PI + phase) * amp;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
  },
};

register(squiggle);
