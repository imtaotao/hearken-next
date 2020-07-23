import { SHORT_PLAYER } from './symbols'
import { Manager } from '../manager/runtime'
import { extend, ExtendEvent } from 'src/shared/eventEmitter'

interface ShortOptions {}

export interface SPlayer {
  type: Symbol
  manager: Manager
  context: Manager['context']
  options: ShortOptions
}

export function ShortPlayer(manager: Manager, options: ShortOptions = {}) {
  const { context } = manager
  return {
    manager,
    context,
    options,
    type: SHORT_PLAYER,
  } as SPlayer
}
