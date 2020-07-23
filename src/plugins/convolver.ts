import { CONVOLVER } from './symbols'
import { Manager } from '../manager/runtime'
import { extend, ExtendEvent } from 'src/shared/eventEmitter'

interface ConvolverOptions {}

export interface ConvolverPlugin {
  type: Symbol
  manager: Manager
  context: Manager['context']
  options: ConvolverOptions
}

export function Convolver(manager: Manager, options: ConvolverOptions = {}) {
  const { context } = manager
  return {
    manager,
    context,
    options,
    type: CONVOLVER,
  } as ConvolverPlugin
}
