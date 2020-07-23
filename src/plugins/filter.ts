import { FILTER } from './symbols'
import { Manager } from '../manager/runtime'

interface FilterOptions {}

export interface FilterPlugin {
  type: Symbol
  manager: Manager
  context: Manager['context']
  options: FilterOptions
}

export function Filter(manager: Manager, options: FilterOptions = {}) {
  const { context } = manager
  return {
    manager,
    context,
    options,
    type: FILTER,
  } as FilterPlugin
}
