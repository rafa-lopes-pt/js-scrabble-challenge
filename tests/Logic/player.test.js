import { describe, it, expect } from 'vitest'
import { Player } from '../../src/Logic/player'

describe('Player', () => {
  const player = new Player('123')

  describe('subtractRackPoints()', () => {
    it('Should subtract the rack points from the player points', () => {
      const testTile = { points: 1 }
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
