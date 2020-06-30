import { eventEmitter } from '../share/eventEmitter'

describe('test EventEmitter', () => {
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
  test('test "once" functionality', () => {
    eventEmitter.on('once', () => {
      console.log('once')
    })
    expect(eventEmitter.emit('once')).toEqual(true)
    setTimeout(() => {
      expect(eventEmitter.emit('once')).toEqual(false)
    }, 1000)
  })
})
