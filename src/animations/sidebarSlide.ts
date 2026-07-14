import { register } from './registry';
import { getSurface } from './palette';
import { easeInExpo, easeOutExpo, type AnimationDef } from './types';

/** Sidebar / panel slides in from the edge. */
const sidebarSlide: AnimationDef = {
  name: 'sidebarSlide',
  layer: 'background',
  life: 800,
  start({ dir, width }) {
    return {
      dir,
      panelW: width * 0.28,
    };
  },
  draw(ctx, width, height, t, anim) {
    const dir = anim.state.dir as number;
    const panelW = anim.state.panelW as number;
    const enter = easeOutExpo(Math.min(1, t * 1.6));
    const exit = t > 0.55 ? easeInExpo((t - 0.55) / 0.45) : 0;
    const amount = enter * (1 - exit);
    const w = panelW * amount;
    const x = dir < 0 ? 0 : width - w;

    ctx.globalAlpha = 0.9;
    ctx.fillStyle = anim.color;
    ctx.fillRect(x, 0, w, height);

    // inner rails
    ctx.globalAlpha = 0.35;
    ctx.fillStyle = getSurface();
    for (let i = 0; i < 5; i++) {
      const yy = height * (0.18 + i * 0.12);
      ctx.fillRect(x + 16, yy, Math.max(0, w - 32), 8);
    }
  },
};

register(sidebarSlide);
