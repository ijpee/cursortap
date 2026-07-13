import { getAudioContext, out } from './engine';
import { drums } from './drums';
import type { KeyEntry } from '../keys/keyMap';

export function playPluck(freq: number, now: number): void {
  const ctx = getAudioContext();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(freq * 1.03, now);
  osc.frequency.exponentialRampToValueAtTime(freq, now + 0.06);
  gain.gain.setValueAtTime(0.22, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
  osc.connect(gain);
  out(gain);
  osc.start(now);
  osc.stop(now + 0.35);
}

export function playBass(freq: number, now: number): void {
  const ctx = getAudioContext();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'triangle';
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(0.28, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
  osc.connect(gain);
  out(gain);
  osc.start(now);
  osc.stop(now + 0.5);
}

export function playChord(freqs: number[], now: number): void {
  const ctx = getAudioContext();
  const gain = ctx.createGain();
  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.value = 1600;
  freqs.forEach((f) => {
    const osc = ctx.createOscillator();
    osc.type = 'sawtooth';
    osc.frequency.value = f;
    osc.connect(filter);
    osc.start(now);
    osc.stop(now + 1.4);
  });
  filter.connect(gain);
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.linearRampToValueAtTime(0.1, now + 0.25);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 1.4);
  out(gain);
}

export function trigger(entry: KeyEntry): void {
  const now = getAudioContext().currentTime;
  if (entry.voice === 'drum') drums[entry.drum](now);
  else if (entry.voice === 'pluck') playPluck(entry.freq, now);
  else if (entry.voice === 'bass') playBass(entry.freq, now);
  else if (entry.voice === 'chord') playChord(entry.freqs, now);
}
