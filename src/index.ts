import { Filter } from './plugins/filter'
import { Panner } from './plugins/panner'
import { Manager } from './manager/runtime'
import { Convolver } from './plugins/convolver'
import { LongPlayer } from './plugins/longPlayer'
import { ShortPlayer } from './plugins/shortPlayer'
import { EventEmitter } from './shared/eventEmitter'
import { ExpandPlayer } from './plugins/expandPlayer'
import { Visualization } from './plugins/visualization'

const Hearken = {
  Filter,
  Panner,
  Convolver,
  LongPlayer,
  ShortPlayer,
  ExpandPlayer,
  Visualization,
  Manager,
  Event: EventEmitter,
}

export {
  Filter,
  Panner,
  Convolver,
  LongPlayer,
  ShortPlayer,
  ExpandPlayer,
  Visualization,
  Manager,
  EventEmitter as Event,
  Hearken as default,
}
