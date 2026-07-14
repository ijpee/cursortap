import { TWO_PI } from './stage';

/**
 * Cursor brand mark: pointy-top hexagon with downward chevron cutout
 * (isometric cube reading). Geometry traced from the official logo asset.
 */
export function drawCursorMark(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  fill: string,
): void {
  const R = size * 0.5;
  ctx.save();
  ctx.translate(x, y);

  // Pointy-top regular hex (vertex at top)
  ctx.beginPath();
  for (let i = 0; i < 6; i++) {
    const a = ((-90 + i * 60) * Math.PI) / 180;
    const px = Math.cos(a) * R;
    const py = Math.sin(a) * R;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();

  // White chevron cutout: wide top → right tip → center elbow → back
  // Matches the logo silhouette (cube faces left by the negative space).
  const tlX = -0.78 * R;
  const trX = 0.78 * R;
  const topY = -0.42 * R;
  const elbowX = 0;
  const elbowY = 0.02 * R;
  const tipX = 0.01 * R;
  const tipY = 0.88 * R;

  ctx.moveTo(tlX, topY);
  ctx.lineTo(trX, topY);
  ctx.lineTo(tipX, tipY);
  ctx.lineTo(elbowX, elbowY);
  ctx.closePath();

  ctx.fillStyle = fill;
  ctx.fill('evenodd');
  ctx.restore();
}

/** Classic mouse pointer (filled arrow). */
export function drawPointer(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  fill: string,
  stroke?: string,
): void {
  ctx.save();
  ctx.translate(x, y);
  const s = size;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(0, s);
  ctx.lineTo(s * 0.28, s * 0.72);
  ctx.lineTo(s * 0.48, s * 1.05);
  ctx.lineTo(s * 0.62, s * 0.98);
  ctx.lineTo(s * 0.42, s * 0.65);
  ctx.lineTo(s * 0.72, s * 0.65);
  ctx.closePath();
  ctx.fillStyle = fill;
  ctx.fill();
  if (stroke) {
    ctx.strokeStyle = stroke;
    ctx.lineWidth = Math.max(1.5, s * 0.06);
    ctx.stroke();
  }
  ctx.restore();
}

/** Vertical text caret bar. */
export function drawCaret(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  h: number,
  w: number,
  fill: string,
): void {
  ctx.fillStyle = fill;
  ctx.fillRect(x - w / 2, y - h / 2, w, h);
}

/** Rounded rect helper. */
export function roundRectPath(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  rad: number,
): void {
  const r = Math.min(rad, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

export function drawRing(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  lineWidth: number,
  color: string,
  alpha: number,
): void {
  if (radius < 0.5) return;
  ctx.globalAlpha = alpha;
  ctx.strokeStyle = color;
  ctx.lineWidth = lineWidth;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, TWO_PI);
  ctx.stroke();
}
