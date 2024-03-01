import TileType from '../tiles/Tile'

export default class Rack {
  private _rack: Array<TileType | null>
  constructor() {
    this._rack = new Array(7).fill(null)
  }

  get length() {
    return this._rack.length
  }

  get isEmpty() {
    return this._rack.every((e) => !e)
  }
  get isIncomplete() {
    return this._rack.some((e) => !e)
  }
  //Adds a tile to the first empty position, never exceeding it's length
  add(t: TileType) {
    if (this.isIncomplete) {
      const emptyIndex = this._rack.indexOf(null)
      this._rack.splice(emptyIndex, 1, t)
      return true
    } else return false
  }
  //Returns false if element is not found
  remove(n: number) {
    const e = this._rack.splice(n, 1, null)[0]
    if (e === undefined) return false
    return true
  }
  clear() {
    this._rack = new Array(7).fill(null)
  }
  map(callback: (e: Rack | null, i?: number) => any) {
    return this._rack.map(callback as any)
  }

  shuffle() {
    for (
      let currentIndex = this._rack.length - 1;
      currentIndex > 0;
      currentIndex--
    ) {
      const randIndex = Math.floor(Math.random() * (currentIndex + 1))
      const temp = this._rack[currentIndex]
      this._rack[currentIndex] = this._rack[randIndex]
      this._rack[randIndex] = temp
    }
  }

  swap(nTile: TileType, swapIndex: number) {
    this.remove(swapIndex) && this.add(nTile)
  }

  get points() {
    return this._rack.reduce((sum, e) => sum + (e?.points || 0), 0)
  }
}
