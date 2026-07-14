export type AnimationLayer = 'background' | 'middleground' | 'foreground';

export interface StartOpts {
  color: string;
  dir: number;
  width: number;
  height: number;
  now: number;
}

/** Mutable per-trigger state owned by the animation module. */
export type AnimState = Record<
  string,
  number | string | boolean | number[] | number[][]
>;

export interface ActiveAnimation {
  name: string;
  layer: AnimationLayer;
  born: number;
  life: number;
  color: string;
  dir: number;
  state: AnimState;
  draw: (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    t: number,
    anim: ActiveAnimation,
  ) => void;
}

export interface AnimationDef {
  name: string;
  layer: AnimationLayer;
  life: number;
  /** Flash / rotate palette when this animation triggers. */
  palette?: 'flash' | 'rotate' | 'both';
  start: (opts: StartOpts) => AnimState;
  draw: ActiveAnimation['draw'];
}

export function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

export function easeInCubic(t: number): number {
  return t * t * t;
}

export function easeInOut(t: number): number {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

export function easeOutExpo(t: number): number {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
}

export function easeInExpo(t: number): number {
  return t === 0 ? 0 : Math.pow(2, 10 * t - 10);
}

export function easeOutCirc(t: number): number {
  return Math.sqrt(1 - Math.pow(t - 1, 2));
}

export function easeInCirc(t: number): number {
  return 1 - Math.sqrt(1 - Math.pow(t, 2));
}

export function rand(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}
