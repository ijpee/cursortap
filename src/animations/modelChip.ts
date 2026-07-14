import { register } from './registry';
import { getSurface } from './palette';
import { getStage, scatterPoint } from './stage';
import { roundRectPath } from './cursorShapes';
import { easeInExpo, easeOutExpo, rand, type AnimationDef } from './types';

const CHIPS = ['Auto', 'Agent', 'Tab', 'Cmd+K', 'Composer', 'Review', 'Bugbot'];

/** Model / feature chip pops in. */
const modelChip: AnimationDef = {
  name: 'modelChip',
  layer: 'foreground',
  life: 900,
  start({ width, height, dir }) {
    const label = CHIPS[Math.floor(Math.random() * CHIPS.length)];
    const p = scatterPoint(width, height, dir, 0.12);
    return {
      label,
      x: p.x,
      y: p.y,
      h: getStage().minDim * rand(0.055, 0.08),
    };
  },
  draw(ctx, _w, _h, t, anim) {
    const label = anim.state.label as string;
    const x = anim.state.x as number;
    const y = anim.state.y as number;
    const h = anim.state.h as number;
    const enter = easeOutExpo(Math.min(1, t * 2));
    const fade = t > 0.6 ? easeInExpo((t - 0.6) / 0.4) : 0;
    const scale = enter * (1 + 0.06 * Math.sin(Math.min(1, t * 5) * Math.PI));

    ctx.font = `600 ${h * 0.45}px "Berkeley Mono", ui-monospace, Menlo, monospace`;
    const textW = ctx.measureText(label).width;
    const w = textW + h * 1.1;
    const dx = x - (w * scale) / 2;
    const dy = y - (h * scale) / 2;

    ctx.globalAlpha = (1 - fade) * 0.95;
    ctx.fillStyle = anim.color;
    roundRectPath(ctx, dx, dy, w * scale, h * scale, h * 0.45);
    ctx.fill();

    ctx.globalAlpha = 1 - fade;
    ctx.fillStyle = getSurface();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(label, x, y);
  },
};

register(modelChip);
