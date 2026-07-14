import { tickAnimations } from '../animations';

export function startRenderLoop(
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
): void {
  function frame(now: number): void {
    try {
      if (canvas.width > 0 && canvas.height > 0) {
        tickAnimations(ctx, canvas.width, canvas.height, now);
      }
    } catch (err) {
      console.error('[cursortap] frame error', err);
    }
    requestAnimationFrame(frame);
  }

  requestAnimationFrame(frame);
}
