import { register } from './registry';
import { easeOutCubic, rand, type AnimationDef } from './types';

/** Horizontal zigzag polyline racing across. */
const zigzag: AnimationDef = {
  name: 'zigzag',
  layer: 'middleground',
  life: 800,
  start({ dir, height }) {
    const segments = Math.floor(rand(8, 14));
    const amp = height * rand(0.12, 0.28);
    const y0 = height * rand(0.25, 0.75);
    return {
      segments,
      amp,
      y0,
      dir,
      thick: rand(4, 14),
    };
  },
  draw(ctx, width, _h, t, anim) {
    const segments = anim.state.segments as number;
    const amp = anim.state.amp as number;
    const y0 = anim.state.y0 as number;
    const dir = anim.state.dir as number;
    const thick = anim.state.thick as number;
    const progress = easeOutCubic(Math.min(1, t * 1.15));
    const visible = Math.floor(segments * progress) + 1;
    const alpha = 1 - Math.max(0, (t - 0.65) / 0.35);

    ctx.globalAlpha = alpha;
    ctx.strokeStyle = anim.color;
    ctx.lineWidth = thick * (1 - t * 0.4);
    ctx.lineJoin = 'miter';
    ctx.beginPath();

    for (let i = 0; i <= visible && i <= segments; i++) {
      const pct = i / segments;
      const x =
        dir < 0
          ? width * (1 - pct * progress)
          : width * pct * progress;
      const y = y0 + ((i % 2 === 0 ? -1 : 1) * amp);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
  },
};

register(zigzag);
