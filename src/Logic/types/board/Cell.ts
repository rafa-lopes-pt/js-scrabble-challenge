import TileType from '../tiles/Tile'
import { CELL_MULTIPLIERS_ENUM } from './board-utils'

export default class Cell {
  tile: TileType | null
  private _multiplier: CELL_MULTIPLIERS_ENUM
  private _isAnchored: boolean
  //
  private _isMultiplierValid: boolean

  constructor(
    multiplier: CELL_MULTIPLIERS_ENUM = CELL_MULTIPLIERS_ENUM.NULL,
    isAnchored: boolean = false,
    tile?: TileType
  ) {
    this.tile = tile || null
    this._multiplier = multiplier
    this._isAnchored = isAnchored
    this._isMultiplierValid = !isAnchored
  }

  get multiplier() {
    return this._isMultiplierValid
      ? this._multiplier
      : CELL_MULTIPLIERS_ENUM.NULL
  }

  get isAnchored() {
    return this._isAnchored
  }

  get isEmpty() {
    return this.tile != null
  }

  set isAnchored(val: boolean) {
    if (val) {
      this._isMultiplierValid = false
    }
    this._isAnchored = val
  }

  static parseTileFromCell = (cell: Cell, row: number, col: number) =>
    //@ts-ignore isEmpty already checks if tile exists
    !cell.isEmpty ? new TileOnBoard(cell.tile, row, col) : null
}
