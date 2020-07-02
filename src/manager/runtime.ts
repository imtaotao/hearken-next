import { createContext } from './context'
import { isVoid, assert } from '../shared/index'
import { extendEvent } from '../shared/eventEmitter'

interface ManagerOptions {}

type Model = 'link' | 'buffer' | 'void'
type AudioNodeFn = (audioNode: AudioNode) => AudioNode
type AudioNodeWrap = (manager: Manager['$context']) => AudioNodeFn

// Need filter manager options
function checkOptions(options: ManagerOptions) {
  return options || {}
}

// Connect audio node
function connect(this: Manager, registrar: AudioNodeWrap) {
  if (__DEV__) {
    assert(typeof registrar === 'function', '`registrar` is not a function.')
  }

  const fn = registrar(this.$context)
  if (__DEV__) {
    assert(
      typeof fn === 'function',
      'The registrar should return a function, ' +
        'like this: \n\n' +
        `
          manager.connect(context => {
            return audioNode => {
              context.AudioContext.createBiquadFilter()
            }
          })
        `,
    )
  }
  this.nodes.add(fn)
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
  this.$plugins[pluginName] = plugin(this, ...args)
}

// If the audio source is loaded that's can play
function loaded(this: Manager) {
  return this.$loaded
}

export class Manager {
  private $options: ManagerOptions
  public $model: Model = 'void'
  public $loaded = false
  public nodes = new Set<AudioNodeFn>()
  public $context = createContext(this)
  public $plugins: { [key: string]: any } = {}

  // methods
  public apply = apply
  public connect = extendEvent(connect)
  public close = extendEvent(close)
  public loaded = extendEvent(loaded)

  constructor(options: ManagerOptions) {
    this.$options = checkOptions(options)
  }
}
