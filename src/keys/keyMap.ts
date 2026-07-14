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

export type AnimationName =
  | 'cursorMark'
  | 'wordmark'
  | 'pointerClick'
  | 'caretPulse'
  | 'tabGhost'
  | 'agentOrb'
  | 'chatStack'
  | 'cmdPalette'
  | 'terminalScan'
  | 'fileTree'
  | 'diffBars'
  | 'selectionBox'
  | 'codeShards'
  | 'modelChip'
  | 'sidebarSlide'
  | 'inlineEdit'
  | 'wipe'
  | 'flashes'
  | 'change'
  | 'strike'
  | 'corona'
  | 'confetti'
  | 'pinwheel'
  | 'prisms'
  | 'clay'
  | 'spiral'
  | 'bubbles'
  | 'zigzag'
  | 'moon'
  | 'pistons'
  | 'squiggle'
  | 'glimmer'
  | 'suspension'
  | 'veil'
  | 'splits'
  | 'ufo';

export type KeyEntry =
  | {
      voice: 'drum';
      drum: DrumType;
      color: string;
      animation: AnimationName;
      dir: number;
    }
  | {
      voice: 'pluck';
      freq: number;
      color: string;
      animation: AnimationName;
      dir: number;
    }
  | {
      voice: 'bass';
      freq: number;
      color: string;
      animation: AnimationName;
      dir: number;
    }
  | {
      voice: 'chord';
      freqs: number[];
      color: string;
      animation: AnimationName;
      dir: number;
    };

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
const drumAnims: AnimationName[] = [
  'wipe', // kick
  'cursorMark', // snare
  'caretPulse', // hihat closed
  'tabGhost', // hihat open
  'confetti', // clap
  'strike', // rim
  'diffBars', // tom low
  'fileTree', // tom high
  'corona', // crash
  'codeShards', // shaker
];

const melodyOrder = 'asdfghjkl'.split('');
const bassOrder = 'zxcvbnm'.split('');
const chordOrder = '1234567890'.split('');
const leftKeys = new Set('qwertasdfgzxcvb12345'.split(''));

const melodyColors = [
  '#FF6C37',
  '#FF8A5B',
  '#F2AD70',
  '#F2CBA0',
  '#F7F7F4',
  '#FF6C37',
  '#C94A22',
  '#F2E4CC',
  '#FF8A5B',
];
const melodyAnims: AnimationName[] = [
  'pointerClick',
  'inlineEdit',
  'tabGhost',
  'modelChip',
  'caretPulse',
  'chatStack',
  'cmdPalette',
  'codeShards',
  'wordmark',
];

const bassColors = [
  '#5C2712',
  '#7A2D14',
  '#A83D1C',
  '#3D1A0E',
  '#C94A22',
  '#5C2712',
  '#8B3A1A',
];
const bassAnims: AnimationName[] = [
  'sidebarSlide',
  'terminalScan',
  'selectionBox',
  'fileTree',
  'diffBars',
  'wipe',
  'pinwheel',
];

const chordColors = [
  '#F7F7F4',
  '#F2E4CC',
  '#FFFFFF',
  '#F2CBA0',
  '#FF6C37',
  '#F7F7F4',
  '#FF8A5B',
  '#F2AD70',
  '#FFFFFF',
  '#F2E4CC',
];
const chordAnims: AnimationName[] = [
  'pistons',
  'agentOrb',
  'cursorMark',
  'prisms',
  'cmdPalette',
  'clay',
  'corona',
  'spiral',
  'bubbles',
  'moon',
];

export const keyMap: Record<string, KeyEntry> = {};

drumOrder.forEach((c, i) => {
  keyMap[c] = {
    voice: 'drum',
    drum: drumTypes[i],
    color: drumColors[i],
    animation: drumAnims[i],
    dir: leftKeys.has(c) ? -1 : 1,
  };
});

melodyOrder.forEach((c, i) => {
  keyMap[c] = {
    voice: 'pluck',
    freq: scaleNote(i, 60),
    color: melodyColors[i],
    animation: melodyAnims[i],
    dir: leftKeys.has(c) ? -1 : 1,
  };
});

bassOrder.forEach((c, i) => {
  keyMap[c] = {
    voice: 'bass',
    freq: scaleNote(i, 36),
    color: bassColors[i],
    animation: bassAnims[i],
    dir: leftKeys.has(c) ? -1 : 1,
  };
});

chordOrder.forEach((c, i) => {
  const root = 72 + PENTA[i % PENTA.length];
  keyMap[c] = {
    voice: 'chord',
    freqs: [midiToFreq(root), midiToFreq(root + 7), midiToFreq(root + 12)],
    color: chordColors[i],
    animation: chordAnims[i],
    dir: leftKeys.has(c) ? -1 : 1,
  };
});
