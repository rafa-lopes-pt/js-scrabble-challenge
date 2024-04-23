import { random } from '../../utils'
import LangSet from '../lang/LangSet'
import { randomWord } from '../lang/lang-utils'
import Rack from '../player/Rack'
import TileType from '../tiles/Tile'
import TileFromSetType from '../tiles/TileFromSet'

/**
 * Represents scrabble's tile bag, containing all the remaining tiles, apart from the player's racks and the board
 */
export default class TileBag extends LangSet {
  /**
   * Given a valid tile, swaps it by another one in the bag
   * @returns a different tile
   */
  swap(tile: TileType) {
    let newTile: TileType
    if (this.putTile(tile)) {
      newTile = this.takeTile(tile)
      return { letter: newTile.letter, points: newTile.points } as TileType
    } else return undefined
  }
  /**
   * Puts a tile back into the bag
   * @returns true if tile is part of set, false otherwise
   */
  private putTile(tile: TileType) {
    const tileIndex = this.findIndex(tile)

    if (tileIndex >= 0) {
      this.tileSet[tileIndex].quantity++

      return true
    } else return false
  }
  /**
   * Takes a random tile from the bag.
   * @param previous exclude this TileType object from being returned
   */
  private takeTile(previous?: TileType) {
    const ensureNoDuplicate = (nValue: TileFromSetType) =>
      previous?.letter == nValue.letter
    let tile: TileFromSetType
    do {
      tile = random(this.tileSet, ensureNoDuplicate)
    } while (tile.quantity === 0)
    tile.quantity--

    return { ...tile } as TileType
  }
  /**
   * Given a rack, fills all the empty slots with random tiles
   */
  fillRack(rack: Rack) {
    while (rack.isIncomplete) {
      rack.add(this.takeTile())
    }
    return rack
  }
  /**
   * Given a string, removes all the corresponding tiles from the bag
   * @throws if bag doesn't have enough tiles to form word
   */
  getCorrespondingTiles(str: string) {
    const wordTiles = new Array<TileFromSetType>()

    let isValid = true
    //Find & take tiles
    for (let char of str) {
      const tile = this.tileSet.find(
        (e) => e.letter.toLowerCase() === char.toLowerCase() && e.quantity > 0
      )
      if (!tile) {
        isValid = false
        break
      }
      tile.quantity--
      wordTiles.push(tile)
    }
    //If invalid -> Return tiles to bag
    if (!isValid) {
      for (const tile of wordTiles) {
        tile.quantity++
      }
      return null
    }

    return wordTiles as TileType[]
  }
  /**
   * Generates a random word from the lang code, and returns an array with the corresponding tiles
   */
  // FIX: MOVE THIS TO game logic hook
  async generateWord() {
    let word = '',
      tileArr = [],
      isValid = false

    do {
      word = await randomWord(this.lang.code)

      try {
        //@ts-ignore
        tileArr = this.getCorrespondingTiles(word)
        console.log('Word', tileArr)

        isValid = true
      } catch (e) {
        isValid = false
      }
    } while (!isValid)

    return tileArr
  }
}
