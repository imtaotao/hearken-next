import { Manager } from './runtime'
import { extend, ExtendEvent } from '../shared/eventEmitter'
import { last, assert, isAudioNode } from '../shared/index'
import { ReAudioContext, createAudioContext } from '../shared/audio'

type AudioNodeWrap = (context: Context) => AudioNodeFn
type AudioNodeFn = (prevAudioNode: AudioNode | null) => AudioNode | AudioNode[]

export interface Context {
  manager: Manager
  _canplay: boolean
  audioNodes: AudioNode[]
  nodes: Set<AudioNodeFn>
  audioContext: ReAudioContext
  canplay: ExtendEvent<Function>
  connect: ExtendEvent<Function>
  registrar: ExtendEvent<Function>
  disconnect: ExtendEvent<Function>
}

// Connect audio node
function registrar(this: Context, registrar: AudioNodeWrap) {
  if (__DEV__) {
    assert(
      typeof registrar === 'function',
      'registrar "callback" is not a function.',
    )
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
          manager.context.registrar(context => {
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
  const ctx = this.audioContext
  let prevNode: AudioNode = ctx.destination
  const nodes: AudioNode[] = [ctx.destination]

  this.connect.emit()
  this.nodes.forEach((fn) => {
    const curNode = fn(prevNode)

    if (Array.isArray(curNode)) {
      if (__DEV__) {
        curNode.forEach((n) => {
          assert(
            isAudioNode(n),
            'registrar "callback" should return an audioNode, ' +
              `but now is '${typeof n}'`,
          )
        })
      }

      prevNode = last(curNode)
      nodes.push.apply(nodes, curNode)
    } else {
      if (__DEV__) {
        assert(
          isAudioNode(curNode),
          'registrar "callback" should return an audioNode, ' +
            `but now is '${typeof curNode}'`,
        )
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

// If the audio source is loaded that's can play
function canplay(this: Context) {
  return this._canplay
}

export function createContext(manager: Manager): Context {
  const audioContext = createAudioContext(manager.constructor)

  return {
    manager,
    audioContext,
    audioNodes: [],
    _canplay: false,
    nodes: new Set<AudioNodeFn>(),
    canplay: extend(canplay),
    connect: extend(connect),
    registrar: extend(registrar),
    disconnect: extend(disconnect),
  }
}
