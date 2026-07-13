import { PENTA, midiToFreq, scaleNote } from '../scale';

export type DrumType =
  | 'kick'
  | 'snare'
  | 'hihatClosed'
  | 'hihatOpen'
  | 'clap'
  | 'rim'
  | 'tomLow'
  | 'tomHigh'
  | 'crash'
  | 'shaker';

export type KeyEntry =
  | { voice: 'drum'; drum: DrumType; color: string; shape: number; dir: number }
  | { voice: 'pluck'; freq: number; color: string; shape: number; dir: number }
  | { voice: 'bass'; freq: number; color: string; shape: number; dir: number }
  | { voice: 'chord'; freqs: number[]; color: string; shape: number; dir: number };

const drumOrder = 'qwertyuiop'.split('');
const drumTypes: DrumType[] = [
  'kick',
  'snare',
  'hihatClosed',
  'hihatOpen',
  'clap',
  'rim',
  'tomLow',
  'tomHigh',
  'crash',
  'shaker',
];
const drumColors = [
  '#7A2D14',
  '#FF6C37',
  '#F7F7F4',
  '#F2E4CC',
  '#FF8A5B',
  '#F2AD70',
  '#A83D1C',
  '#C94A22',
  '#FFFFFF',
  '#F2CBA0',
];

const melodyOrder = 'asdfghjkl'.split('');
const bassOrder = 'zxcvbnm'.split('');
const chordOrder = '1234567890'.split('');
const leftKeys = new Set('qwertasdfgzxcvb12345'.split(''));

export const keyMap: Record<string, KeyEntry> = {};

drumOrder.forEach((c, i) => {
  keyMap[c] = {
    voice: 'drum',
    drum: drumTypes[i],
    color: drumColors[i],
    shape: i % 4,
    dir: leftKeys.has(c) ? -1 : 1,
  };
});

melodyOrder.forEach((c, i) => {
  keyMap[c] = {
    voice: 'pluck',
    freq: scaleNote(i, 60),
    color: '#FF6C37',
    shape: 0,
    dir: leftKeys.has(c) ? -1 : 1,
  };
});

bassOrder.forEach((c, i) => {
  keyMap[c] = {
    voice: 'bass',
    freq: scaleNote(i, 36),
    color: '#5C2712',
    shape: 1,
    dir: leftKeys.has(c) ? -1 : 1,
  };
});

chordOrder.forEach((c, i) => {
  const root = 72 + PENTA[i % PENTA.length];
  keyMap[c] = {
    voice: 'chord',
    freqs: [midiToFreq(root), midiToFreq(root + 7), midiToFreq(root + 12)],
    color: '#F7F7F4',
    shape: 4,
    dir: leftKeys.has(c) ? -1 : 1,
  };
});
