import { Manager } from '../manager/runtime'
import { warn, assert } from '../shared/index'
import { extend, ExtendFn } from 'src/shared/eventEmitter'

interface StartOptions {
  loop?: boolean
  crossOrigin?: string
  audio?: HTMLAudioElement
}

interface Player {
  manager: Manager
  playing: () => boolean
  el: HTMLAudioElement | null
  close: ExtendFn<() => void>
  add: ExtendFn<(url: string) => void>
}

function playSuccess(player: Player) {
  return () => {
    player.add.emit()
    return true
  }
}

function playError(player: Player) {
  return (error: Error) => {
    warn(error.message)
    player.add.emit(error)
    return false
  }
}

export function Long(manager: Manager, options?: StartOptions): Player {
  const Player = {
    manager,
    el: null,

    // Use audio element load source and control audio behavior
    add: extend(function (this: Player, url: string) {
      if (__DEV__) {
        assert(typeof url === 'string', 'error')
      }
      const el = (this.el = options?.audio || new Audio())

      if (options?.crossOrigin) {
        el.crossOrigin = options.crossOrigin
      }
      el.src = url
      el.loop = Boolean(options?.loop)
      el.oncanplay = () => {
        // Alter context canplay attribute and dispatch event
        manager.context._canplay = true
        manager.context.canplay.emit()
      }
    }),

    // When call stop method，need free up resource
    close: extend(function (this: Player) {}),

    playing() {
      return this.el ? ((this.el as unknown) as HTMLAudioElement).paused : false
    },
  }

  return Player
}
