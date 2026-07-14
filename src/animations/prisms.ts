import { register } from './registry';
import { getStage, TWO_PI } from './stage';
import { easeOutCubic, rand, type AnimationDef } from './types';

/** Expanding triangular prism shards from center. */
const prisms: AnimationDef = {
  name: 'prisms',
  layer: 'middleground',
  life: 850,
  start() {
    const count = Math.floor(rand(6, 12));
    const angles: number[] = [];
    const sizes: number[] = [];
    for (let i = 0; i < count; i++) {
      angles.push((i / count) * TWO_PI + rand(-0.15, 0.15));
      sizes.push(rand(0.08, 0.18));
    }
    return {
      count,
      angles,
      sizes,
      dist: getStage().minDim * rand(0.25, 0.45),
    };
  },
  draw(ctx, width, height, t, anim) {
    const count = anim.state.count as number;
    const angles = anim.state.angles as number[];
    const sizes = anim.state.sizes as number[];
    const dist = anim.state.dist as number;
    const e = easeOutCubic(t);
    const alpha = 1 - t;
    const cx = width / 2;
    const cy = height / 2;
    const minDim = Math.min(width, height);

    ctx.globalAlpha = alpha;
    ctx.fillStyle = anim.color;
    for (let i = 0; i < count; i++) {
      const a = angles[i];
      const d = dist * e;
      const px = cx + Math.cos(a) * d;
      const py = cy + Math.sin(a) * d;
      const s = sizes[i] * minDim * (0.6 + 0.4 * (1 - t));
      const perp = a + Math.PI / 2;

      ctx.beginPath();
      ctx.moveTo(px + Math.cos(a) * s, py + Math.sin(a) * s);
      ctx.lineTo(
        px + Math.cos(perp) * s * 0.45,
        py + Math.sin(perp) * s * 0.45,
      );
      ctx.lineTo(
        px - Math.cos(perp) * s * 0.45,
        py - Math.sin(perp) * s * 0.45,
      );
      ctx.closePath();
      ctx.fill();
    }
  },
};

register(prisms);
