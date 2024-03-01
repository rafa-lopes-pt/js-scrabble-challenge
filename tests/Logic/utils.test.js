import { describe, it, expect } from 'vitest'
import { isSequence, randomizer } from '../../src/Logic/utils'
import { COLORS } from '../../src/Logic/player'

describe('randomizer()', () => {
  it('Should return a different value from the provided list', () => {
    const color = COLORS[0]
    const nColor = randomizer(COLORS, color)
    expect(nColor).not.toBe(color)
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
