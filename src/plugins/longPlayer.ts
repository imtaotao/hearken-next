import { LONG_PLAYER } from './symbols'
import { findNode } from '../shared/audio'
import { Manager } from '../manager/runtime'
import { createMediaElementSource } from '../shared/audio'
import { extend, ExtendEvent } from 'src/shared/eventEmitter'
import { isVoid, assert, range, warn } from '../shared/index'

type Provider<T> = (inject: (n: keyof T, val: T[keyof T]) => any) => void

interface LongOptions {
  loop?: boolean
  crossOrigin?: string
  audio?: HTMLAudioElement
  preload?: 'auto' | 'meta' | 'none'
}

export interface LPlayer {
  type: Symbol
  manager: Manager
  context: Manager['context']
  options: LongOptions
  playing: () => boolean
  duration: () => number
  el: HTMLAudioElement | null
  pause: ExtendEvent<() => void>
  close: ExtendEvent<() => void>
  add: ExtendEvent<(url: string) => void>
  play: ExtendEvent<() => Promise<boolean>>
  mute: ExtendEvent<(val: boolean) => void>
  volume: ExtendEvent<(val: number) => void>
  forward: ExtendEvent<(val: number) => void>
  expand: ExtendEvent<<T>(provider: Provider<T>) => void>
}

// Use audio element load source and control audio behavior
function add(this: LPlayer, url: string) {
  if (__DEV__) {
    assert(typeof url === 'string', 'error')
  }
  const opts = this.options || {}
  const el = (this.el = opts.audio || new Audio())

  if (opts.crossOrigin) {
    el.crossOrigin = opts.crossOrigin
  }
  // We need auto load audio resource,
  // of course, allow specify too
  if (!opts.preload) {
    opts.preload = 'auto'
  }

  el.src = url
  el.loop = Boolean(opts.loop)
  el.preload = opts.preload
  el.oncanplay = () => {
    // Alter context canplay attribute and dispatch event
    this.manager.context._canplay = true
    this.manager.context.canplay.emit()
  }
  this.add.emit(el)
}

// When call stop method，need free up resource
function close(this: LPlayer) {
  if (this.playing()) {
    this.el?.pause()
  }
  // We don't call context close, because that's a single audio
  this.manager.context.disconnect()
  this.el && (this.el.currentTime = 0)
  this.close.emit()
}

function play(this: LPlayer) {
  if (this.el && !this.playing()) {
    return this.el.play().then(() => {
      this.play.emit()
      return true
    })
  }
  return Promise.resolve(false)
}

function pause(this: LPlayer) {
  if (this.playing()) {
    this.el?.pause()
    this.pause.emit()
  }
}

function volume(this: LPlayer, val: number) {
  if (__DEV__) {
    assert(
      typeof val === 'undefined' ||
        (typeof val === 'number' && !Number.isNaN(val)),
      'Not a legal value.',
    )
  }
  let cur
  const { audioNodes, audioContext } = this.manager.context
  const gainNode = findNode(audioNodes, 'GainNode')

  // Use `gainNode` nodes first
  if (gainNode) {
    if (!isVoid(val)) {
      ;(gainNode as GainNode).gain.setValueAtTime(val, audioContext.currentTime)
    }
    cur = (gainNode as GainNode).gain.value
  } else {
    if (__DEV__) {
      assert(!isVoid(this.el), 'Lack audio element')
    }
    if (!isVoid(val)) {
      ;(this.el as HTMLAudioElement).volume = val
    }
    cur = this.el!.volume
  }

  this.volume.emit(val)
  return cur
}

function mute(this: LPlayer, val: boolean) {
  if (__DEV__) {
    assert(!isVoid(this.el), 'Lack audio element')
    assert(
      typeof val === 'boolean',
      'Not a legal value, "mute" method need boolean value.',
    )
  }
  ;(this.el as HTMLAudioElement).muted = val
  this.mute.emit(val)
}

function forward(this: LPlayer, val: number) {
  if (__DEV__) {
    assert(typeof val === 'number', 'Not a legal value.')
    if (!this.playing()) {
      warn('The audio is paused, you may need to recall `player.play()`')
    }
  }
  const duration = this.duration()
  if (duration > 0) {
    const real = range(0, duration, val)
    ;(this.el as HTMLAudioElement).currentTime = real
    this.forward.emit(real)
  }
}

function duration(this: LPlayer) {
  if (__DEV__) {
    assert(!isVoid(this.el), 'Lack audio element')
  }
  return this.el ? this.el.duration : 0
}

function playing(this: LPlayer) {
  return this.el ? !((this.el as unknown) as HTMLAudioElement).paused : false
}

// Expand player interface
function expand<T>(this: LPlayer, provider: Provider<T>) {
  if (__DEV__) {
    assert(typeof provider === 'function', 'Provider must be a function')
  }
  provider((n, obj) => {
    if (__DEV__) {
      assert(typeof n === 'string', 'expand name must be a string')
      assert(!isVoid(obj), 'expand target must be a function or object')
      assert(!Reflect.has(this, n), `${n} is already registered`)
    }
    ;((this as unknown) as T)[n] = obj
  })
  return this as LPlayer & T
}

export function LongPlayer(manager: Manager, options: LongOptions = {}) {
  const { context } = manager
  const player = {
    manager,
    context,
    options,
    el: null,
    playing,
    duration,
    type: LONG_PLAYER,
    add: extend(add),
    mute: extend(mute),
    play: extend(play),
    close: extend(close),
    pause: extend(pause),
    volume: extend(volume),
    expand: extend(expand),
    forward: extend(forward),
  } as LPlayer

  context.registrar(() => {
    return () => {
      if (__DEV__) {
        assert(
          player.el,
          'Lack audio element, maybe you need call `LongPlayer.add("xx.mp3")`',
        )
      }
      return createMediaElementSource(context.audioContext, player.el!)
    }
  })

  return player
}
