import { VISUALIZATION } from './symbols'
import { Manager } from '../manager/runtime'
import { extend, ExtendEvent } from 'src/shared/eventEmitter'

interface VisualizationOptions {}

export interface VisualizationPlugin {
  type: Symbol
  manager: Manager
  context: Manager['context']
  options: VisualizationOptions
}

export function Visualization(
  manager: Manager,
  options: VisualizationOptions = {},
) {
  const { context } = manager
  return {
    manager,
    context,
    options,
    type: VISUALIZATION,
  } as VisualizationPlugin
}
