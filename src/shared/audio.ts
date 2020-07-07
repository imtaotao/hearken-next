const MEDIA_ELEMENT_NODES = new WeakMap<
  HTMLAudioElement,
  MediaElementAudioSourceNode
>()

export type ReAudioContext = AudioContext & { $isClosed: boolean }

export function createAudioContext(obj: any): ReAudioContext {
  if (!obj.$ctx) {
    obj.$ctx = new (window.AudioContext ||
      (window as any).webkitAudioContext ||
      (window as any).mozAudioContext ||
      (window as any).msAudioContext)()
  }

  obj.$ctx.$isClosed = false
  return obj.$ctx
}

export function createFilter(ctx: AudioContext) {
  const ra = ctx.createBiquadFilter()
  ra.type = 'peaking'
  return ra
}

export function createAnalyser(ctx: AudioContext, fftSize: number) {
  const analyser = ctx.createAnalyser()
  // fourier transform parameter
  analyser.fftSize = fftSize * 2
  return analyser
}

export function createGainNode(ctx: AudioContext): GainNode {
  return (ctx as any)[
    (ctx.createGain as Function) ? 'createGain' : 'createGainNode'
  ]()
}

export function createMediaElementSource(
  ctx: AudioContext,
  el: HTMLAudioElement,
) {
  if (MEDIA_ELEMENT_NODES.has(el)) {
    return MEDIA_ELEMENT_NODES.get(el) as MediaElementAudioSourceNode
  } else {
    const source = ctx.createMediaElementSource(el)
    MEDIA_ELEMENT_NODES.set(el, source)
    return source
  }
}
