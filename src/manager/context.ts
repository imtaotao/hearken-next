import { createAudioContext } from '../shared/audio'

export function createContext(manager: Object) {
  const audioCtx = createAudioContext(manager.constructor)

  return {
    manager,
    audioCtx,
  }
}
