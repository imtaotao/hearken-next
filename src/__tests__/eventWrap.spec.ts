import { wrapIt, EventEmitter } from '../shared/eventEmitter'

class Manager {
  connect: EventEmitter
}

describe('test wrapit EventEmitter', () => {
  let manager: Manager
  beforeEach(() => {
    class Manager {
      connect = wrapIt(function() {})
    }
    manager = new Manager()
  })

  test('test "on" functionality', done => {
    let counter = 0
    manager.connect.on(() => {
      counter++
      // test repeatibility
      if (counter === 2) {
        done()
      }
    })
    manager.connect.emit()
    manager.connect.emit()
  })

  test('test "once" functionality', done => {
    manager.connect.once(() => {})
    expect(manager.connect.emit()).toEqual(true)
    setTimeout(() => {
      expect(manager.connect.emit()).toEqual(false)
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
  test('test callback fn parameter', done => {
    const testParam1 = 'ok'
    const testParam2 = 1
    const test = (param1: string, param2: number) => {
      expect(param1).toEqual(testParam1)
      expect(param2).toEqual(testParam2)
      done()
    }
    manager.connect.on(test)
    expect(manager.connect.emit(testParam1, testParam2)).toEqual(true)
  })
})
