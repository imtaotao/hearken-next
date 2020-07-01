import { assert } from './index'

type listenerType = Set<Function>

const assertListener = (liseners: listenerType) =>
  !liseners || liseners.size === 0

export class EventEmitter {
  _liseners: listenerType = new Set()

  on(callback: Function) {
    if (__DEV__) {
      assert(typeof callback === 'function', '`Callback` must be a function')
    }
    this._liseners.add(callback)
  }

  once(callback: Function) {
    if (__DEV__) {
      assert(typeof callback === 'function', '`Callback` must be a function')
    }
    const callOnce = () => {
      callback()
      this.remove(callOnce)
    }
    this.on(callOnce)
  }

  emit(...data: any[]) {
    if (__DEV__) {
      if (assertListener(this._liseners)) {
        return false
      }
    }
    this._liseners.forEach(fn => {
      setTimeout(() => fn(...data))
    })
    return true
  }

  remove(fn: Function) {
    if (__DEV__) {
      assert(typeof fn === 'function', 'Remove `fn` must be a function')
      if (assertListener(this._liseners)) {
        return false
      }
    }
    return this._liseners.delete(fn)
  }

  removeAll() {
    this._liseners.clear()
    return true
  }
}

const installMethods = ['on', 'once', 'emit', 'remove', 'removeAll']

export function extendEvent<T>(obj: T): T & EventEmitter {
  const undertake = {}
  const bus = new EventEmitter()
  const proto = Reflect.getPrototypeOf(bus)
  const destProto = Reflect.getPrototypeOf(obj as Object)

  for (const key in bus) {
    ;(obj as any)[key] = (bus as any)[key]
  }

  for (const key of installMethods) {
    ;(undertake as any)[key] = (proto as any)[key]
  }

  Reflect.setPrototypeOf(obj as Object, undertake)
  Reflect.setPrototypeOf(undertake, destProto)

  return obj as T & EventEmitter
}
