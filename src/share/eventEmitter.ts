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
      const currentListeners = this.liseners[eventName]
      currentListeners.splice(currentListeners.indexOf(callback))
    }
    this.on(eventName, callOnce)
  }
  emit(eventName: string, ...data: any[]) {
    const currentListeners = this.liseners[eventName]
    if (!currentListeners || currentListeners.length === 0) {
      return null
    }
    this.liseners[eventName].map(item => {
      setTimeout(() => {
        item(...data)
      })
    })
    return true
  }
}

export const eventEmitter = new EventEmitter()
