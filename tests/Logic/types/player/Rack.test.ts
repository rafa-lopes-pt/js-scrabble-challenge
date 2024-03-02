import { describe, it, expect, beforeAll } from 'vitest'
import Rack from '../../../../src/Logic/types/player/Rack'
import TileOnBoard from '../../../../src/Logic/types/tiles/TileOnBoard'
import TileType from '../../../../src/Logic/types/tiles/Tile'
import { TEST_HORIZONTAL_TILES } from '../../../TEST_DATA'
describe('class Rack', () => {
  const rack = new Rack()

  describe('add(', () => {
    it('Should return true if an element was successfully added', () => {
      expect(rack.add(TEST_HORIZONTAL_TILES.A)).toBeTruthy()
    })

    it('Should  add a new item at the first empty position', () => {
      expect(rack.map((e) => e)[0]).toEqual(TEST_HORIZONTAL_TILES.A)
    })

    it('Should always return length = 7', () => {
      const r = new Rack()
      let a = false
      while (!a) {
        expect(r.length).toBe(7)
        a = r.add(TEST_HORIZONTAL_TILES.A)
      }
    })

    it("Should return false  if can't add more items", () => {
      rack.add(TEST_HORIZONTAL_TILES.A)
      rack.add(TEST_HORIZONTAL_TILES.A)
      rack.add(TEST_HORIZONTAL_TILES.A)
      rack.add(TEST_HORIZONTAL_TILES.A)
      rack.add(TEST_HORIZONTAL_TILES.A)
      rack.add(TEST_HORIZONTAL_TILES.A)
      expect(rack.add(TEST_HORIZONTAL_TILES.A)).toBeFalsy()
    })
  })

  it('Should get the sum of all the Tile points', () => {
    expect(rack.points).toEqual(7)
    rack.remove(4)
    expect(rack.points).toEqual(6)
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
    const r = new Rack()
    expect(r.isEmpty).toBeTruthy()
    r.add(TEST_HORIZONTAL_TILES.A)
    expect(r.isEmpty).toBeFalsy()
  })

  it('isIncomplete should return true if at least one item is null', () => {
    const r = new Rack()
    expect(r.isIncomplete).toBeTruthy()
    let a = true
    while (a) {
      a = r.add(TEST_HORIZONTAL_TILES.A)
    }
    expect(r.isIncomplete).toBeFalsy()
  })

  it('clear() Should remove all the tiles from the array', () => {
    expect(rack.isEmpty).toBeFalsy()
    rack.clear()
    expect(rack.isEmpty).toBeTruthy()
  })

  describe('shuffle()', () => {
    it("Should  shuffle the rack's contents", () => {
      rack.add(TEST_HORIZONTAL_TILES.A)
      rack.add(TEST_HORIZONTAL_TILES.B)
      rack.add(TEST_HORIZONTAL_TILES.C)
      rack.add(TEST_HORIZONTAL_TILES.D)
      rack.add(TEST_HORIZONTAL_TILES.E)
      rack.add(TEST_HORIZONTAL_TILES.F)
      rack.add(TEST_HORIZONTAL_TILES.G)

      const originalArr = [
        TEST_HORIZONTAL_TILES.A,
        TEST_HORIZONTAL_TILES.B,
        TEST_HORIZONTAL_TILES.C,
        TEST_HORIZONTAL_TILES.D,
        TEST_HORIZONTAL_TILES.E,
        TEST_HORIZONTAL_TILES.F,
        TEST_HORIZONTAL_TILES.G
      ]
      rack.shuffle()

      expect(rack.map((e) => e)).not.toEqual(originalArr)
    })
  })
})
