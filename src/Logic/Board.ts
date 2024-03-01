import {
  BOARD_MULTIPLIERS_ENUM,
  TileOnBoard,
  TileOnBoardVector,
  TileType,
  VECTOR_DIRECTION_ENUM,
  VectorMapCallbackType,
  VectorPositionType,
  WORD_MULTIPLIER_TYPE,
  WordValidationCallbackType
} from './types'
import { isSequence } from './utils'

class Board {
  private _grid: Cell[][]
  private wordsList: Word[]
  private mainWord: Word | undefined

  constructor() {
    this._grid = new Array(15).fill(new Array(15).fill(new Cell()))
    /*
    FIX: Add multipliers to the board!!!
    //TW -> Corners and middle lines (H and 8)
    //DW -> diagonal from TW 4 times
    //DL -> ah fuck it do it manually
    //TL -> 

    */
    this.wordsList = []
    this.mainWord = undefined
  }

  //================================================= BOARD INTERACTION START
  //IMPROVE: Return error codes instead of boolean?
  // show why tile cant be placed
  placeTile(tile: TileType, row: number, col: number) {
    const cell = this._grid[col][row]

    if (cell.isEmpty) {
      cell.tile = tile

      if (!this.mainWord) {
        this.mainWord = new Word()
      }

      //NOTE: Tile validation should be done in class Word
      // addTile checks if tile can be placed, according to the word, and checks against diagonals
      return this.mainWord.addTile({ ...tile, col, row } as TileOnBoard)
    } else return false
  }
  takeTile(row: number, col: number) {
    const cell = this._grid[col][row]
    //Remove from grid
    if (!cell.isEmpty && !cell.isAnchored) {
      //@ts-ignore cell.tile is defined is !cell.isEmpty
      const tile = new TileOnBoard(cell.tile, row, col)
      cell.tile = null
      //Remove from word and return to rack
      return this.mainWord?.removeTile(tile)
      //IMPROVE: Should check if tile equals the removed tile? kind of an impossible scenario
    }
    //
    //IMPROVE: may be redundant -> UI should check if cell is empty before allowing to take piece
    else if (cell.isEmpty) {
      return undefined
    }
    //
    // why? why not!
    else {
      throw new Error(
        `Congratulations! You found a weird bug...turns out that either
         the tile you wanted to take, or the word you were trying to 
         write got corrupted!
         Not sure why this happened, but your game has to end.
         On the upside...YOU'RE THE WINNNEEERRRR!!!
         `
      )
    }
  }
  takeAllTiles() {
    return this.mainWord?.removeAll()
  }
  //================================================= BOARD INTERACTION END

  static getHorizontalLine(board: Cell[][], line: number, parser: Function) {
    const horizontalVector = (targetIdx: number) =>
      board.map((e, i) => parser(e[targetIdx], i, targetIdx))
    //@ts-ignore if direction is not undefined, index will always be defined
    return horizontalVector(line)
  }

  static getVerticalLine(board: Cell[][], line: number, parser: Function) {
    const verticalVector = (targetIdx: number) =>
      board[targetIdx].map((e, i) => parser(e, targetIdx, i))

    //@ts-ignore if direction is not undefined, index will always be defined
    return verticalVector(line)
  }

  private findHorizontalWords() {
    if (!this.mainWord) throw new Error('main word is not defined')

    for (
      let i = this.mainWord.position.start as number;
      i <= (this.mainWord.position.end as number);
      i++
    ) {
      // Anchored cells have already been searched
      if (this._grid[i][this.mainWord.position.index as number].isAnchored) {
        continue
      }

      //All others check sides
      //start & end already searched by Word class
      const nWord = new Word(
        Word.getMissingLettersFromLine(
          i,
          Board.getVerticalLine(this._grid, i, Cell.parseTileFromCell),
          new TileOnBoardVector()
        )
      )

      this.wordsList.push(nWord)
    }
  }
  private findVerticalWords() {
    if (!this.mainWord) throw new Error('main word is not defined')

    for (
      let i = this.mainWord.position.start as number;
      i <= (this.mainWord.position.end as number);
      i++
    ) {
      // Anchored cells have already been searched
      if (this._grid[this.mainWord.position.index as number][i].isAnchored) {
        continue
      }
      //All others check sides
      //start & end already searched by Word class
      const nWord = new Word(
        Word.getMissingLettersFromLine(
          i,
          Board.getHorizontalLine(this._grid, i, Cell.parseTileFromCell),
          new TileOnBoardVector()
        )
      )

      this.wordsList.push(nWord)
    }
  }

  private async validatePlacement(
    dictionaryCallback: WordValidationCallbackType
  ) {
    //QUICKFIX:Safety check -> may be redundant, but this way no duplicate words will be found
    this.wordsList = []
    /*
    - . . . . . . . . 
    - . R A I D . . .    All valid words
    - . . L . E . . .     mainWord: DEPOT
    - . . I . P . . .     wordsList: NOT, DEPOT
    - . . E . O . . .
    - . . N O T . . .
    - . . . . . . . .

    - . . . . . . . .
    - . . . . . . . . 
    - . R A I D . . .    DEPOT cannot be placed
    - . . L . E H I .       EHI is not a valid word
    - . . I . P . . .
    - . . E . O . . .
    - . . N O T . . .
    - . . . . . . . .
    */
    // ============================== IS THE MAIN WORD VALID?
    this.mainWord?.getMissingLettersFromBoard(this._grid)
    await this.mainWord?.checkDictionary(dictionaryCallback)
    if (!this.mainWord?.isValid) return false

    // ============================== IF SO -> CHECK FOR ADDITIONAL WORDS

    switch (this.mainWord.position.direction) {
      case VECTOR_DIRECTION_ENUM.HORIZONTAL: {
        this.findHorizontalWords()
      }
      case VECTOR_DIRECTION_ENUM.VERTICAL: {
        this.findVerticalWords()
      }
    }

    // ============================== VALIDATE WORD LIST
    for (const word of this.wordsList) {
      const isValid = await word.checkDictionary(dictionaryCallback)
      if (!isValid) {
        //If one of the found words is not valid, means that the word
        //cant be placed, even if its a real word
        this.wordsList = []
        return false
      }
    }

    //if code reaches here, means that mainWord is valid AND can be placed
    //don't push mainWord to wordList -> Makes it harder to calc points
    return true
  }

  //gets calculated points && anchors parsed cells
  private getPoints() {
    let totalPoints = 0
    const applyMultiplier = (m: WORD_MULTIPLIER_TYPE, points: number[]) => {
      switch (m.value) {
        case BOARD_MULTIPLIERS_ENUM.DL: {
          // -> Multiply specific letter by 2
          return points.reduce(
            (sum, p, i) => (i === m.index ? sum + p * 2 : sum + p),
            0
          )
        }
        case BOARD_MULTIPLIERS_ENUM.TL: {
          // -> Multiply specific letter by 3
          return points.reduce(
            (sum, p, i) => (i === m.index ? sum + p * 3 : sum + p),
            0
          )
        }
        case BOARD_MULTIPLIERS_ENUM.DW: {
          // -> Multiply whole word 3
          return points.reduce((sum, p) => sum + p, 0) * 2
        }

        case BOARD_MULTIPLIERS_ENUM.TW: {
          // -> Multiply whole word 3
          return points.reduce((sum, p) => sum + p, 0) * 3
        }

        default:
          return points.reduce((sum, p) => sum + p, 0)
      }
    }
    for (let word of this.wordsList) {
      //ts error bypass
      const wordIndex = word.position.index as number
      let multiplier: WORD_MULTIPLIER_TYPE = { index: -1, value: 0 }

      let pointsArr = []
      switch (word.position.direction) {
        //IMPROVE: This could be defined in a single function that takes a callback to get the current cell
        case VECTOR_DIRECTION_ENUM.HORIZONTAL: {
          //@ts-ignore word is defined -> position defined
          const line = Board.getHorizontalLine(
            this._grid,
            //@ts-ignore word is defined -> position defined
            wordIndex,
            (e) => e
          )

          //Find the best multiplier
          //sum all tile points and use that multiplier only
          //follow enums order

          for (
            let i = word.position.start as number;
            i <= (word.position.end as number);
            i++
          ) {
            const cell = this._grid[i][wordIndex]
            //find multiplier
            if (cell.multiplier > multiplier.value) {
              multiplier.value = cell.multiplier
              multiplier.index = i
            }
            //@ts-ignore cell-tile will always be defined
            pointsArr.push(cell.tile.points)
            //set in stone!
            cell.isAnchored = true
          }

          //totalPoints
          totalPoints = applyMultiplier(multiplier, pointsArr)
        }
        case VECTOR_DIRECTION_ENUM.VERTICAL: {
          //@ts-ignore word is defined -> position defined
          const line = Board.getVerticalLine(
            this._grid,
            //@ts-ignore word is defined -> position defined
            wordIndex,
            (e) => e
          )

          //Find the best multiplier
          //sum all tile points and use that multiplier only
          //follow enums order

          for (
            let i = word.position.start as number;
            i <= (word.position.end as number);
            i++
          ) {
            const cell = this._grid[wordIndex][i]
            //find multiplier
            if (cell.multiplier > multiplier.value) {
              multiplier.value = cell.multiplier
              multiplier.index = i
            }
            //@ts-ignore cell-tile will always be defined
            pointsArr.push(cell.tile.points)
            //set in stone!
            cell.isAnchored = true
          }

          //totalPoints
          totalPoints = applyMultiplier(multiplier, pointsArr)
        }
      }
    }
    return totalPoints
  }

  //Validates placement -> calcs points -> anchors cells -> resets mainWord
  async submitTiles(dictionaryCallback: WordValidationCallbackType) {
    if (!(await this.validatePlacement(dictionaryCallback))) {
      //placement is not valid, cant submit
      return false
    }

    //placement is valid! well played :)
    const points = this.getPoints()

    if (points === 0) {
      //NOTE: is this a possible case?
      //Somethings fishy
    }

    this.mainWord?.removeAll()

    return points
  }
}

class Cell {
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

class Word {
  /*
        . . . .
        . H I .    Placing the H is valid
        . . . .    position:{start:undefined,end:undefined,location:undefined}
        . . . .    orientation:undefined

        getMissingLetters()

        . . . .
        . H I .    Word gets updated to " HI "
        . . . .    position:{start:1,end:2,location:1}
        . . . .    orientation:horizontal
        . . . .    isVectorDefined:false

        =================================================

        . . . .
        . H I .    Placing the H is valid and defaults to horizontal search
        . I . .    position:{start:1,end:1,location:1}
        . . . .    orientation:undefined
        . . . .    isVectorDefined:false

        getMissingLetters()

        . . . .
        . H I .    Word gets updated to " HI "
        . I . .    position:{start:1,end:2,location:1}
        . . . .    orientation:horizontal
        . . . .    isVectorDefined:false

        =================================================

        . . . . .
        . H I . .  Placing the D is invalid, and impossible ( see Board.placeTile() )
        . I . . . 
        . . . . D

        =================================================

        . . . .
        . H I .    Placing the H is valid
        . I . .    position:{start:undefined,end:undefined,location:undefined}
        . . . .    orientation:undefined      
        . . . .    isVectorDefined:false

        getMissingLetters()

        . . . .
        . H I .    Word gets updated to " HI " ( defaults to horizontal search )
        . I . .    position:{start:1,end:2,location:1}
        . . . .    orientation:horizontal
        . . . .    isVectorDefined:false

        . . . . .
        . H I . .  Placing the D is valid
        . I . . .  position:{start:1,end:2,location:1}
        . D . . .  orientation:horizontal
        . . . . .  isVectorDefined:false
        . . . . .
     
         getMissingLetters()

        . . . . .
        . H I . .  Word gets updated to " HID "
        . I . . .  position:{start:1,end:3,location:1}
        . D . . .  orientation:vertical
        . . . . .  isVectorDefined:true
        . . . . .
     

        */
  private _tiles: TileOnBoardVector //tiles placed by the user
  private _possibleWord: TileOnBoardVector //tiles used to form a word
  private _isValid: boolean // flag for a word that passes all checks

  constructor(vector?: TileOnBoardVector) {
    this._tiles = vector || new TileOnBoardVector()
    this._possibleWord = new TileOnBoardVector()
    this._isValid = false
  }

  addTile(t: TileOnBoard) {
    this._isValid = false
    this._possibleWord = new TileOnBoardVector()
    return this._tiles.insert(t)
  }

  removeTile(tile: TileOnBoard) {
    this._isValid = false
    this._possibleWord = new TileOnBoardVector()
    return this._tiles.remove(tile)
  }
  removeAll() {
    this._isValid = false
    this._possibleWord = new TileOnBoardVector()
    return this._tiles.removeAll()
  }

  private getBoardLine(board: Cell[][]) {
    switch (this._tiles.direction) {
      case VECTOR_DIRECTION_ENUM.HORIZONTAL: {
        return [
          {
            line: Board.getHorizontalLine(
              board,
              //@ts-ignore if direction is not undefined, index will always be defined
              this._tiles.index,
              Cell.parseTileFromCell
            ),
            direction: VECTOR_DIRECTION_ENUM.HORIZONTAL
          }
        ]
      }
      case VECTOR_DIRECTION_ENUM.VERTICAL: {
        return [
          {
            line: Board.getVerticalLine(
              board,
              //@ts-ignore if direction is not undefined, index will always be defined
              this._tiles.index,
              Cell.parseTileFromCell
            ),
            direction: VECTOR_DIRECTION_ENUM.VERTICAL
          }
        ]
      }
      default:
        return [
          {
            line: Board.getHorizontalLine(
              board,
              //@ts-ignore if direction is not undefined, index will always be defined
              this._tiles.index,
              Cell.parseTileFromCell
            ),
            direction: VECTOR_DIRECTION_ENUM.HORIZONTAL
          },

          {
            line: Board.getVerticalLine(
              board,
              //@ts-ignore if direction is not undefined, index will always be defined
              this._tiles.index,
              Cell.parseTileFromCell
            ),
            direction: VECTOR_DIRECTION_ENUM.VERTICAL
          }
        ]
    }
  }

  static getMissingLettersFromLine(
    startingTile: number,
    line: (TileOnBoard | null)[],
    possibleWord: TileOnBoardVector
  ) {
    //check before
    for (let vi = startingTile - 1; vi >= 0; vi--) {
      const tile = line[vi]
      if (tile) possibleWord.insert(tile)
      else break
    }

    //check after
    for (let vi = startingTile; vi < line.length; vi++) {
      const tile = line[vi]
      if (tile) possibleWord.insert(tile)
      else break
    }

    return possibleWord
  }

  getMissingLettersFromBoard(board: Cell[][]) {
    let possibleWord: TileOnBoardVector = new TileOnBoardVector()

    const lines = this.getBoardLine(board)

    let startingTile = this._tiles.start

    for (let line of lines) {
      //check if tiles vector is valid
      if (!this._tiles.isValid) {
        switch (line.direction) {
          case VECTOR_DIRECTION_ENUM.HORIZONTAL:
            startingTile = this._tiles.get(0).row
            break
          case VECTOR_DIRECTION_ENUM.VERTICAL:
            startingTile = this._tiles.get(0).col
            break
        }
      }

      Word.getMissingLettersFromLine(
        startingTile as number,
        line.line,
        possibleWord
      )

      //If possibleWord is valid (vector has 2 or more tiles), a word was found (default to horizontal)
      if (possibleWord.isValid) break
    }

    this._possibleWord = possibleWord
    return this._possibleWord
  }

  async checkDictionary(callback: WordValidationCallbackType) {
    //This fn expects a callback to an api to validate the word
    //Only right-to-left or up-to-down words will be recognized

    //IMPROVE: This might never happen cz find missing tiles fn
    if (!this._possibleWord.isContinuous) return false // has empty spaces

    this._isValid = await callback(this.toString())
    return this._isValid
  }

  map(callback: VectorMapCallbackType<TileOnBoard>) {
    return this._possibleWord.map(callback)
  }

  toString() {
    return this._possibleWord.toString()
  }

  get isValid() {
    return this._isValid
  }

  get position() {
    const { start, end, index, direction } = this._possibleWord
    return { start, end, index, direction } as VectorPositionType
  }
}
