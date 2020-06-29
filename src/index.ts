import * as _ from './share/index'

export const sum = (num1: number, num2: number) => {
  if (__DEV__) {
    console.log('test')
  }

  return num1 + num2
}

export const u = _
