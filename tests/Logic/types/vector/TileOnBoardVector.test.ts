import { describe, it, expect, beforeAll, afterEach, beforeEach } from 'vitest'
import Rack from '../../../../src/Logic/types/player/Rack'
import TileOnBoard from '../../../../src/Logic/types/tiles/TileOnBoard'
import TileType from '../../../../src/Logic/types/tiles/Tile'
import TileOnBoardVector from '../../../../src/Logic/types/vector/TileOnBoardVector'
import { TEST_HORIZONTAL_TILES, TEST_VERTICAL_TILES } from '../../../TEST_DATA'
import { VECTOR_DIRECTION_ENUM } from '../../../../src/Logic/types/vector/vector-utils'

describe('TileOnBoardVector', () => {
  it('Should have undefined position properties if it only has 1 elements', () => {
    const vector = new TileOnBoardVector(TEST_HORIZONTAL_TILES.A)
    expect(vector.isValid).toBeFalsy()
  })

  it('Should have all properties defined, if it has 2 or more elements', () => {
    const vector = new TileOnBoardVector(
      TEST_HORIZONTAL_TILES.A,
      TEST_HORIZONTAL_TILES.B
    )
    expect(vector.isValid).toBeTruthy()
  })

  it('Should be able to infer the direction', () => {
    const vector1 = new TileOnBoardVector(
      TEST_HORIZONTAL_TILES.A,
      TEST_HORIZONTAL_TILES.B
    )
    expect(vector1.direction).toBe(VECTOR_DIRECTION_ENUM.HORIZONTAL)
    //
    const vector2 = new TileOnBoardVector(
      TEST_HORIZONTAL_TILES.A,
      TEST_VERTICAL_TILES.C
    )
    expect(vector2.direction).toBe(VECTOR_DIRECTION_ENUM.VERTICAL)
  })

  it('Should check if all the points are continuous, or if there are gaps', () => {
    const vector1 = new TileOnBoardVector(
      TEST_HORIZONTAL_TILES.A,
      TEST_HORIZONTAL_TILES.B
    )
    expect(vector1.isContinuous).toBeTruthy()

    const vector2 = new TileOnBoardVector(
      TEST_HORIZONTAL_TILES.A,
      TEST_HORIZONTAL_TILES.C
    )
    expect(vector2.isContinuous).toBeFalsy()
  })

  describe('insert()', () => {
    const vector = new TileOnBoardVector(TEST_HORIZONTAL_TILES.B)

    it('Should return true or false indicating if the element was inserted', () => {
      expect(vector.insert(TEST_HORIZONTAL_TILES.C)).toBeTruthy()
      expect(vector.insert(TEST_VERTICAL_TILES.C)).toBeFalsy()
      expect(
        new TileOnBoardVector().insert(TEST_HORIZONTAL_TILES.A)
      ).toBeTruthy()
    })

    it('Should not contain the item where insert method returned false', () => {
      expect(vector.toArray().includes(TEST_VERTICAL_TILES.C)).toBeFalsy()
    })

    it('Should insert the new item in order', () => {
      expect(vector.get(0)).toEqual(TEST_HORIZONTAL_TILES.B)
      vector.insert(TEST_HORIZONTAL_TILES.A)
      expect(vector.get(0)).toEqual(TEST_HORIZONTAL_TILES.A)
    })

    it('Should update position properties on successful insert', () => {
      expect(vector.direction).toBe(VECTOR_DIRECTION_ENUM.HORIZONTAL)
      expect(vector.start).toBe(1)
      expect(vector.end).toBe(3)
      expect(vector.index).toBe(1)

      vector.insert(TEST_HORIZONTAL_TILES.D)
      expect(vector.direction).toBe(VECTOR_DIRECTION_ENUM.HORIZONTAL)
      expect(vector.start).toBe(1)
      expect(vector.end).toBe(4)
      expect(vector.index).toBe(1)

      //this should not be inserted
      vector.insert(TEST_VERTICAL_TILES.E)
      expect(vector.direction).toBe(VECTOR_DIRECTION_ENUM.HORIZONTAL)
      expect(vector.start).toBe(1)
      expect(vector.end).toBe(4)
      expect(vector.index).toBe(1)
    })
  })

  describe('removeIndex()', () => {
    let vector = new TileOnBoardVector()

    beforeEach(async () => {
      vector = new TileOnBoardVector(TEST_HORIZONTAL_TILES.A)
    })
    it('Should remove the element', () => {
      vector.removeIndex(0)
      expect(vector.length).toBe(0)
    })
    it('Should return the element', () => {
      expect(vector.removeIndex(0)).toEqual(TEST_HORIZONTAL_TILES.A)
    })
    it('Should return undefined if no element was found', () => {
      expect(vector.removeIndex(15)).toBeUndefined()
    })

    it('Should update position properties on successful remove', () => {
      vector.insert(TEST_HORIZONTAL_TILES.B)
      vector.insert(TEST_HORIZONTAL_TILES.D)

      expect(vector.direction).toBe(VECTOR_DIRECTION_ENUM.HORIZONTAL)
      expect(vector.start).toBe(1)
      expect(vector.end).toBe(4)
      expect(vector.index).toBe(1)

      vector.removeIndex(2)
      expect(vector.direction).toBe(VECTOR_DIRECTION_ENUM.HORIZONTAL)
      expect(vector.start).toBe(1)
      expect(vector.end).toBe(2)
      expect(vector.index).toBe(1)

      vector.removeIndex(1)
      expect(vector.direction).toBe(VECTOR_DIRECTION_ENUM.UNDEFINED)
      expect(vector.start).toBe(undefined)
      expect(vector.end).toBe(undefined)
      expect(vector.index).toBe(undefined)
    })
  })

  describe('remove()', () => {
    let vector = new TileOnBoardVector()

    beforeEach(async () => {
      vector = new TileOnBoardVector(TEST_HORIZONTAL_TILES.A)
    })
    it('Should remove the element', () => {
      vector.remove(TEST_HORIZONTAL_TILES.A)
      expect(vector.length).toBe(0)
    })
    it('Should return the element', () => {
      expect(vector.remove(TEST_HORIZONTAL_TILES.A)).toEqual(
        TEST_HORIZONTAL_TILES.A
      )
    })
    it('Should return undefined if no element was found', () => {
      expect(vector.remove(TEST_HORIZONTAL_TILES.B)).toBeUndefined()
    })

    it('Should update position properties on successful remove', () => {
      vector.insert(TEST_HORIZONTAL_TILES.B)
      vector.insert(TEST_HORIZONTAL_TILES.D)

      expect(vector.direction).toBe(VECTOR_DIRECTION_ENUM.HORIZONTAL)
      expect(vector.start).toBe(1)
      expect(vector.end).toBe(4)
      expect(vector.index).toBe(1)

      vector.remove(TEST_HORIZONTAL_TILES.D)
      expect(vector.direction).toBe(VECTOR_DIRECTION_ENUM.HORIZONTAL)
      expect(vector.start).toBe(1)
      expect(vector.end).toBe(2)
      expect(vector.index).toBe(1)

      vector.remove(TEST_HORIZONTAL_TILES.B)
      expect(vector.direction).toBe(VECTOR_DIRECTION_ENUM.UNDEFINED)
      expect(vector.start).toBe(undefined)
      expect(vector.end).toBe(undefined)
      expect(vector.index).toBe(undefined)
    })
  })

  describe('removeAll()', () => {
    const vector = new TileOnBoardVector()

    beforeEach(async () => {
      vector.insert(TEST_HORIZONTAL_TILES.A)
      vector.insert(TEST_HORIZONTAL_TILES.B)
      vector.insert(TEST_HORIZONTAL_TILES.C)
    })
    it('Should remove all the element', () => {
      vector.removeAll()
      expect(vector.length).toBe(0)
    })
    it('Should return all the elements', () => {
      expect(vector.removeAll()).toEqual([
        TEST_HORIZONTAL_TILES.A,
        TEST_HORIZONTAL_TILES.B,
        TEST_HORIZONTAL_TILES.C
      ])
    })
    it('Should return an empty array if no element was found', () => {
      vector.removeAll()
      expect(vector.removeAll()).toEqual([])
    })

    it('Should update position properties on successful remove', () => {
      expect(vector.direction).toBe(VECTOR_DIRECTION_ENUM.HORIZONTAL)
      expect(vector.start).toBe(1)
      expect(vector.end).toBe(3)
      expect(vector.index).toBe(1)

      vector.removeAll()

      expect(vector.direction).toBe(VECTOR_DIRECTION_ENUM.UNDEFINED)
      expect(vector.start).toBe(undefined)
      expect(vector.end).toBe(undefined)
      expect(vector.index).toBe(undefined)
    })
  })
})
