import { describe, it, expect } from 'vitest'
import TileOnBoard from '../../../../src/Logic/types/tiles/TileOnBoard'
import TileType from '../../../../src/Logic/types/tiles/Tile'

describe('TileOnBoard Class', () => {
  it('Should have an isEquals() method', () => {
    const tile1 = new TileOnBoard({ letter: 'A', points: 1 } as TileType, 1, 1)
    const tile2 = new TileOnBoard({ letter: 'A', points: 1 } as TileType, 1, 1)
    const tile3 = new TileOnBoard({ letter: 'B', points: 1 } as TileType, 1, 1)

    expect(tile1.isEqual(tile2)).toBeTruthy()
    expect(tile1.isEqual(tile3)).toBeFalsy()
  })
})
