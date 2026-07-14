import { register } from './registry';
import { easeOutCubic, type AnimationDef } from './types';

/** Palette-changing background hit (Patatap "change"). */
const change: AnimationDef = {
  name: 'change',
  layer: 'background',
  life: 350,
  palette: 'flash',
  start() {
    return {};
  },
  draw(ctx, width, height, t, anim) {
    const alpha = (1 - easeOutCubic(t)) * 0.55;
    ctx.globalAlpha = alpha;
    ctx.fillStyle = anim.color;
    ctx.fillRect(0, 0, width, height);
  },
};

register(change);
