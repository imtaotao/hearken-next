import { createAudioContext } from '../shared/audio'

export function createContext(replyon: Object) {
  const audioCtx = createAudioContext(replyon)

  return {
    audioCtx,
    manager: replyon,
  }
}
