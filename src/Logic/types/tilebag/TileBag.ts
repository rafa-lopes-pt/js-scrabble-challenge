import Rack from '../player/Rack'
import LangSet from '../lang/LangSet'
import TileType from '../tiles/Tile'
import { random } from '../../utils'
import TileFromSetType from '../tiles/TileFromSet'
import { randomWord } from '../lang/lang-utils'

export class TileBag extends LangSet {
  swap(tile: TileType) {
    let newTile = this.takeTile()
    this.putTile(tile)
    return newTile
  }

  private putTile(tile: TileType) {
    const tileIndex = this._tileSet.findIndex((e) => e.letter === tile.letter)
    if (tileIndex > 0) {
      this._tileSet[tileIndex].quantity++
      return true
    } else return false
  }

  private takeTile() {
    const tile = random<TileFromSetType>(this._tileSet)
    tile.quantity--
    return { ...tile } as TileType
  }

  has(search: string) {
    return this._tileSet.find((e) => e.letter === search && e.quantity > 0)
      ? true
      : false
  }

  fillRack(rack: Rack) {
    while (rack.isIncomplete) {
      rack.add(this.takeTile())
    }
    return rack //rack is a ref...so...dont need the return i think
  }

  getTiles(...str: string[]) {
    const wordTiles = new Array<TileType>()
    for (let char of str) {
      const tile = this._tileSet.find(
        (e, i) => e.letter === char && e.quantity > 0
      )
      tile && wordTiles.push({ ...tile })
    }
    return wordTiles
  }

  generateWord() {
    let word = '',
      isValid = true
    do {
      word = randomWord(this.lang.code)
      for (let letter of word) {
        if (!this.has(letter)) isValid = false
      }
    } while (!isValid)

    return this.getTiles(word)
  }
}
