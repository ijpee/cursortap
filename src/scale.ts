/** C major pentatonic: C D E G A */
export const PENTA = [0, 2, 4, 7, 9] as const;

export function midiToFreq(midi: number): number {
  return 440 * Math.pow(2, (midi - 69) / 12);
}

export function scaleNote(index: number, baseMidi: number): number {
  const octave = Math.floor(index / PENTA.length);
  const degree = PENTA[index % PENTA.length];
  return midiToFreq(baseMidi + degree + octave * 12);
}
