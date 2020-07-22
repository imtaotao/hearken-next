import { Long } from './plugins/long'
import { Manager } from './manager/runtime'
import { EventEmitter } from './shared/eventEmitter'

const Hearken = {
  Long,
  Manager,
  Event: EventEmitter,
}

export { Long, Manager, EventEmitter as Event, Hearken as default }
