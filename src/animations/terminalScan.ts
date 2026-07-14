import { register } from './registry';
import { easeInExpo, easeOutExpo, rand, type AnimationDef } from './types';

/** Terminal scanline sweep — fixed composition, not scattered. */
const terminalScan: AnimationDef = {
  name: 'terminalScan',
  layer: 'background',
  life: 750,
  start({ dir, height }) {
    return {
      dir,
      lines: Math.floor(rand(6, 12)),
      gap: height / rand(10, 16),
    };
  },
  draw(ctx, width, height, t, anim) {
    const dir = anim.state.dir as number;
    const lines = anim.state.lines as number;
    const gap = anim.state.gap as number;
    const travel = easeOutExpo(Math.min(1, t * 1.3));
    const fade = t > 0.55 ? easeInExpo((t - 0.55) / 0.45) : 0;
    const alpha = 1 - fade;

    ctx.fillStyle = anim.color;
    for (let i = 0; i < lines; i++) {
      const y = (height * 0.1 + i * gap + travel * height * 0.15) % height;
      const w = width * (0.4 + 0.6 * travel);
      const x = dir < 0 ? width - w : 0;
      ctx.globalAlpha = alpha * (0.25 + (i % 3) * 0.15);
      ctx.fillRect(x, y, w, Math.max(2, gap * 0.35));
    }

    ctx.globalAlpha = alpha * 0.9;
    const edgeX = dir < 0 ? width * (1 - travel) : width * travel;
    ctx.fillRect(edgeX - 3, 0, 6, height);
  },
};

register(terminalScan);
