import {
  particles,
  pulse,
  setParticles,
  setPulse,
} from './particles';

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

export function startRenderLoop(
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
): void {
  function frame(now: number): void {
    ctx.fillStyle = 'rgba(20, 18, 11, 0.18)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    let currentPulse = pulse;
    if (currentPulse > 0.01) {
      const g = ctx.createRadialGradient(
        canvas.width / 2,
        canvas.height / 2,
        0,
        canvas.width / 2,
        canvas.height / 2,
        canvas.width * 0.6,
      );
      g.addColorStop(0, `rgba(255,108,55,${0.06 * currentPulse})`);
      g.addColorStop(1, 'rgba(255,108,55,0)');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      currentPulse *= 0.9;
      setPulse(currentPulse);
    }

    const alive = particles.filter((p) => now - p.born < p.life);
    setParticles(alive);

    for (const p of alive) {
      const t = (now - p.born) / p.life;
      const r = p.r + (p.maxR - p.r) * easeOutCubic(t);
      const dt = (now - p.born) / 1000;
      const x = p.x + p.vx * dt;
      const y = p.y + p.vy * dt;
      ctx.save();
      ctx.globalAlpha = 1 - t;
      ctx.fillStyle = p.color;
      ctx.translate(x, y);
      ctx.rotate(p.rot * t);
      p.shapeFn(0, 0, r, ctx);
      ctx.restore();
    }

    requestAnimationFrame(frame);
  }

  requestAnimationFrame(frame);
}
