import { getAudioContext, noiseSrc, out } from './engine';
import type { DrumType } from '../keys/keyMap';

export const drums: Record<DrumType, (now: number) => void> = {
  kick(now) {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(150, now);
    osc.frequency.exponentialRampToValueAtTime(45, now + 0.15);
    gain.gain.setValueAtTime(0.9, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
    osc.connect(gain);
    out(gain);
    osc.start(now);
    osc.stop(now + 0.3);
  },
  snare(now) {
    const src = noiseSrc();
    const filter = getAudioContext().createBiquadFilter();
    const gain = getAudioContext().createGain();
    filter.type = 'bandpass';
    filter.frequency.value = 1800;
    gain.gain.setValueAtTime(0.5, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
    src.connect(filter);
    filter.connect(gain);
    out(gain);
    src.start(now);
    src.stop(now + 0.15);
  },
  hihatClosed(now) {
    const src = noiseSrc();
    const filter = getAudioContext().createBiquadFilter();
    const gain = getAudioContext().createGain();
    filter.type = 'highpass';
    filter.frequency.value = 7000;
    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
    src.connect(filter);
    filter.connect(gain);
    out(gain);
    src.start(now);
    src.stop(now + 0.05);
  },
  hihatOpen(now) {
    const src = noiseSrc();
    const filter = getAudioContext().createBiquadFilter();
    const gain = getAudioContext().createGain();
    filter.type = 'highpass';
    filter.frequency.value = 6000;
    gain.gain.setValueAtTime(0.22, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
    src.connect(filter);
    filter.connect(gain);
    out(gain);
    src.start(now);
    src.stop(now + 0.35);
  },
  clap(now) {
    [0, 0.02, 0.04].forEach((delay) => {
      const src = noiseSrc();
      const filter = getAudioContext().createBiquadFilter();
      const gain = getAudioContext().createGain();
      filter.type = 'bandpass';
      filter.frequency.value = 1500;
      gain.gain.setValueAtTime(0.35, now + delay);
      gain.gain.exponentialRampToValueAtTime(0.001, now + delay + 0.08);
      src.connect(filter);
      filter.connect(gain);
      out(gain);
      src.start(now + delay);
      src.stop(now + delay + 0.08);
    });
  },
  rim(now) {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'square';
    osc.frequency.value = 1200;
    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
    osc.connect(gain);
    out(gain);
    osc.start(now);
    osc.stop(now + 0.04);
  },
  tomLow(now) {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(180, now);
    osc.frequency.exponentialRampToValueAtTime(90, now + 0.25);
    gain.gain.setValueAtTime(0.5, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
    osc.connect(gain);
    out(gain);
    osc.start(now);
    osc.stop(now + 0.3);
  },
  tomHigh(now) {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(280, now);
    osc.frequency.exponentialRampToValueAtTime(140, now + 0.2);
    gain.gain.setValueAtTime(0.5, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
    osc.connect(gain);
    out(gain);
    osc.start(now);
    osc.stop(now + 0.25);
  },
  crash(now) {
    const src = noiseSrc();
    const filter = getAudioContext().createBiquadFilter();
    const gain = getAudioContext().createGain();
    filter.type = 'highpass';
    filter.frequency.value = 4000;
    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);
    src.connect(filter);
    filter.connect(gain);
    out(gain);
    src.start(now);
    src.stop(now + 1.2);
  },
  shaker(now) {
    const src = noiseSrc();
    const filter = getAudioContext().createBiquadFilter();
    const gain = getAudioContext().createGain();
    filter.type = 'bandpass';
    filter.frequency.value = 8000;
    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
    src.connect(filter);
    filter.connect(gain);
    out(gain);
    src.start(now);
    src.stop(now + 0.1);
  },
};
