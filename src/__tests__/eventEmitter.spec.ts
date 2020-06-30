import { eventEmitter } from '../share/eventEmitter'
import { doesNotMatch } from 'assert'

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
  test('test "once" functionality', done => {
    eventEmitter.once('once', () => {
      console.log('once')
    })
    expect(eventEmitter.emit('once')).toEqual(true)
    setTimeout(() => {
      expect(eventEmitter.emit('once')).toEqual(false)
      done()
    }, 1000)
  })
  test('remove error eventName', () => {
    expect(eventEmitter.remove('test', () => {})).toEqual(false)
  })
  test('remove error fn', () => {
    eventEmitter.on('test', () => {})
    expect(eventEmitter.remove('test', () => {})).toEqual(false)
  })
  test('test "remove" functionality', () => {
    const test1 = () => {}
    const test2 = () => {}
    eventEmitter.on('test', test1)
    eventEmitter.on('test', test2)
    expect(eventEmitter.emit('test')).toEqual(true)
    expect(eventEmitter.remove('test', test1)).toEqual(true)
    expect(eventEmitter.emit('test')).toEqual(true)
    expect(eventEmitter.remove('test', test2)).toEqual(true)
    expect(eventEmitter.emit('test')).toEqual(false)
  })
  test('test "removeAll" functionality', () => {
    const test1 = () => {}
    const test2 = () => {}
    eventEmitter.on('test', test1)
    eventEmitter.on('test', test2)
    expect(eventEmitter.emit('test')).toEqual(true)
    expect(eventEmitter.removeAll('test')).toEqual(true)
    expect(eventEmitter.emit('test')).toEqual(false)
  })
})
