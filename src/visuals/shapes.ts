export type ShapeFn = (
  x: number,
  y: number,
  r: number,
  ctx: CanvasRenderingContext2D,
) => void;

export const shapes: ShapeFn[] = [
  (x, y, r, ctx) => {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  },
  (x, y, r, ctx) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(Math.PI / 4);
    ctx.fillRect(-r * 0.8, -r * 0.8, r * 1.6, r * 1.6);
    ctx.restore();
  },
  (x, y, r, ctx) => {
    ctx.beginPath();
    ctx.moveTo(x, y - r);
    ctx.lineTo(x + r * 0.87, y + r * 0.5);
    ctx.lineTo(x - r * 0.87, y + r * 0.5);
    ctx.closePath();
    ctx.fill();
  },
  (x, y, r, ctx) => {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.lineWidth = r * 0.22;
    ctx.strokeStyle = ctx.fillStyle as string;
    ctx.stroke();
  },
  (x, y, r, ctx) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(r / 26, r / 26);
    ctx.beginPath();
    ctx.moveTo(-9, -13);
    ctx.lineTo(-9, 12);
    ctx.lineTo(-2, 6);
    ctx.lineTo(2, 14);
    ctx.lineTo(6, 12);
    ctx.lineTo(2, 4);
    ctx.lineTo(10, 4);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  },
  (x, y, r, ctx) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.fillRect(-r * 0.22, -r, r * 0.44, r * 2);
    ctx.fillRect(-r, -r * 0.22, r * 2, r * 0.44);
    ctx.restore();
  },
];
