class EventEmitter {
  private liseners: { [eventName: string]: Function[] } = {}
  on(eventName: string, callback: Function) {
    if (this.liseners[eventName]) {
      this.liseners[eventName].push(callback)
    } else {
      this.liseners[eventName] = [callback]
    }
  }

  once(eventName: string, callback: Function) {
    const callOnce = () => {
      callback()
      this.remove(eventName, callOnce)
    }
    this.on(eventName, callOnce)
  }
  private checkListenerEmpty(listeners: any[]) {
    if (!listeners || listeners.length === 0) {
      return true
    }
    return false
  }
  emit(eventName: string, ...data: any[]) {
    const currentListeners = this.liseners[eventName]
    if (this.checkListenerEmpty(currentListeners)) {
      return false
    }
    this.liseners[eventName].map(item => {
      setTimeout(() => {
        item(...data)
      })
    })
    return true
  }
  remove(eventName: string, fn: Function) {
    const currentListeners = this.liseners[eventName]
    if (this.checkListenerEmpty(currentListeners)) {
      return false
    }
    const fnIndex = currentListeners.indexOf(fn)
    if (!~fnIndex) {
      return false
    }
    currentListeners.splice(fnIndex, 1)
    return true
  }
  removeAll(eventName: string) {
    this.liseners[eventName] = []
    return true
  }
}

export const eventEmitter = new EventEmitter()
