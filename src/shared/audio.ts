export interface ExtendAudioContext {
  $isClosed: boolean
}

export function createAudioContext(
  obj: any,
): AudioContext & ExtendAudioContext {
  if (!obj.$AudioCtx) {
    obj.$AudioCtx = new (window.AudioContext ||
      (window as any).webkitAudioContext ||
      (window as any).mozAudioContext ||
      (window as any).msAudioContext)()
  }

  obj.$AudioCtx.$isClosed = false

  return obj.$AudioCtx
}
