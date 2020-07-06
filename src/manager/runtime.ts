import { createContext } from './context'
import { extend } from '../shared/eventEmitter'
import { last, assert, isAudioNode } from '../shared/index'

interface ManagerOptions {}

type Model = 'link' | 'buffer' | 'void'
type AudioNodeFn = (prevAudioNode: AudioNode | null) => AudioNode | AudioNode[]
type AudioNodeWrap = (context: Manager['$context']) => AudioNodeFn

// Need filter manager options
function checkOptions(options: ManagerOptions) {
  return options || {}
}

// Close audio context, free up resources
function close(this: Manager): Promise<void> {
  const ctx = this.$context.audioContext
  if (__DEV__) {
    assert(
      !ctx.$isClosed,
      'Current audioContext has been closed, ' +
        'you need to create a new manager.',
    )
  }
  return ctx.close().then(() => {
    ctx.$isClosed = true
    this.nodes.clear()
    this.close.emit()
  })
}

// Install plugin
function apply(this: Manager, plugin: Function, ...args: any[]) {
  if (__DEV__) {
    assert(typeof plugin === 'function', 'The plugin should be a function.')
    assert(
      !!plugin.name,
      'The plugin needs to specify a name. \n\n' +
        `
          // You can\'t use it like this
          manager.apply(() => {})
          manager.apply(function() {})

          // Should pass in a named function
          const player = () => {}
          manager.apply(player)
          manager.apply(function player() {})
        `,
    )
  }

  const pluginName = plugin.name
  const res = plugin(this, ...args)
  this.apply.emit(res)
  this.$plugins[pluginName] = res
}

// If the audio source is loaded that's can play
function loaded(this: Manager) {
  return this.$loaded
}

// Connect audio node
function registrar(this: Manager, registrar: AudioNodeWrap) {
  if (__DEV__) {
    assert(typeof registrar === 'function', '`registrar` is not a function.')
  }

  const wrap = { fn: registrar }
  this.registrar.emit(wrap)
  const fn = wrap.fn(this.$context)

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

function connect(this: Manager) {
  // We need collect nodes to use when disconnected
  let prevNode: AudioNode | null = null
  const ctx = this.$context.audioContext
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

  // connect nodes
  for (let i = nodes.length - 2; i === 0; i--) {
    const curNode = nodes[i]
    if (!curNode) break
    ;((prevNode as unknown) as AudioNode).connect(curNode)
    prevNode = curNode
  }

  // stash nodes
  this.audioNodes = nodes
}

function disconnect(this: Manager) {
  if (this.audioNodes.length > 0) {
    for (const node of this.audioNodes) {
      node.disconnect()
    }
    this.disconnect.emit()
  }
}

export class Manager {
  private $options: ManagerOptions
  public $model: Model = 'void'
  public $loaded = false
  public audioNodes: AudioNode[] = []
  public nodes = new Set<AudioNodeFn>()
  public $context = createContext(this)
  public $plugins: { [key: string]: any } = {}

  // methods
  public apply = extend(apply)
  public close = extend(close)
  public loaded = extend(loaded)
  public connect = extend(connect)
  public registrar = extend(registrar)
  public disconnect = extend(disconnect)

  constructor(options: ManagerOptions) {
    this.$options = checkOptions(options)
  }
}
