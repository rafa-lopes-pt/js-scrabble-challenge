import { describe, expect, it } from 'vitest'
import Rack from '../../../../src/Logic/types/player/Rack'
import { TEST_TILES } from '../../../TEST_DATA'
describe('class Rack', () => {
  describe('Constructor', () => {
    it('Should create a Rack object with fixed length and all items initialized to null', () => {
      const r = new Rack()
      expect(r.length).toBe(7)
      expect(r.map((e) => e === null)).toEqual(Array(7).fill(true))
    })

    it('Should only add the first 7 items', () => {
      const r1 = new Rack(TEST_TILES.A, TEST_TILES.B, TEST_TILES.C),
        r2 = new Rack(
          TEST_TILES.A,
          TEST_TILES.A,
          TEST_TILES.A,
          TEST_TILES.A,
          TEST_TILES.A,
          TEST_TILES.A,
          TEST_TILES.A,
          TEST_TILES.A
        )
      expect(r1.toArray()).toEqual([
        TEST_TILES.A,
        TEST_TILES.B,
        TEST_TILES.C,
        null,
        null,
        null,
        null
      ])
      expect(r1.length).toBe(7)
      expect(r2.toArray()).toEqual([
        TEST_TILES.A,
        TEST_TILES.A,
        TEST_TILES.A,
        TEST_TILES.A,
        TEST_TILES.A,
        TEST_TILES.A,
        TEST_TILES.A
      ])
      expect(r2.length).toBe(7)
    })
  })

  describe('add()', () => {
    const rack = new Rack()
    it('Should return true if an element was successfully added', () => {
      expect(rack.add(TEST_TILES.A)).toBeTruthy()
    })

    it('Should  add a new item at the first empty position', () => {
      expect(rack.map((e) => e)[0]).toEqual(TEST_TILES.A)
    })

    it('Should always return length = 7', () => {
      const r = new Rack()
      let a = false
      while (!a) {
        expect(r.length).toBe(7)
        a = r.add(TEST_TILES.A)
      }
    })

    it("Should return false  if can't add more items", () => {
      rack.add(TEST_TILES.A)
      rack.add(TEST_TILES.A)
      rack.add(TEST_TILES.A)
      rack.add(TEST_TILES.A)
      rack.add(TEST_TILES.A)
      rack.add(TEST_TILES.A)
      expect(rack.add(TEST_TILES.A)).toBeFalsy()
    })
  })

  describe('remove()', () => {
    const rack = new Rack(
      TEST_TILES.A,
      TEST_TILES.A,
      TEST_TILES.A,
      TEST_TILES.A,
      TEST_TILES.A,
      TEST_TILES.A,
      TEST_TILES.A
    )
    it('Should always return length = 7', () => {
      const r = new Rack()
      for (let i = 0; i < 7; i++) {
        expect(r.length).toBe(7)
        r.remove(i)
      }
    })

    it('Should return true if element was found and removed', () => {
      rack.add(TEST_TILES.A)
      expect(rack.remove(0)).toBeTruthy()
    })

    it('Should return false if element was not found', () => {
      expect(rack.remove(9)).toBeFalsy()
    })
  })

  describe('shuffle()', () => {
    it("Should  shuffle the rack's contents", () => {
      const originalArr = [
        TEST_TILES.A,
        TEST_TILES.B,
        TEST_TILES.C,
        TEST_TILES.D,
        TEST_TILES.E,
        TEST_TILES.F,
        TEST_TILES.G
      ]
      const rack = new Rack(...originalArr)
      rack.shuffle()
      expect(rack.map((e) => e)).not.toEqual(originalArr)
    })
  })

  it('Should get the sum of all the Tile points', () => {
    const r = new Rack(
      TEST_TILES.A,
      TEST_TILES.A,
      TEST_TILES.A,
      TEST_TILES.A,
      TEST_TILES.A,
      TEST_TILES.A,
      TEST_TILES.A
    )

    expect(r.points).toEqual(7)
    r.remove(4)
    expect(r.points).toEqual(6)
  })
})
