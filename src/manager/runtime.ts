import { assert } from '../shared/index'
import { createContext } from './context'
import { extend, ExtendEvent } from 'src/shared/eventEmitter'

interface ManagerOptions {}

type Model = 'link' | 'buffer' | 'void'

// Need filter manager options
function checkOptions(options: ManagerOptions) {
  return options || {}
}

// Close audio context, free up resources
function close(this: Manager): Promise<void> {
  if (__DEV__) {
    assert(
      !this.closed,
      'Current audioContext has been closed, ' +
        'you need to create a new manager.',
    )
  }

  const ctx = this.context
  return ctx.audioContext.close().then(() => {
    ctx.nodes.clear()
    ctx.audioNodes.length = 0
    ctx._canplay = false

    // Remove all listener, except for `init`
    ctx.canplay.removeAll()
    ctx.connect.removeAll()
    ctx.registrar.removeAll()
    ctx.disconnect.removeAll()

    this.closed = true
    this.close.emit()
    this.close.removeAll()
  })
}

export class Manager {
  private options: ManagerOptions
  public closed = false
  public model: Model = 'void'
  public context = createContext(this)
  public init: ExtendEvent<Function>
  public close: ExtendEvent<() => Promise<void>>
  public plugins: { [key: string]: any } = {}

  constructor(options: ManagerOptions) {
    this.options = checkOptions(options)
    this.close = extend(close)

    // All plugins register event should in init method
    this.init = extend(function (this: Manager) {
      this.init.emit()
    })
  }

  // Install plugin
  public apply(plugin: Function, ...args: any[]) {
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
    this.plugins[pluginName] = plugin(this, ...args)
  }
}
