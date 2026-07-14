import { register } from './registry';
import { easeInExpo, easeOutExpo, type AnimationDef } from './types';

/** Full-height rectangle sweeps across the stage. */
const wipe: AnimationDef = {
  name: 'wipe',
  layer: 'background',
  life: 700,
  start({ dir, width, height }) {
    const fromLeft = dir < 0 || Math.random() > 0.5;
    return {
      fromLeft: fromLeft ? 1 : 0,
      w: width,
      h: height,
    };
  },
  draw(ctx, width, height, t, anim) {
    const fromLeft = anim.state.fromLeft === 1;
    const travel = easeOutExpo(Math.min(1, t * 1.4));
    const fade = t > 0.55 ? easeInExpo((t - 0.55) / 0.45) : 0;
    const x = fromLeft
      ? -width * 0.5 + travel * width * 1.5
      : width * 1.5 - travel * width * 1.5;

    ctx.globalAlpha = 1 - fade;
    ctx.fillStyle = anim.color;
    ctx.fillRect(x - width * 0.5, 0, width, height);
  },
};

register(wipe);
