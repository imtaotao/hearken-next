import { assert } from '../shared/index'
import { createContext } from './context'

interface ManagerOptions {}

type Model = 'link' | 'buffer' | 'void'

// Need filter manager options
function checkOptions(options: ManagerOptions) {
  return options || {}
}

export class Manager {
  private options: ManagerOptions
  public model: Model = 'void'
  public context = createContext(this)
  public plugins: { [key: string]: any } = {}

  constructor(options: ManagerOptions) {
    this.options = checkOptions(options)
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
