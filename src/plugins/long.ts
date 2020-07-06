import { assert } from '../shared/index'
import { Manager } from '../manager/runtime'

interface StartOptions {
  crossOrigin?: string
  audio?: HTMLAudioElement
}

interface LongPlugin {
  el: HTMLAudioElement
  start: (url: string) => Promise<boolean>
}

export function Long(manager: Manager, options?: StartOptions) {
  function start(this: LongPlugin, url: string) {
    if (__DEV__) {
      assert(typeof url === 'string', 'error')
    }

    const audio = (this.el = options?.audio || new Audio())
    if (options?.crossOrigin) {
      audio.crossOrigin = options.crossOrigin
    }
    audio.src = url
  }

  return {
    el: HTMLAudioElement,
    start,
  }
}
