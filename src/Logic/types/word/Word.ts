import Board from '../board/Board'
import Cell from '../board/Cell'
import TileOnBoard from '../tiles/TileOnBoard'
import TileOnBoardVector from '../vector/TileOnBoardVector'
import VectorPositionType from '../vector/VectorPosition'
import {
  VECTOR_DIRECTION_ENUM,
  VectorMapCallbackType
} from '../vector/vector-utils'
import { WordValidationCallbackType } from '../word/word-utils'

export default class Word {
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
    if (this._tiles.length === 0)
      throw new Error('Word contains no user defined tiles')

    let possibleWord: TileOnBoardVector = new TileOnBoardVector()

    const lines = this.getBoardLine(board)

    let startingTile = this._tiles.start

    for (let line of lines) {
      //check if tiles vector is valid
      // if its not, need to define a starting point
      if (!this._tiles.isValid) {
        switch (line.direction) {
          case VECTOR_DIRECTION_ENUM.HORIZONTAL:
            //@ts-ignore - tiles len is checked at function start
            startingTile = this._tiles.get(0).row
            break
          case VECTOR_DIRECTION_ENUM.VERTICAL:
            //@ts-ignore - tiles len is checked at function start
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
