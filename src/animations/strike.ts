import { register } from './registry';
import { getStage, scatterY } from './stage';
import { easeOutCubic, rand, type AnimationDef } from './types';

/** Sharp diagonal strike / slash across the stage. */
const strike: AnimationDef = {
  name: 'strike',
  layer: 'foreground',
  life: 500,
  start({ dir, height }) {
    return {
      dir,
      thick: getStage().minDim * rand(0.02, 0.06),
      angle: dir * rand(0.15, 0.85),
      y: scatterY(height, 0.1),
    };
  },
  draw(ctx, width, height, t, anim) {
    const dir = anim.state.dir as number;
    const thick = anim.state.thick as number;
    const angle = anim.state.angle as number;
    const y = anim.state.y as number;
    const e = easeOutCubic(Math.min(1, t * 1.8));
    const fade = Math.max(0, (t - 0.4) / 0.6);
    const len = Math.hypot(width, height) * 1.2;
    const x0 = dir < 0 ? width + 40 : -40;
    const travel = e * (width + 80);

    ctx.save();
    ctx.globalAlpha = 1 - fade;
    ctx.translate(x0 + dir * travel, y);
    ctx.rotate(angle);
    ctx.fillStyle = anim.color;
    ctx.fillRect(-len * 0.1, -thick / 2, len * e, thick);
    ctx.restore();
  },
};

register(strike);
