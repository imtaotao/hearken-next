export const EMPTY_OBJ: { readonly [key: string]: any } = __DEV__
  ? Object.freeze({})
  : {}

export const NOOP = () => {}

export function warn(message: string, isWarning?: boolean) {
  message = `\n[Hearken warning]: ${message}\n\n`
  if (isWarning) {
    if (__DEV__) console.warn(message)
    return
  }
  throw new Error(message)
}

export function assert(condition: boolean, error: string) {
  if (!condition) {
    if (__DEV__) warn(error)
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
