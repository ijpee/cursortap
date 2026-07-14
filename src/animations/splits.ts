import { register } from './registry';
import { easeInExpo, easeOutExpo, type AnimationDef } from './types';

/** Screen splits open along a random axis. */
const splits: AnimationDef = {
  name: 'splits',
  layer: 'background',
  life: 650,
  start({ width, height }) {
    const horizontal = Math.random() > 0.5;
    return {
      horizontal: horizontal ? 1 : 0,
      gap: horizontal ? height : width,
    };
  },
  draw(ctx, width, height, t, anim) {
    const horizontal = anim.state.horizontal === 1;
    const open = easeOutExpo(Math.min(1, t * 1.5));
    const close = t > 0.5 ? easeInExpo((t - 0.5) * 2) : 0;
    const amount = open * (1 - close * 0.85);
    const alpha = 1 - Math.max(0, (t - 0.8) / 0.2);

    ctx.globalAlpha = alpha;
    ctx.fillStyle = anim.color;

    if (horizontal) {
      const g = (height * 0.5) * amount;
      ctx.fillRect(0, 0, width, height * 0.5 - g);
      ctx.fillRect(0, height * 0.5 + g, width, height * 0.5 - g);
    } else {
      const g = (width * 0.5) * amount;
      ctx.fillRect(0, 0, width * 0.5 - g, height);
      ctx.fillRect(width * 0.5 + g, 0, width * 0.5 - g, height);
    }
  },
};

register(splits);
