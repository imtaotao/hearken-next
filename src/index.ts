import { Manager } from './manager/runtime'
import { EventEmitter } from './shared/eventEmitter'

const Hearken = {
  Manager,
  Event: EventEmitter,
}

export { Manager, EventEmitter as Event, Hearken as default }
