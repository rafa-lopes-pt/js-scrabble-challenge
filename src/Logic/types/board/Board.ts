import TileType from '../tiles/Tile'
import CellVector from '../vector/CellVector'
import Cell from './Cell'
import { BoardPresetType } from './board-presets'
import { CELL_HANDLING_CODES } from './board-utils'
import { MultiplierMap, MultiplierPositionType } from './multipliers-placement'

//IMPROVE: Error handling -> Define custom error class and throw specific errors like tile placement and cell targeting
export default class Board {
  private _grid: Cell[][]
  private _mainWord: CellVector //vector

  constructor(type: BoardPresetType) {
    this.createGrid(type.cols, type.rows)
    this.insertMultipliers(type.multiplierMap)
    this._mainWord = new CellVector()
  }

  //IMPROVE: Add a "fromGrid" method to import data from saved games

  //====================================== BOARD GENERATION

  /**
   * Initializes grid with empty cells
   */
  private createGrid(cols: number, rows = cols) {
    this._grid = Array.from({ length: cols }, (e, i) =>
      Array.from({ length: rows }, (e, j) => new Cell(i, j))
    )
  }
  /**
   * Adds multipliers to cells
   */
  private insertMultipliers(multipliers: MultiplierMap) {
    for (let multiplier of multipliers) {
      const cell = this.get(multiplier.cell.col, multiplier.cell.row)
      if (cell) cell.multiplier = multiplier.type
    }
  }

  //================================================= TILE PLACEMENT START
  /**
   * Places a tile on the board if all conditions are met
   * @throws based on invalid position
   */
  placeTile(tile: TileType, col: number, row: number) {
    const cell = this.get(col, row)
    if (!cell) throw new Error('Target cell does not exists')

    if (cell.isAnchored) return CELL_HANDLING_CODES.IS_ANCHORED

    //IMPROVE: This targets unwanted swap behavior
    //if cell is not empty, then existing tile needs to be returned to rack
    if (!cell.isEmpty) return CELL_HANDLING_CODES.HAS_TILE

    cell.tile = tile
    if (!this._mainWord.insert(cell)) {
      cell.clearTile()
      return CELL_HANDLING_CODES.CANT_FORM_WORD
    }

    return CELL_HANDLING_CODES.IS_OK
  }
  /**
   * Takes a tile from the board if all conditions are met
   * @throws based on invalid target
   */
  takeTile(col: number, row: number) {
    const cell = this.get(col, row)
    if (!cell) throw new Error('Target cell does not exists')

    if (cell.isAnchored) throw new Error(' CELL_HANDLING_CODES.IS_ANCHORED')
    if (cell.isEmpty) throw new Error('CELL_HANDLING_CODES.IS_EMPTY')

    //If code reaches here, main word HAS to contain the cell && cell is defined
    const tile = this._mainWord.remove(cell)?.tile
    if (!tile)
      throw new Error(
        'Target cell is not present in main word. This behavior is unexpected.'
      )

    cell.clearTile()
    return tile
  }
  /**
   * Takes all tiles back from the board and empties _mainWord
   */
  takeAllTiles() {
    //remove from board
    const tiles = this._mainWord.map((cell) =>
      this.takeTile(cell.col, cell.row)
    )
    //empty main word
    this._mainWord.removeAll()
    return tiles
  }

  //================================================= TILE PLACEMENT START
  /**
   * Given a cell vector, finds any missing cells that may form a word, and returns
   * the string it represents. Or undefined if no word was found.
   */
  private getWordFromVector(cellVector: CellVector) {
    return cellVector
      .apply(this._grid)
      ?.reduce((sum, e) => sum + e.tile?.letter, '')
  }
  /**
   * Returns an array with all the adjacent strings
   * ( relative to _mainWord ) that may represent a word.
   */
  getAdjacentWords() {
    if (!this._mainWord.isValid)
      this._mainWord.inferVectorFromAdjacentPoint(this._grid)
    const word = new CellVector(...(this._mainWord.apply(this._grid) as Cell[]))
    const wordList: (string | undefined)[] = []
    //
    for (let i = word.start as number; i <= (word.end as number); i++) {
      //In this case getCrossVectorFromSource will always return a defined vector
      const possibleAdjacentWord = word.getCrossVectorFromSource(
        this._grid,
        i
      ) as CellVector

      const adjacent = this.getWordFromVector(possibleAdjacentWord)
      adjacent && wordList.push(adjacent)
    }
    return wordList
  }

  anchorCells() {
    for (let i = 0; i < this._mainWord.length; i++) {
      this._mainWord.get(i).anchorCell()
    }
    this._mainWord.removeAll()
  }
  /**
   * @returns A reference to a board cell
   */
  get(col: number, row: number): Cell | undefined {
    return this._grid[col][row]
  }

  get mainWord() {
    return this.getWordFromVector(this._mainWord)
  }
}
