import { describe, expect, it } from 'vitest'
import EN_SET_JSON from '../../../../src/Logic/Lang/en-uk.json'
import LangSet from '../../../../src/Logic/types/lang/LangSet'
import Rack from '../../../../src/Logic/types/player/Rack'
import TileBag from '../../../../src/Logic/types/tilebag/TileBag'
import TileType from '../../../../src/Logic/types/tiles/Tile'

describe('TileBag Class', () => {
  const EN_SET = new LangSet(
    { code: EN_SET_JSON.code, label: EN_SET_JSON.label },
    EN_SET_JSON.tileSet
  )

  const tileBag = new TileBag(EN_SET.lang, EN_SET.tileSet)

  it('Should swap tiles, and update the quantities', () => {
    const tile0 = { letter: 'E', points: 1 }
    tileBag.tileSet[tileBag.findIndex(tile0)].quantity--
    let tile1 = tile0,
      tile2: TileType
    for (let i = 0; i < 1000; i++) {
      let tile1Index = tileBag.findIndex(tile1)
      //Tile 1 & 2 quantities should be updated
      expect(EN_SET.tileSet[tile1Index].quantity - 1).toEqual(
        tileBag.tileSet[tile1Index].quantity
      )

      tile2 = tileBag.swap(tile1) as TileType
      // console.log('Swapped', tile1, 'for', tile2)
      //tile1 should have 1 more tile
      expect(EN_SET.tileSet[tile1Index].quantity).toEqual(
        tileBag.tileSet[tile1Index].quantity
      )
      //Tile2 quantities will be checked on next iteration
      expect(tile2).not.toEqual(tile1)
      tile1 = tile2
    }
  })

  describe('getCorrespondingTiles()', () => {
    it('Should return an array with the corresponding tiles for a given string', () => {
      expect(
        tileBag.getCorrespondingTiles('word')?.map((e) => e.letter)
      ).toEqual('WORD'.split(''))
    })
    it('Should return null, if there are no corresponding tiles for a given string', () => {
      expect(tileBag.getCorrespondingTiles('zzz')).toBeNull()
    })
  })

  it('Should fill a given rack', () => {
    const rack = new Rack()
    const totalTiles = tileBag.totalTiles
    expect(rack.isEmpty).toBeTruthy()
    tileBag.fillRack(rack)
    expect(rack.isIncomplete).toBeFalsy()
    expect(totalTiles - 7 === tileBag.totalTiles).toBeTruthy()
  })
})
