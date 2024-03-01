import { describe, it, expect, beforeAll } from 'vitest'
import { Rack } from '../../src/Logic/player'

describe('class Rack', () => {
  const rack = new Rack()
  const TEST_TILE = { points: 2 }
  const TEST_TILE_2 = { points: 3 }

  describe('add(', () => {
    it('Should return true if an element was successfully added', () => {
      expect(rack.add(TEST_TILE)).toBeTruthy()
    })

    it('Should  add a new item at the first empty position', () => {
      expect(rack.map((e) => e)[0]).toEqual(TEST_TILE)
    })

    it('Should always return length = 7', () => {
      const r = new Rack()
      let a = false
      while (!a) {
        expect(r.length).toBe(7)
        a = r.add(TEST_TILE)
      }
    })

    it("Should return false  if can't add more items", () => {
      rack.add(TEST_TILE)
      rack.add(TEST_TILE)
      rack.add(TEST_TILE)
      rack.add(TEST_TILE)
      rack.add(TEST_TILE)
      rack.add(TEST_TILE)
      expect(rack.add(TEST_TILE)).toBeFalsy
    })
  })

  it('Should get the sum of all the Tile points', () => {
    expect(rack.points).toEqual(14)
    rack.remove(4)
    expect(rack.points).toEqual(12)
  })

  describe('remove()', () => {
    it('Should always return length = 7', () => {
      const r = new Rack()
      let a = false
      for (let i = 0; i < 7; i++) {
        expect(r.length).toBe(7)
        r.remove(i)
      }
    })

    it('Should return true if element was found and removed', () => {
      expect(rack.remove(0)).toBeTruthy()
    })

    it('Should return false if element was not found', () => {
      expect(rack.remove(9)).toBeFalsy()
    })
  })

  it('isEmpty should return true if all items are null', () => {
    expect(rack.isEmpty).toBeTruthy
    rack.add(TEST_TILE)
    expect(rack.isEmpty).toBeFalsy
  })

  it('isIncomplete should return true if at least one item is null', () => {
    expect(rack.isIncomplete).toBeTruthy
    let a = false
    while (!a) {
      a = rack.add(TEST_TILE)
    }
    expect(rack.isIncomplete).toBeFalsy
  })

  it('clear() Should remove all the tiles from the array', () => {
    expect(rack.isEmpty).toBeFalsy
    rack.clear()
    expect(rack.isEmpty).toBeTruthy
  })

  describe('shuffle()', () => {
    it("Should  shuffle the rack's contents", () => {
      rack.add(1)
      rack.add(2)
      rack.add(3)
      rack.add(4)
      rack.add(5)
      rack.add(6)
      rack.add(7)

      const originalArr = [1, 2, 3, 4, 5, 6, 7]
      rack.shuffle()

      expect(rack.map((e) => e)).not.toEqual(originalArr)
    })
  })
})
