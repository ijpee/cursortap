import { keyMap, type AnimationName } from './keyMap';
import { trigger } from '../audio/voices';
import { clearAnimations, triggerAnimation } from '../animations';
import {
  applyThemeToDom,
  nextThemeInk,
  resetPalette,
} from '../animations/palette';

/** Return to homescreen chrome after this long with no hits. */
const IDLE_MS = 3_000;

/**
 * Click/tap plays this phrase in order (C major pentatonic).
 * Loops — each click advances one step so taps build a real melody.
 */
const CLICK_MELODY = [
  'a', 'd', 'f', 'g', 'f', 'd', 's', 'a',
  'h', 'g', 'f', 'd', 'f', 'g', 'h',
  'a', 's', 'd', 'f', 'g', 'f', 'd',
  'h', 'j', 'h', 'g', 'f', 'd', 'a',
  '1', 'a', 'f', 'h',
].filter((k) => keyMap[k]);

/**
 * Click visuals — Cursor-heavy rotation.
 * Featured keys A W 3 R D F K get extra weight in the showreel.
 */
const CLICK_FEATURE_KEYS = ['a', 'w', '3', 'r', 'd', 'f', 'k'] as const;
const CLICK_FEATURE_WEIGHT = 3;

const CLICK_ANIMS: AnimationName[] = (() => {
  const featured: AnimationName[] = [];
  const seenFeatured = new Set<string>();
  for (const k of CLICK_FEATURE_KEYS) {
    const anim = keyMap[k]?.animation;
    if (anim && !seenFeatured.has(anim)) {
      seenFeatured.add(anim);
      featured.push(anim);
    }
  }

  const rest: AnimationName[] = [];
  const seen = new Set(seenFeatured);
  for (const entry of Object.values(keyMap)) {
    if (!seen.has(entry.animation)) {
      seen.add(entry.animation);
      rest.push(entry.animation);
    }
  }

  const list: AnimationName[] = [];
  let restIdx = 0;
  for (let round = 0; round < CLICK_FEATURE_WEIGHT; round++) {
    for (const anim of featured) {
      list.push(anim);
      if (restIdx < rest.length) {
        list.push(rest[restIdx]);
        restIdx += 1;
      }
    }
  }
  while (restIdx < rest.length) {
    list.push(rest[restIdx]);
    restIdx += 1;
  }
  return list;
})();

let playing = false;
let idleTimer: ReturnType<typeof setTimeout> | null = null;
let clickStep = 0;

function goHome(): void {
  if (!playing) return;
  playing = false;
  document.body.classList.remove('playing');
  clearAnimations();
  resetPalette();
  idleTimer = null;
  clickStep = 0;
}

function bumpIdle(): void {
  if (idleTimer !== null) clearTimeout(idleTimer);
  idleTimer = setTimeout(goHome, IDLE_MS);
}

function markPlaying(): void {
  if (!playing) {
    playing = true;
    document.body.classList.add('playing');
  }
  bumpIdle();
}

function hit(
  entry: (typeof keyMap)[string],
  canvas: HTMLCanvasElement,
): void {
  markPlaying();
  triggerAnimation(entry.animation, {
    color: entry.color,
    dir: entry.dir,
    width: canvas.width,
    height: canvas.height,
  });
  trigger(entry);
}

function hitClickMelody(canvas: HTMLCanvasElement): void {
  if (CLICK_MELODY.length === 0) return;
  const step = clickStep;
  clickStep += 1;

  const key = CLICK_MELODY[step % CLICK_MELODY.length];
  const entry = keyMap[key];
  if (!entry) return;

  const animation =
    CLICK_ANIMS.length > 0
      ? CLICK_ANIMS[step % CLICK_ANIMS.length]
      : entry.animation;
  const color = nextThemeInk();
  const dir = step % 2 === 0 ? -1 : 1;

  markPlaying();
  triggerAnimation(animation, {
    color,
    dir,
    width: canvas.width,
    height: canvas.height,
  });
  trigger(entry);
}

export function bindInput(canvas: HTMLCanvasElement): void {
  applyThemeToDom();

  window.addEventListener('keydown', (e) => {
    if (e.repeat) return;

    if (e.code === 'Space' || e.key === ' ') {
      e.preventDefault();
      hitClickMelody(canvas);
      return;
    }

    const key = e.key.toLowerCase();
    const entry = keyMap[key];
    if (!entry) return;
    e.preventDefault();
    hit(entry, canvas);
  });

  canvas.addEventListener('pointerdown', () => {
    hitClickMelody(canvas);
  });
}
