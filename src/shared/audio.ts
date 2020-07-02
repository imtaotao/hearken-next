export function createAudioContext(obj: any) {
  if (!obj.$AudioCtx) {
    obj.$AudioCtx = new (window.AudioContext ||
      (window as any).webkitAudioContext ||
      (window as any).mozAudioContext ||
      (window as any).msAudioContext)()
  }
  return obj.$AudioCtx
}
