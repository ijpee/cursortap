/** Shared stage geometry — mirrors Patatap center / edge-spawn helpers. */

export interface Stage {
  width: number;
  height: number;
  cx: number;
  cy: number;
  minDim: number;
}

let stage: Stage = {
  width: 1,
  height: 1,
  cx: 0.5,
  cy: 0.5,
  minDim: 1,
};

export type EdgeOrigin =
  | 'n'
  | 'ne'
  | 'e'
  | 'se'
  | 's'
  | 'sw'
  | 'w'
  | 'nw'
  | 'center';

const EDGE_LIST: EdgeOrigin[] = [
  'n',
  'ne',
  'e',
  'se',
  's',
  'sw',
  'w',
  'nw',
];

export function resizeStage(width: number, height: number): void {
  stage = {
    width,
    height,
    cx: width / 2,
    cy: height / 2,
    minDim: Math.min(width, height),
  };
}

export function getStage(): Stage {
  return stage;
}

export function edgePoint(origin: EdgeOrigin): { x: number; y: number } {
  const { width, height, cx, cy } = stage;
  switch (origin) {
    case 'n':
      return { x: cx, y: 0 };
    case 'ne':
      return { x: width, y: 0 };
    case 'e':
      return { x: width, y: cy };
    case 'se':
      return { x: width, y: height };
    case 's':
      return { x: cx, y: height };
    case 'sw':
      return { x: 0, y: height };
    case 'w':
      return { x: 0, y: cy };
    case 'nw':
      return { x: 0, y: 0 };
    default:
      return { x: cx, y: cy };
  }
}

export function randomEdge(): EdgeOrigin {
  return EDGE_LIST[Math.floor(Math.random() * EDGE_LIST.length)];
}

export function randomEdgePoint(): { x: number; y: number; origin: EdgeOrigin } {
  const origin = randomEdge();
  const p = edgePoint(origin);
  return { ...p, origin };
}

/**
 * Random on-stage point with wide variance.
 * `dir` < 0 biases left half, > 0 right half; 0 = full stage.
 * `pad` keeps hits away from the very edge (0–0.45).
 */
export function scatterPoint(
  width: number,
  height: number,
  dir = 0,
  pad = 0.12,
): { x: number; y: number } {
  const p = Math.max(0.05, Math.min(0.4, pad));
  let x0 = p;
  let x1 = 1 - p;
  if (dir < 0) {
    x0 = p;
    x1 = 0.55;
  } else if (dir > 0) {
    x0 = 0.45;
    x1 = 1 - p;
  }
  // Occasionally push toward edges for more spread
  if (Math.random() < 0.35) {
    if (dir <= 0 && Math.random() < 0.5) {
      x0 = p;
      x1 = 0.35;
    } else if (dir >= 0) {
      x0 = 0.65;
      x1 = 1 - p;
    }
  }
  const y0 = p;
  const y1 = 1 - p;
  return {
    x: width * (x0 + Math.random() * (x1 - x0)),
    y: height * (y0 + Math.random() * (y1 - y0)),
  };
}

export function scatterY(height: number, pad = 0.12): number {
  const p = Math.max(0.05, Math.min(0.4, pad));
  return height * (p + Math.random() * (1 - 2 * p));
}

export const TWO_PI = Math.PI * 2;
