import { describe, it, expect } from 'vitest'
import Player from '../../../../src/Logic/types/player/Player'
import TileType from '../../../../src/Logic/types/tiles/Tile'

describe('Player Class', () => {
  const player = new Player('123')

  describe('subtractRackPoints()', () => {
    it('Should subtract the rack points from the player points', () => {
      const testTile = { letter: 'A', points: 1 } as TileType
      while (player.rack.isIncomplete) {
        player.rack.add(testTile)
      }

      player.points = 10
      expect(player.points).toBe(10)

      player.subtractRackPoints()

      expect(player.points).toBe(3) //10-7
    })

    it('Should empty the rack after calling subtractRackPoints()', () => {
      expect(player.rack.isEmpty).toBeTruthy()
    })
  })
})
