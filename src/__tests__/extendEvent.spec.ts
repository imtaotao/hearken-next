import { extend, EventEmitter } from '../shared/eventEmitter'

class Manager {
  connect: EventEmitter
}

describe('test extendEvent EventEmitter', () => {
  let manager: Manager
  beforeEach(() => {
    class Manager {
      connect = extend(function () {})
    }
    manager = new Manager()
  })

  test('test "on" functionality', () => {
    let counter = 0
    manager.connect.on(() => {
      counter++
    })
    manager.connect.emit()
    manager.connect.emit()
    expect(counter).toBe(2)
  })

  test('test "once" functionality', (done) => {
    manager.connect.once(() => {})
    expect(manager.connect.emitAsync()).toEqual(true)
    setTimeout(() => {
      expect(manager.connect.emitAsync()).toEqual(false)
      done()
    }, 1000)
  })

  test('remove error eventName', () => {
    expect(manager.connect.remove(() => {})).toEqual(false)
  })

  test('remove error fn', () => {
    manager.connect.on(() => {})
    expect(manager.connect.remove(() => {})).toEqual(false)
  })

  test('test "remove" functionality', () => {
    const test1 = () => {}
    const test2 = () => {}
    manager.connect.on(test1)
    manager.connect.on(test2)
    expect(manager.connect.emit()).toEqual(true)
    expect(manager.connect.remove(test1)).toEqual(true)
    expect(manager.connect.emit()).toEqual(true)
    expect(manager.connect.remove(test2)).toEqual(true)
    expect(manager.connect.emit()).toEqual(false)
  })

  test('test "removeAll" functionality', () => {
    const test1 = () => {}
    const test2 = () => {}
    manager.connect.on(test1)
    manager.connect.on(test2)
    expect(manager.connect.emit()).toEqual(true)
    expect(manager.connect.removeAll()).toEqual(true)
    expect(manager.connect.emit()).toEqual(false)
  })
  test('test callback fn parameter', (done) => {
    const testParam1 = 'ok'
    const testParam2 = 1
    const test = (param1: string, param2: number) => {
      expect(param1).toEqual(testParam1)
      expect(param2).toEqual(testParam2)
      done()
    }
    manager.connect.on(test)
    expect(manager.connect.emitAsync(testParam1, testParam2)).toEqual(true)
  })
})
