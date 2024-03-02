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
  })

  describe('removeIndex()', () => {
    const vector = new TileOnBoardVector(TEST_HORIZONTAL_TILES.A)

    beforeEach(async () => {
      // FIX: Dont seem to be able to use this...
      //vector.insert(TEST_HORIZONTAL_TILES.A)
    })

    it('Should remove the element', () => {
      vector.removeIndex(0)
      expect(vector.length).toBe(0)
    })
    it('Should return the element', () => {
      vector.insert(TEST_HORIZONTAL_TILES.A)
      console.log(vector.toArray())
      expect(vector.removeIndex(0)).toEqual(TEST_HORIZONTAL_TILES.A)
    })
    it('Should return undefined if no element was found', () => {
      expect(vector.removeIndex(15)).toBeUndefined()
    })
  })
})
