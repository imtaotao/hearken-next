import { createAudioContext } from '../shared/audio'

export function createContext(manager: Object) {
  const audioContext = createAudioContext(manager.constructor)

  return {
    manager,
    audioContext,
  }
}
