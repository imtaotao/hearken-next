import { PANNER } from './symbols'
import { Manager } from '../manager/runtime'
import { extend, ExtendEvent } from 'src/shared/eventEmitter'

interface PannerOptions {}

export interface PannerPlugin {
  type: Symbol
  manager: Manager
  context: Manager['context']
  options: PannerOptions
}

export function Panner(manager: Manager, options: PannerOptions = {}) {
  const { context } = manager
  return {
    manager,
    context,
    options,
    type: PANNER,
  } as PannerPlugin
}
