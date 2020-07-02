import { createContext } from './context'
import { isVoid, assert } from '../shared/index'
import { extendEvent } from '../shared/eventEmitter'

interface ManagerOptions {}

type Model = 'link' | 'buffer' | 'void'
type PluginNode = () => void

// Need filter manager options
function checkOptions(options: ManagerOptions) {
  return options || {}
}

// Connect audio node
function connect(this: Manager, node: PluginNode) {
  console.log(node)
}

// Close audio context, free up resources
function close(this: Manager): Promise<void> {
  const audioCtx = this.$context.audioCtx
  if (__DEV__) {
    assert(
      !audioCtx.$isClosed,
      'Current audioContext has been closed,' +
        ' you need to create a new manager.',
    )
  }
  return audioCtx.close().then(() => {
    audioCtx.$isClosed = true
    // emit close event
    this.close.emit()
  })
}

// Install plugin
function apply(this: Manager, plugin: Function, ...args: any[]) {
  if (__DEV__) {
    assert(typeof plugin === 'function', 'The plugin should be a function.')
    assert(!isVoid(plugin.name), 'The plugin needs to specify a name.')
  }

  const pluginName = plugin.name
  this.$plugins[pluginName] = plugin(this, ...args)
}

function loaded(this: Manager) {
  return this.$loaded
}

export class Manager {
  private $options: ManagerOptions
  public $model: Model = 'void'
  public $loaded = false
  public nodes = new Set<Function>()
  public $plugins: { [key: string]: any } = {}
  public $context = createContext(this)

  // methods
  public apply = apply
  public connect = extendEvent(connect)
  public close = extendEvent(close)
  public loaded = extendEvent(loaded)

  constructor(options: ManagerOptions) {
    this.$options = checkOptions(options)
  }
}
