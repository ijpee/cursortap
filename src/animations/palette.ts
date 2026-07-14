/** Fixed Cursor palette — background flashes only, no theme cycling. */

export type PaletteColors = {
  background: string;
  middleground: string;
  foreground: string;
  accent: string;
};

const BACKGROUND = '#14120B';
const SURFACE = '#1A1811';
const ACCENT = '#FF6C37';
const FOREGROUND = '#F7F7F4';
const MUTED = '#948E7A';

const INKS = [
  '#FF6C37',
  '#FF8A5B',
  '#F2AD70',
  '#F2CBA0',
  '#F7F7F4',
  '#C94A22',
  '#F2E4CC',
  '#FFFFFF',
  '#A83D1C',
  '#7A2D14',
];

let flashUntil = 0;
let flashColor = ACCENT;
let inkCursor = 0;

export function getPalette(): PaletteColors {
  return {
    background: BACKGROUND,
    middleground: ACCENT,
    foreground: FOREGROUND,
    accent: ACCENT,
  };
}

/** Stage / punch-through color for glyphs drawn "into" the background. */
export function getSurface(): string {
  return BACKGROUND;
}

export function themeInk(index: number): string {
  return INKS[((index % INKS.length) + INKS.length) % INKS.length];
}

/** Next ink for click showreel. */
export function nextThemeInk(): string {
  const color = INKS[inkCursor % INKS.length];
  inkCursor += 1;
  return color;
}

export function resetPalette(): void {
  flashUntil = 0;
}

export function flashBackground(color: string, durationMs = 180): void {
  flashColor = color;
  flashUntil = performance.now() + durationMs;
}

export function tickPalette(now: number): {
  bg: string;
  flashing: boolean;
} {
  const flashing = now < flashUntil;
  if (flashing) {
    return { bg: flashColor, flashing: true };
  }
  return { bg: BACKGROUND, flashing: false };
}

export function applyThemeToDom(): void {
  const root = document.documentElement;
  root.style.setProperty('--bg', BACKGROUND);
  root.style.setProperty('--surface', SURFACE);
  root.style.setProperty('--accent', ACCENT);
  root.style.setProperty('--ink', FOREGROUND);
  root.style.setProperty('--muted', MUTED);
  document.body.style.background = BACKGROUND;
}

export function hexToRgba(hex: string, alpha: number): string {
  const h = hex.replace('#', '');
  const full =
    h.length === 3
      ? h
          .split('')
          .map((c) => c + c)
          .join('')
      : h;
  const n = parseInt(full, 16);
  if (Number.isNaN(n)) {
    return `rgba(20,18,11,${alpha})`;
  }
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;
  const a = Number.isFinite(alpha) ? Math.max(0, Math.min(1, alpha)) : 1;
  return `rgba(${r},${g},${b},${a})`;
}
