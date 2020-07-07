import { Manager } from './runtime'
import { extend, ExtendFn } from '../shared/eventEmitter'
import { last, assert, isAudioNode } from '../shared/index'
import { ReAudioContext, createAudioContext } from '../shared/audio'

type AudioNodeWrap = (context: Context) => AudioNodeFn
type AudioNodeFn = (prevAudioNode: AudioNode | null) => AudioNode | AudioNode[]

export interface Context {
  manager: Manager
  _canplay: boolean
  closed: boolean
  audioNodes: AudioNode[]
  nodes: Set<AudioNodeFn>
  audioContext: ReAudioContext
  close: ExtendFn<Function>
  canPlay: ExtendFn<Function>
  connect: ExtendFn<Function>
  registrar: ExtendFn<Function>
  disconnect: ExtendFn<Function>
}

// Connect audio node
function registrar(this: Context, registrar: AudioNodeWrap) {
  if (__DEV__) {
    assert(typeof registrar === 'function', '`registrar` is not a function.')
  }

  const wrap = { fn: registrar }
  this.registrar.emit(wrap)
  const fn = wrap.fn(this)

  if (__DEV__) {
    assert(
      typeof fn === 'function',
      'The registrar should return a function, ' +
        'like this: \n\n' +
        `
          manager.registrar(context => {
            return audioNode => {
              context.AudioContext.createBiquadFilter()
            }
          })
        `,
    )
  }
  this.nodes.add(fn)
}

function connect(this: Context) {
  // We need collect nodes to use when disconnected
  let prevNode: AudioNode | null = null
  const ctx = this.audioContext
  const nodes: AudioNode[] = [ctx.destination]

  this.connect.emit()
  this.nodes.forEach((fn) => {
    const curNode = fn(prevNode)

    if (Array.isArray(curNode)) {
      if (__DEV__) {
        curNode.forEach((n) => {
          assert(isAudioNode(n), 'Should return an audioNode.')
        })
      }

      prevNode = last(curNode)
      nodes.push.apply(nodes, curNode)
    } else {
      if (__DEV__) {
        assert(isAudioNode(curNode), 'Should return an audioNode.')
      }

      prevNode = curNode
      nodes.push(curNode)
    }
  })

  // Connect nodes
  for (let i = nodes.length - 2; i <= 0; i--) {
    const curNode = nodes[i]
    if (!curNode) break
    ;((prevNode as unknown) as AudioNode).connect(curNode)
    prevNode = curNode
  }

  this.closed = false
  this.audioNodes = nodes
}

function disconnect(this: Context) {
  if (this.audioNodes.length > 0) {
    for (const node of this.audioNodes) {
      node.disconnect()
    }
    this.disconnect.emit()
  }
}

// Close audio context, free up resources
function close(this: Context): Promise<void> {
  if (__DEV__) {
    assert(
      !this.closed,
      'Current audioContext has been closed, ' +
        'you need to create a new manager.',
    )
  }
  return this.audioContext.close().then(() => {
    this.closed = true
    this.nodes.clear()
    this.close.emit()
    this.audioNodes.length = 0
    this._canplay = false

    // Clear all listener
    this.close.removeAll()
    this.canPlay.removeAll()
    this.connect.removeAll()
    this.registrar.removeAll()
    this.disconnect.removeAll()
  })
}

// If the audio source is loaded that's can play
function canPlay(this: Context) {
  return this._canplay
}

export function createContext(manager: Manager): Context {
  const audioContext = createAudioContext(manager.constructor)

  return {
    manager,
    _canplay: false,
    closed: false,
    audioNodes: [],
    nodes: new Set<AudioNodeFn>(),
    audioContext,
    close: extend(close),
    canPlay: extend(canPlay),
    connect: extend(connect),
    registrar: extend(registrar),
    disconnect: extend(disconnect),
  }
}
