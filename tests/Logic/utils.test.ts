import { describe, it, expect } from 'vitest'
import { isEqual, isSequence, random } from '../../src/Logic/utils'
import { COLORS } from '../../src/Logic/types/player/player-utils'
import Cell from '../../src/Logic/types/board/Cell'

describe('random()', () => {
  it('Should return a different value from the provided list', () => {
    const color = COLORS[0]
    for (let n = 0; n < 5000; n++) {
      const nColor = random(COLORS, color)
      expect(nColor).not.toBe(color)
    }
  })
})

describe('isSequence()', () => {
  it('Should return true if all numbers are in a sequence', () => {
    expect(isSequence([1, 2, 3, 4])).toBeTruthy()
    expect(isSequence([-1, 0, 1, 2, 3, 4])).toBeTruthy()
    expect(isSequence([10, 11, 12, 13])).toBeTruthy()
    expect(isSequence([1, 3, 4])).toBeFalsy()
  })
  it('Should return false if the provided arr has less than 2 items', () => {
    expect(isSequence([1])).toBeFalsy()
  })
})

describe('isEqual()', () => {
  it('Should for native types', () => {
    expect(isEqual(1, 1)).toBeTruthy()
    // expect(isEqual('1', 1)).toBeFalsy() -> TS ERROR
    expect(isEqual('A', 'A')).toBeTruthy()
    expect(isEqual(false, false)).toBeTruthy()
  })

  it('Should work for complex data structures', () => {
    expect(isEqual({ a: 1 }, { a: 1 })).toBeTruthy()
    expect(isEqual({ a: 1 }, { a: 2 })).toBeFalsy()
    expect(isEqual([1, 2, 3, 4], [1, 2, 3, 4])).toBeTruthy()
    expect(
      isEqual({ '1': 1, '2': 2, '3': 3, '4': 4 }, [1, 2, 3, 4])
    ).toBeFalsy()
    expect(isEqual({ a: { b: { c: 1 } } }, { a: { b: { c: 1 } } })).toBeTruthy()

    expect(isEqual({ a: '' }, {})).toBeFalsy()
    expect(isEqual({}, {})).toBeTruthy()

    expect(
      new Cell(1, 1, { letter: 'A', points: 1 }).isEqual(
        new Cell(1, 1, { letter: 'A', points: 1 })
      )
    ).toBeTruthy()

    expect(
      new Cell(1, 1, { letter: 'A', points: 1 }).isEqual(
        new Cell(1, 2, { letter: 'A', points: 1 })
      )
    ).toBeFalsy()
    expect(
      new Cell(1, 1, { letter: 'A', points: 1 }).isEqual(
        new Cell(1, 1, { letter: 'B', points: 1 })
      )
    ).toBeFalsy()
  })

  it('Should work with undefined/nullish values', () => {
    expect(isEqual(null, null)).toBeTruthy()
    expect(isEqual(undefined, undefined)).toBeTruthy()
    expect(isEqual(undefined, null)).toBeFalsy()
    expect(isEqual(undefined, false)).toBeFalsy()
    expect(isEqual(null, false)).toBeFalsy()
    expect(isEqual(null, {})).toBeFalsy()
  })
})
