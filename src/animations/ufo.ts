import { register } from './registry';
import { getStage, TWO_PI } from './stage';
import { easeInExpo, easeOutExpo, rand, type AnimationDef } from './types';

/** Flying saucer disc that drifts and blinks a beam. */
const ufo: AnimationDef = {
  name: 'ufo',
  layer: 'foreground',
  life: 950,
  start({ dir, width, height }) {
    return {
      y: height * rand(0.2, 0.55),
      dir,
      rx: getStage().minDim * rand(0.12, 0.2),
      ry: getStage().minDim * rand(0.035, 0.055),
      startX: dir < 0 ? width + 80 : -80,
    };
  },
  draw(ctx, width, _h, t, anim) {
    const y = anim.state.y as number;
    const dir = anim.state.dir as number;
    const rx = anim.state.rx as number;
    const ry = anim.state.ry as number;
    const startX = anim.state.startX as number;
    const travel = easeOutExpo(Math.min(1, t * 1.2));
    const fade = t > 0.7 ? easeInExpo((t - 0.7) / 0.3) : 0;
    const x = startX + dir * (width + 160) * travel;
    const alpha = 1 - fade;

    ctx.globalAlpha = alpha * 0.35;
    ctx.fillStyle = anim.color;
    // beam
    ctx.beginPath();
    ctx.moveTo(x - rx * 0.4, y + ry);
    ctx.lineTo(x + rx * 0.4, y + ry);
    ctx.lineTo(x + rx * 1.2, y + ry * 8);
    ctx.lineTo(x - rx * 1.2, y + ry * 8);
    ctx.closePath();
    ctx.fill();

    ctx.globalAlpha = alpha;
    ctx.beginPath();
    ctx.ellipse(x, y, rx, ry, 0, 0, TWO_PI);
    ctx.fill();

    ctx.beginPath();
    ctx.ellipse(x, y - ry * 0.6, rx * 0.45, ry * 0.9, 0, 0, TWO_PI);
    ctx.fill();
  },
};

register(ufo);
