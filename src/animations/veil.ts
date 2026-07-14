import { register } from './registry';
import { easeInExpo, easeOutExpo, type AnimationDef } from './types';

/** Half-plane veil slides over then retreats. */
const veil: AnimationDef = {
  name: 'veil',
  layer: 'background',
  life: 750,
  start({ dir, height }) {
    const vertical = Math.random() > 0.5;
    return {
      vertical: vertical ? 1 : 0,
      dir,
      size: vertical ? height : 0,
    };
  },
  draw(ctx, width, height, t, anim) {
    const vertical = anim.state.vertical === 1;
    const dir = anim.state.dir as number;
    const enter = easeOutExpo(Math.min(1, t * 2));
    const exit = t > 0.5 ? easeInExpo((t - 0.5) * 2) : 0;
    const cover = enter * (1 - exit);

    ctx.globalAlpha = 0.85;
    ctx.fillStyle = anim.color;

    if (vertical) {
      const h = height * cover;
      const y = dir < 0 ? 0 : height - h;
      ctx.fillRect(0, y, width, h);
    } else {
      const w = width * cover;
      const x = dir < 0 ? 0 : width - w;
      ctx.fillRect(x, 0, w, height);
    }
  },
};

register(veil);
