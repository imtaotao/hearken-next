import { createAudioContext } from '../shared/audio'

export function createContext(replyon: Object) {
  const audioCtx = createAudioContext(replyon.constructor)

  return {
    audioCtx,
    manager: replyon,
  }
}
