import { LPlayer } from './longPlayer'
import { EXPAND_PLAYER } from './symbols'
import { Manager } from '../manager/runtime'

interface ExpandOptions {}

export interface ExpandPlugin {
  type: Symbol
  manager: Manager
  context: Manager['context']
  options: ExpandOptions
}

export function ExpandPlayer(manager: Manager, options: ExpandOptions = {}) {
  const { context } = manager
  return {
    manager,
    context,
    options,
    type: EXPAND_PLAYER,
  } as ExpandPlugin
}
