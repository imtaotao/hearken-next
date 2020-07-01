type listenerType = Set<Function>
export class EventEmitter {
  private liseners: listenerType = new Set()

  private checkListenerEmpty() {
    if (!this.liseners || this.liseners.size === 0) {
      return true
    }
    return false
  }

  on(callback: Function) {
    this.liseners.add(callback)
  }

  once(callback: Function) {
    const callOnce = () => {
      callback()
      this.remove(callOnce)
    }
    this.on(callOnce)
  }

  emit(...data: any[]) {
    if (this.checkListenerEmpty()) {
      return false
    }
    this.liseners.forEach(item => {
      setTimeout(() => {
        item(...data)
      })
    })
    return true
  }

  remove(fn: Function) {
    if (this.checkListenerEmpty()) {
      return false
    }
    return this.liseners.delete(fn)
  }

  removeAll() {
    this.liseners = new Set()
    return true
  }
}
