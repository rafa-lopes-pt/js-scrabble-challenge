import TileType from '../tiles/Tile'
import { BOARD_MULTIPLIERS_ENUM } from './board-utils'

export default class Cell {
  tile: TileType | null
  private _multiplier: BOARD_MULTIPLIERS_ENUM
  private _isMultiplierValid: boolean
  private _isAnchored: boolean

  constructor(
    multiplier: BOARD_MULTIPLIERS_ENUM = BOARD_MULTIPLIERS_ENUM.NULL
  ) {
    this.tile = null
    this._multiplier = multiplier
    this._isAnchored = false
  }

  get multiplier() {
    return this._isMultiplierValid
      ? this._multiplier
      : BOARD_MULTIPLIERS_ENUM.NULL
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
