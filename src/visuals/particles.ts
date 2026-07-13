import { shapes, type ShapeFn } from './shapes';
import type { KeyEntry } from '../keys/keyMap';

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  maxR: number;
  rot: number;
  color: string;
  shapeFn: ShapeFn;
  born: number;
  life: number;
}

export let particles: Particle[] = [];
export let pulse = 0;

export function setParticles(next: Particle[]): void {
  particles = next;
}

export function setPulse(value: number): void {
  pulse = value;
}

export function spawn(entry: KeyEntry, canvas: HTMLCanvasElement): void {
  particles.push({
    x: canvas.width / 2 + (Math.random() - 0.5) * canvas.width * 0.6,
    y: canvas.height / 2 + (Math.random() - 0.5) * canvas.height * 0.5,
    vx: (Math.random() - 0.5) * 40,
    vy: (Math.random() - 0.5) * 40,
    r: 8,
    maxR: 60 + Math.random() * 50,
    rot: Math.random() * Math.PI * entry.dir,
    color: entry.color,
    shapeFn: shapes[entry.shape],
    born: performance.now(),
    life: 700,
  });
  pulse = 1;
}
