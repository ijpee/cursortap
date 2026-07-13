import { keyMap } from './keyMap';
import { spawn } from '../visuals/particles';
import { trigger } from '../audio/voices';

export function bindInput(canvas: HTMLCanvasElement): void {
  window.addEventListener('keydown', (e) => {
    const entry = keyMap[e.key.toLowerCase()];
    if (!entry || e.repeat) return;
    spawn(entry, canvas);
    trigger(entry);
  });

  canvas.addEventListener('pointerdown', () => {
    const entries = Object.values(keyMap);
    const entry = entries[Math.floor(Math.random() * entries.length)];
    spawn(entry, canvas);
    trigger(entry);
  });
}
