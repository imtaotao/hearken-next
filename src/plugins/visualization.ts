import { warn } from 'src/shared'
import { VISUALIZATION } from './symbols'
import { Manager } from '../manager/runtime'
import { createAnalyser } from '../shared/audio'
import { extend, ExtendEvent } from 'src/shared/eventEmitter'

interface VisualizationOptions {
  fftSize?: number
}

export interface VisualizationPlugin {
  type: Symbol
  manager: Manager
  context: Manager['context']
  options: VisualizationOptions
}

export function getData(this: VisualizationPlugin) {
  // console.log(analyserNode);
}

export function Visualization(
  manager: Manager,
  options: VisualizationOptions = {},
) {
  let analyserNode: AnalyserNode
  const { context } = manager

  context.registrar(() => {
    return () => {
      analyserNode = createAnalyser(context.audioContext, options.fftSize || 16)
      return analyserNode
    }
  })

  return {
    manager,
    context,
    options,
    type: VISUALIZATION,
    getData: extend(() => {
      if (!analyserNode) {
        if (__DEV__) {
          warn(
            '"analyserNode" not exist, maybe you need use `manager.context.connect()` to connect audio nodes',
          )
        }
        return []
      }
      const data = new Uint8Array(analyserNode.frequencyBinCount)
      analyserNode.getByteFrequencyData(data)
      return data
    }),
  } as VisualizationPlugin
}
