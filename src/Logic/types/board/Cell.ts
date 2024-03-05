import TileType from '../tiles/Tile'
import TileOnBoard from '../tiles/TileOnBoard'
import { CELL_MULTIPLIERS_ENUM, CellParserCallback } from './board-utils'

export default class Cell {
  tile: TileType | null
  private _multiplier: CELL_MULTIPLIERS_ENUM
  private _isAnchored: boolean
  //
  private _isMultiplierValid: boolean

  //NOTE: isMultiplayerValid should never be passed in the constructor call because its derived from usage
  //once isAnchored is true, isMultiplayerValid should always be false!
  constructor(
    tile?: TileType,
    multiplier?: CELL_MULTIPLIERS_ENUM,
    isAnchored?: boolean
  ) {
    this.tile = tile || null
    this._multiplier = multiplier || CELL_MULTIPLIERS_ENUM.NULL
    this._isAnchored = isAnchored || false
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
    return this.tile === null
  }

  set isAnchored(val: boolean) {
    if (val) {
      this._isMultiplierValid = false
    }
    this._isAnchored = val
  }

  static parseTileFromCell: CellParserCallback<TileOnBoard | null> = (
    cell,
    col,
    row
  ) => {
    //@ts-ignore isEmpty already checks if tile exists
    return !cell?.isEmpty ? new TileOnBoard(cell?.tile, col, row) : null
  }
}
