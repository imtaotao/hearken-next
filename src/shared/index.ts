const warnPrefix = '\n\n[Hearken warning]'

const dealWithError = (
  error: string | Error,
  fn: (val: string | Error, isString: boolean) => void,
) => {
  if (typeof error === 'string') {
    error = `${warnPrefix}: ${error}\n\n`
    fn(error, true)
  } else if (error instanceof Error) {
    if (!error.message.startsWith(warnPrefix)) {
      error.message = `${warnPrefix}: ${error.message}`
    }
    fn(error, false)
  }
}

export const EMPTY_OBJ: { readonly [key: string]: any } = __DEV__
  ? Object.freeze({})
  : {}

export const NOOP = () => {}

export function warn(msg: string | Error) {
  if (__DEV__) {
    dealWithError(msg, (nv, isString) => {
      console.warn(isString ? nv : (nv as Error).message)
    })
  }
}

export function error(error: string | Error) {
  dealWithError(error, (nv, isString) => {
    if (isString) {
      throw new Error(nv as string)
    } else {
      throw nv
    }
  })
}

export function assert(condition: any, msg: string | Error) {
  if (!condition) {
    error(msg)
  }
}

export function isVoid(val: unknown) {
  return val === null || val === undefined
}

export function isAudioBuffer(val: unknown) {
  return Object.prototype.toString.call(val) === '[object AudioBuffer]'
}

export function isAudioNode(val: AudioNode) {
  return /\[object\s{1}.*Node\]/.test(Object.prototype.toString.call(val))
}

export function remove<T>(list: Array<T>, el: T) {
  const i = list.indexOf(el)
  if (~i) {
    list.splice(i, 1)
  }
}

export function last<T>(list: Array<T>, i = 1) {
  return list[list.length - i]
}

export function range(min: number, max: number, val: number) {
  return Math.max(Math.min(val, max), min)
}

export function toNumber(val: any) {
  const n = parseFloat(val)
  return isNaN(n) ? val : n
}

export function once<T extends (...args: Array<any>) => any>(fn: T) {
  let first = true
  function wrap(this: any, ...args: Array<any>) {
    if (!first) return
    first = false
    return fn.apply(this, args)
  }
  return wrap as T
}

export function mapObject<T, K extends (key: keyof T, val: unknown) => any>(
  obj: T,
  callback: K,
) {
  const result: { [key in keyof T]: ReturnType<K> } = {} as any

  for (const key in obj) {
    result[key] = callback(key, obj[key])
  }
  return result
}
