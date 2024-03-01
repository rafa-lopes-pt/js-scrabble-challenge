import Rack from '../player/Rack'
import LangSet from '../lang/LangSet'
import TileType from '../tiles/Tile'

export class TileBag extends LangSet {
  swap(tile: TileType) {
    let newTile = this.takeTile()
    this.putTile(tile)
  }

  private putTile(tile: TileType) {
    const tileIndex = this.tileSet.findIndex((e) => e.letter === tile.letter)
    if (tileIndex > 0) {
      this.tileSet[tileIndex].quantity++
      return true
    } else return false
  }

  private takeTile() {
    let randomIndex = -1
    do {
      randomIndex = Math.floor(Math.random() * this.tileSet.length - 1)
    } while (this.tileSet[randomIndex].quantity === 0)

    const tile: TileType = this.tileSet[randomIndex]
    this.tileSet[randomIndex].quantity--
    return tile
  }

  fillRack(rack: Rack) {
    while (rack.isIncomplete) {
      rack.add(this.takeTile())
    }
    return rack //rack is a ref...so...dont need the return i think
  }
}
