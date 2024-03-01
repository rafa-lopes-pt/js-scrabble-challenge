import TileType from './Tile'

export default class TileOnBoard implements TileType {
  private _letter: string
  private _points: number
  private _row: number
  private _col: number

  constructor(tile: TileType, row: number, col: number) {
    this._col = col
    this._row = row
    this._letter = tile.letter
    this._points = tile.points
  }

  isEqual(tile: TileOnBoard) {
    const keys = Object.keys(this),
      tileKeys = Object.keys(tile)

    if (keys.length !== tileKeys.length) return false

    for (let key in keys) {
      if (!tile.hasOwnProperty(key) || this[key] !== tile[key]) return false
    }

    return true
  }

  get letter() {
    return this._letter
  }
  get points() {
    return this._points
  }
  get row() {
    return this._row
  }
  get col() {
    return this._col
  }
}
