import { noThrow } from '../testUtils'
import {
  warn,
  NOOP,
  assert,
  isVoid,
  remove,
  toNumber,
  once,
  mapObject,
  isAudioBuffer,
  EMPTY_OBJ,
} from '../shared/index'

describe('test utils methods', () => {
  beforeEach(() => {
    console.log = NOOP
    console.warn = NOOP
  })

  test('test "warn" functionality', () => {
    expect(() => warn('')).toThrow()
    expect(noThrow(() => warn('', true))).toBe(true)
  })

  test('test "assert" functionality', () => {
    expect(() => assert(false, '')).toThrow()
    expect(noThrow(() => assert(true, ''))).toBe(true)
  })

  test('test "isVoid" functionality', () => {
    expect(isVoid(null)).toBe(true)
    expect(isVoid(undefined)).toBe(true)
    expect(isVoid(false)).toBe(false)
    expect(isVoid('')).toBe(false)
    expect(isVoid(0)).toBe(false)
  })

  test('test "remove" functionality', () => {
    const list = [1, 2, 3]
    remove(list, 3)
    expect(list).toEqual([1, 2])
    remove(list, 3)
    expect(list).toEqual([1, 2])
  })

  test('test "toNumber" functionality', () => {
    expect(toNumber(1)).toBe(1)
    expect(toNumber(1.0)).toBe(1)
    expect(toNumber(1.1)).toBe(1.1)
    expect(toNumber('1')).toBe(1)
    expect(toNumber('1.0')).toBe(1)
    expect(toNumber('1.1')).toBe(1.1)
    expect(toNumber(NaN)).toBeNaN()
    expect(toNumber('')).toBe('')
  })

  test('test "once" functionality', () => {
    const fnSpy = jest.fn()
    const fn = once(fnSpy)
    fn(1, 2)
    fn(1, 2)
    expect(fnSpy.mock.calls.length).toBe(1)
    expect(fnSpy.mock.calls[0]).toEqual([1, 2])

    const ctx = {}
    const checkCtx = once(function() {
      expect(this).toBe(ctx)
    })
    checkCtx.call(ctx)
  })

  test('test "mapObject" functionality', () => {
    const obj = {
      a: 1,
      b: 2,
    }
    const cloned = mapObject(obj, (key, val) => `${key}_${val}`)
    expect(cloned).toEqual({
      a: 'a_1',
      b: 'b_2',
    })
  })

  test('test "isAudioBuffer" functionality', () => {
    expect(isAudioBuffer(1)).toBe(false)
    expect(isAudioBuffer('')).toBe(false)
  })

  test('test "EMPTY_OBJ" object', () => {
    expect(EMPTY_OBJ).toEqual({})
    expect(() => ((EMPTY_OBJ as { a: number }).a = 1)).toThrow()
  })
})
