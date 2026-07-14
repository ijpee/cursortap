import { register } from './registry';
import { getSurface } from './palette';
import { getStage, scatterPoint } from './stage';
import { drawPointer } from './cursorShapes';
import { easeInExpo, easeOutCubic, easeOutExpo, rand, type AnimationDef } from './types';

/** Pointer flies in, "clicks", ripple expands. */
const pointerClick: AnimationDef = {
  name: 'pointerClick',
  layer: 'foreground',
  life: 850,
  start({ width, height, dir }) {
    const p = scatterPoint(width, height, dir, 0.14);
    return {
      x: p.x,
      y: p.y,
      size: getStage().minDim * rand(0.08, 0.14),
      dir,
      fromX: dir < 0 ? width * rand(0.02, 0.25) : width * rand(0.75, 0.98),
      fromY: height * rand(0.05, 0.9),
    };
  },
  draw(ctx, _w, _h, t, anim) {
    const x = anim.state.x as number;
    const y = anim.state.y as number;
    const size = anim.state.size as number;
    const fromX = anim.state.fromX as number;
    const fromY = anim.state.fromY as number;
    const arrive = easeOutExpo(Math.min(1, t * 2.2));
    const fade = t > 0.7 ? easeInExpo((t - 0.7) / 0.3) : 0;
    const px = fromX + (x - fromX) * arrive;
    const py = fromY + (y - fromY) * arrive;

    const click = t > 0.35 && t < 0.55 ? 1 - Math.sin(((t - 0.35) / 0.2) * Math.PI) * 0.15 : 1;

    if (t > 0.35) {
      const rt = easeOutCubic(Math.min(1, (t - 0.35) / 0.55));
      const rr = size * 4.5 * rt;
      ctx.globalAlpha = (1 - rt) * (1 - fade) * 0.7;
      ctx.strokeStyle = anim.color;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(x, y, Math.max(0.5, rr), 0, Math.PI * 2);
      ctx.stroke();
      ctx.globalAlpha = (1 - rt) * (1 - fade) * 0.25;
      ctx.beginPath();
      ctx.arc(x, y, Math.max(0.5, rr * 0.55), 0, Math.PI * 2);
      ctx.stroke();
    }

    ctx.globalAlpha = 1 - fade;
    drawPointer(ctx, px, py, size * click, anim.color, getSurface());
  },
};

register(pointerClick);
