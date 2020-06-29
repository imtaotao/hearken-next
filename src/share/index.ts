export const EMPTY_OBJ: { readonly [key: string]: any } = __DEV__
  ? Object.freeze({})
  : {}

export const EMPTY_ARR: [] = []

export const NOOP = () => {}

export function warn(message: string, isWarning?: boolean) {
  message = `\n[Hearken warning]: ${message}\n\n`
  if (isWarning) {
    if (__DEV__) {
      console.warn(message)
    }
    return
  }
  throw new Error(message)
}

export function assert(condition: boolean, error: string) {
  if (!condition) warn(error)
}

export function isVoid(val) {
  return val === null || val === undefined
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

export function once<T extends (...args: Array<unknown>) => unknown>(fn: T) {
  let first = true
  function wrap(...args) {
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
