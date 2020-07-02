import { createContext } from './context'
import { extendEvent } from '../shared/eventEmitter'

interface ManagerOptions {}

type PluginNode = () => void

// connect audio node
function connect(node: PluginNode) {
  console.log(node)
}

export class Manager {
  private options: ManagerOptions
  public context = createContext(this)
  public connect = extendEvent(connect)

  constructor(options: ManagerOptions) {
    this.options = options
  }
}
