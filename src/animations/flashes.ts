import { register } from './registry';
import { easeOutCubic, type AnimationDef } from './types';

/** Full-screen color flash / strobe. */
const flashes: AnimationDef = {
  name: 'flashes',
  layer: 'background',
  life: 400,
  palette: 'flash',
  start() {
    return { pulses: 3 };
  },
  draw(ctx, width, height, t, anim) {
    const pulses = anim.state.pulses as number;
    const wave = Math.abs(Math.sin(t * Math.PI * pulses));
    const alpha = wave * (1 - easeOutCubic(t)) * 0.9;
    ctx.globalAlpha = alpha;
    ctx.fillStyle = anim.color;
    ctx.fillRect(0, 0, width, height);
  },
};

register(flashes);
