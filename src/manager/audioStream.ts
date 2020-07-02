import { Manager } from './runtime'

export function loadAudioSource(manager: Manager) {
  if (manager.model === 'link' && typeof manager.buffer === 'string') {
    console.log(manager)
  }
}
