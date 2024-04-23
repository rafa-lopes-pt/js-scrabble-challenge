import { isEqual } from '../../utils'
import TileType from '../tiles/Tile'
import { CELL_MULTIPLIERS_ENUM } from './board-utils'

/**
 * Represents a slot from the game board.
 * A cell can either be empty, or have a tile.
 * During a player's turn, a tile may be added
 * without it being anchored to the cell itself.
 * Once a player submits a word, the cells in which
 * he played should be anchored, and the multiplier
 * becomes invalid.
 * Anchored cells cannot have it's tile removed
 */
export default class Cell {
  private _tile: TileType | null
  private _multiplier: CELL_MULTIPLIERS_ENUM
  private _isAnchored: boolean
  private _col: number
  private _row: number

  constructor(
    col: number,
    row: number,
    tile: TileType | null = null,
    multiplier: CELL_MULTIPLIERS_ENUM = CELL_MULTIPLIERS_ENUM.NULL,
    isAnchored: boolean = false
  ) {
    this._col = col
    this._row = row
    this._tile = tile
    this._multiplier = multiplier
    this._isAnchored = isAnchored
  }

  get col() {
    return this._col
  }
  get row() {
    return this._row
  }

  get multiplier() {
    return this.isMultiplierValid
      ? this._multiplier
      : CELL_MULTIPLIERS_ENUM.NULL
  }

  get isMultiplierValid() {
    return !this.isAnchored
  }

  get isAnchored() {
    return this._isAnchored
  }

  get isEmpty() {
    return this._tile === null
  }

  get tile() {
    return this._tile ? ({ ...this._tile } as TileType) : null
  }

  anchorCell() {
    this._isAnchored = true
  }

  isEqual(cell: Cell) {
    return isEqual(this, cell)
  }

  set tile(tile: TileType | null) {
    if (!this.isAnchored) this._tile = tile ? { ...tile } : null
  }

  clearTile() {
    this._tile = null
  }

  set multiplier(m: CELL_MULTIPLIERS_ENUM) {
    this._multiplier = m
  }
}
