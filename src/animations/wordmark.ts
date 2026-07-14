import { register } from './registry';
import { getStage, scatterY } from './stage';
import { easeInExpo, easeOutExpo, rand, type AnimationDef } from './types';

const LETTERS = 'CURSOR'.split('');

/** CURSOR wordmark letters stagger in across the stage. */
const wordmark: AnimationDef = {
  name: 'wordmark',
  layer: 'foreground',
  life: 1100,
  start({ width, height, dir }) {
    return {
      y: scatterY(height, 0.2),
      size: getStage().minDim * rand(0.08, 0.15),
      dir,
      spread: width * rand(0.45, 0.85),
      xShift: width * rand(-0.15, 0.15),
    };
  },
  draw(ctx, width, _h, t, anim) {
    const y = anim.state.y as number;
    const size = anim.state.size as number;
    const dir = anim.state.dir as number;
    const spread = anim.state.spread as number;
    const xShift = anim.state.xShift as number;
    const fade = t > 0.65 ? easeInExpo((t - 0.65) / 0.35) : 0;
    const cx = width / 2 + xShift;

    ctx.font = `700 ${size}px "Berkeley Mono", ui-monospace, Menlo, monospace`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = anim.color;

    for (let i = 0; i < LETTERS.length; i++) {
      const stagger = i / LETTERS.length;
      const local = Math.max(0, Math.min(1, (t - stagger * 0.25) / 0.45));
      const e = easeOutExpo(local);
      const x =
        cx +
        (i - (LETTERS.length - 1) / 2) * (spread / LETTERS.length) * e +
        dir * (1 - e) * 80;
      const yy = y + (1 - e) * 40;
      ctx.globalAlpha = e * (1 - fade);
      ctx.fillText(LETTERS[i], x, yy);
    }
  },
};

register(wordmark);
