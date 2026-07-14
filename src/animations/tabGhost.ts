import { register } from './registry';
import { getStage, scatterY } from './stage';
import { easeInExpo, easeOutExpo, rand, type AnimationDef } from './types';

const GHOSTS = [
  'compose…',
  'apply_diff',
  'tab_accept',
  'generate()',
  'refactor',
  'fix_bug',
  'await agent',
  '⌘K ask',
];

/** Ghost Tab-completion text drifts across. */
const tabGhost: AnimationDef = {
  name: 'tabGhost',
  layer: 'middleground',
  life: 1000,
  start({ width, height, dir }) {
    const text = GHOSTS[Math.floor(Math.random() * GHOSTS.length)];
    return {
      text,
      y: scatterY(height, 0.12),
      size: getStage().minDim * rand(0.04, 0.08),
      dir,
      startX: dir < 0 ? width * rand(0.7, 0.95) : width * rand(0.05, 0.3),
      travel: width * rand(0.3, 0.65),
    };
  },
  draw(ctx, _w, _h, t, anim) {
    const text = anim.state.text as string;
    const y = anim.state.y as number;
    const size = anim.state.size as number;
    const dir = anim.state.dir as number;
    const startX = anim.state.startX as number;
    const travel = anim.state.travel as number;
    const e = easeOutExpo(Math.min(1, t * 1.15));
    const fade = t > 0.55 ? easeInExpo((t - 0.55) / 0.45) : 0;
    const x = startX + dir * travel * e;
    const yy = y - 30 * e;

    ctx.font = `500 ${size}px "Berkeley Mono", ui-monospace, Menlo, monospace`;
    ctx.textAlign = dir < 0 ? 'right' : 'left';
    ctx.textBaseline = 'middle';
    ctx.globalAlpha = (1 - fade) * 0.85;
    ctx.fillStyle = anim.color;
    ctx.fillText(text, x, yy);

    ctx.globalAlpha = (1 - fade) * 0.25;
    ctx.fillText(text, x - dir * size * 0.4, yy + size * 0.15);
  },
};

register(tabGhost);
