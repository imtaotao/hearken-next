import { EventEmitter } from '../shared/eventEmitter'

describe('test EventEmitter', () => {
  const eventEmitter = new EventEmitter()

  test('test "on" functionality', done => {
    let counter = 0
    eventEmitter.on('jest', () => {
      counter++
      // test repeatibility
      if (counter === 2) {
        done()
      }
    })
    eventEmitter.emit('jest')
    eventEmitter.emit('jest')
  })

  test('test "once" functionality', done => {
    eventEmitter.once('once', () => {})
    expect(eventEmitter.emit('once')).toEqual(true)
    setTimeout(() => {
      expect(eventEmitter.emit('once')).toEqual(false)
      done()
    }, 1000)
  })

  test('remove error eventName', () => {
    expect(eventEmitter.remove('test eventName', () => {})).toEqual(false)
  })

  test('remove error fn', () => {
    eventEmitter.on('test fn', () => {})
    expect(eventEmitter.remove('test fn', () => {})).toEqual(false)
  })

  test('test "remove" functionality', () => {
    const test1 = () => {}
    const test2 = () => {}
    eventEmitter.on('test remove', test1)
    eventEmitter.on('test remove', test2)
    expect(eventEmitter.emit('test remove')).toEqual(true)
    expect(eventEmitter.remove('test remove', test1)).toEqual(true)
    expect(eventEmitter.emit('test remove')).toEqual(true)
    expect(eventEmitter.remove('test remove', test2)).toEqual(true)
    expect(eventEmitter.emit('test remove')).toEqual(false)
  })

  test('test "removeAll" functionality', () => {
    const test1 = () => {}
    const test2 = () => {}
    eventEmitter.on('test removeAll', test1)
    eventEmitter.on('test removeAll', test2)
    expect(eventEmitter.emit('test removeAll')).toEqual(true)
    expect(eventEmitter.removeAll('test removeAll')).toEqual(true)
    expect(eventEmitter.emit('test removeAll')).toEqual(false)
  })
})
