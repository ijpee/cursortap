let audioCtx: AudioContext | null = null;
let delayNode: DelayNode | null = null;
let noiseBuffer: AudioBuffer | null = null;

export function getAudioContext(): AudioContext {
  if (!audioCtx) initAudio();
  return audioCtx!;
}

export function initAudio(): AudioContext {
  audioCtx = new (window.AudioContext ||
    (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();

  delayNode = audioCtx.createDelay();
  delayNode.delayTime.value = 0.16;

  const feedbackGain = audioCtx.createGain();
  feedbackGain.gain.value = 0.1;

  const wetGain = audioCtx.createGain();
  wetGain.gain.value = 0.12;

  delayNode.connect(feedbackGain).connect(delayNode);
  delayNode.connect(wetGain).connect(audioCtx.destination);

  const len = audioCtx.sampleRate;
  noiseBuffer = audioCtx.createBuffer(1, len, audioCtx.sampleRate);
  const data = noiseBuffer.getChannelData(0);
  for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;

  return audioCtx;
}

export function out(node: AudioNode): void {
  const ctx = getAudioContext();
  node.connect(ctx.destination);
  node.connect(delayNode!);
}

export function noiseSrc(): AudioBufferSourceNode {
  const ctx = getAudioContext();
  const src = ctx.createBufferSource();
  src.buffer = noiseBuffer;
  return src;
}
