import './styles.css';
import { bindInput } from './keys/input';
import { startRenderLoop } from './visuals/render';

const el = document.getElementById('c');
if (!(el instanceof HTMLCanvasElement)) {
  throw new Error('Canvas #c not found');
}
const canvas: HTMLCanvasElement = el;

const ctx = canvas.getContext('2d');
if (!ctx) {
  throw new Error('Could not get 2d context');
}

function resize(): void {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

resize();
window.addEventListener('resize', resize);

bindInput(canvas);
startRenderLoop(canvas, ctx);
