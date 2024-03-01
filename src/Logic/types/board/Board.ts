import TileType from '../tiles/Tile'
import TileOnBoard from '../tiles/TileOnBoard'
import TileOnBoardVector from '../vector/TileOnBoardVector'
import { VECTOR_DIRECTION_ENUM } from '../vector/vector-utils'
import Word from '../word/Word'
import {
  WORD_MULTIPLIER_TYPE,
  WordValidationCallbackType
} from '../word/word-utils'
import Cell from './Cell'
import { CELL_MULTIPLIERS_ENUM } from './board-utils'

export default class Board {
  private _grid: Cell[][]
  private _wordsList: Word[]
  private _mainWord: Word | undefined

  constructor(grid?: Cell[][], wordsList?: Word[], mainWord?: Word) {
    this._grid = grid || new Array(15).fill(new Array(15).fill(new Cell()))

    this.defineBoardMultipliers()

    this._wordsList = wordsList || new Array<Word>()
    this._mainWord = mainWord
  }

  //NOTE: This could be way better and much more optimized
  defineBoardMultipliers() {
    //TW -> Corners and middle lines (H and 8)
    //corners
    /*
      TL [0,0]                              TM[][]                                TR [this._grid.length - 1][0]
    





    
       TL [0][this._grid[0].length - 1]                                     TR [this._grid.length - 1][this._grid[0].length - 1]
    */

    const TW_coordinates = [
      //topLeft:
      { col: 0, row: 0 },
      //topMiddle:
      { col: Math.ceil((this._grid.length - 1) / 2), row: 0 },
      //topRight:
      { col: this._grid.length - 1, row: 0 },
      //MiddleLeft:
      { col: 0, row: Math.ceil((this._grid[0].length - 1) / 2) },
      //MiddleRight:
      {
        col: Math.ceil((this._grid.length - 1) / 2),
        row: Math.ceil((this._grid[0].length - 1) / 2)
      },
      //bottomLeft:
      { col: 0, row: this._grid[0].length - 1 },
      //bottomMiddle:
      {
        col: Math.ceil((this._grid.length - 1) / 2),
        row: this._grid[0].length - 1
      },
      //bottomRight:
      { col: this._grid.length - 1, row: this._grid[0].length - 1 }
    ]

    for (let tw of TW_coordinates) {
      this._grid[tw.col][tw.row] = new Cell(CELL_MULTIPLIERS_ENUM.TW)
    }

    const DW_coordinates = {
      topLeftCorner: [
        { col: 1, row: 1 },
        { col: 2, row: 2 },
        { col: 3, row: 3 },
        { col: 4, row: 4 }
      ],
      topRightCorner: [
        { col: this._grid.length - 2, row: 1 },
        { col: this._grid.length - 3, row: 2 },
        { col: this._grid.length - 4, row: 3 },
        { col: this._grid.length - 5, row: 4 }
      ],
      bottomLeftCorner: [
        { col: 0, row: this._grid[0].length - 2 },
        { col: 0, row: this._grid[0].length - 3 },
        { col: 0, row: this._grid[0].length - 4 },
        { col: 0, row: this._grid[0].length - 5 }
      ],
      bottomRightCorner: [
        { col: this._grid.length - 2, row: this._grid[0].length - 2 },
        { col: this._grid.length - 3, row: this._grid[0].length - 3 },
        { col: this._grid.length - 4, row: this._grid[0].length - 4 },
        { col: this._grid.length - 5, row: this._grid[0].length - 5 }
      ]
    }
    for (let corner in DW_coordinates) {
      for (let dw of DW_coordinates[corner]) {
        this._grid[dw.col][dw.row] = new Cell(CELL_MULTIPLIERS_ENUM.DW)
      }
    }

    /*
            [c1,c2]
         [c1,c2,c3,c4]
         [c1,c2,c3,c4]
            [c1,c2]
    */
    const TL_coordinates = [
      [
        { col: Math.ceil(this._grid.length / 2) - 2, row: 1 },
        { col: Math.ceil(this._grid.length / 2) + 2, row: 1 }
      ],
      //
      [
        { col: 1, row: Math.ceil(this._grid[0].length / 2) - 2 },
        {
          col: Math.ceil(this._grid.length / 2) - 2,
          row: Math.ceil(this._grid[0].length / 2) - 2
        },
        {
          col: Math.ceil(this._grid.length / 2) + 2,
          row: Math.ceil(this._grid[0].length / 2) - 2
        },
        {
          col: this._grid.length - 2,
          row: Math.ceil(this._grid[0].length / 2) - 2
        }
      ],
      //
      [
        { col: 1, row: Math.ceil(this._grid[0].length / 2) + 2 },
        {
          col: Math.ceil(this._grid.length / 2) - 2,
          row: Math.ceil(this._grid[0].length / 2) + 2
        },
        {
          col: Math.ceil(this._grid.length / 2) + 2,
          row: Math.ceil(this._grid[0].length / 2) + 2
        },
        {
          col: this._grid.length - 2,
          row: Math.ceil(this._grid[0].length / 2) + 2
        }
      ],
      //
      [
        {
          col: Math.ceil(this._grid.length / 2) - 2,
          row: this._grid[0].length - 2
        },
        {
          col: Math.ceil(this._grid.length / 2) + 2,
          row: this._grid[0].length - 2
        }
      ]
    ]
    for (let row of TL_coordinates) {
      for (let tl of row) {
        this._grid[tl.col][tl.row] = new Cell(CELL_MULTIPLIERS_ENUM.TL)
      }
    }

    /*
        TOP
                      [c1,..............,c2]

                            [c1,....,c2]
                [c1,............,c2,............,c3]
          
        MID

            [c1,...........,c2,.....,c3,...........,c4]
            [....c1,...........................,c2....]
            [c1,...........,c2,.....,c3,...........,c4]
        
        BOT = TOP mirrored
                 
                 
    */
    const DL_coordinates = {
      top: [
        [
          { col: Math.floor(this._grid.length * (1 / 4)), row: 0 },
          { col: Math.floor(this._grid.length * (3 / 4)), row: 0 }
        ],
        [
          { col: Math.ceil(this._grid.length / 2) - 1, row: 2 },
          { col: Math.ceil(this._grid.length / 2) + 1, row: 2 }
        ],
        [
          { col: 0, row: 3 },
          { col: Math.ceil(this._grid.length / 2), row: 3 },
          { col: 0, row: 3 }
        ]
      ],
      middle: [
        [
          {
            col: Math.floor(this._grid.length * (1 / 4)) - 1,
            row: Math.ceil(this._grid.length / 2) - 1
          },
          {
            col: Math.ceil(this._grid.length / 2) - 1,
            row: Math.ceil(this._grid.length / 2) - 1
          },
          {
            col: Math.ceil(this._grid.length / 2) + 1,
            row: Math.ceil(this._grid.length / 2) - 1
          },
          {
            col: Math.floor(this._grid.length * (3 / 4)) - 1,
            row: Math.ceil(this._grid.length / 2) - 1
          }
        ],
        [
          {
            col: Math.floor(this._grid.length * (1 / 4)),
            row: Math.ceil(this._grid.length / 2)
          },
          {
            col: Math.floor(this._grid.length * (3 / 4)),
            row: Math.ceil(this._grid.length / 2)
          }
        ],
        [
          {
            col: Math.floor(this._grid.length / 4) - 1,
            row: Math.ceil(this._grid.length / 2) + 1
          },
          {
            col: Math.ceil(this._grid.length / 2) - 1,
            row: Math.ceil(this._grid.length / 2) + 1
          },
          {
            col: Math.ceil(this._grid.length / 2) + 1,
            row: Math.ceil(this._grid.length / 2) + 1
          },
          {
            col: Math.floor(this._grid.length * (3 / 4)) - 1,
            row: Math.ceil(this._grid.length / 2) + 1
          }
        ]
      ],
      bottom: [
        [
          { col: 0, row: this._grid.length - 4 },
          { col: Math.ceil(this._grid.length / 2), row: this._grid.length - 4 },
          { col: 0, row: this._grid.length - 4 }
        ],
        [
          {
            col: Math.ceil(this._grid.length / 2) - 1,
            row: this._grid.length - 3
          },
          {
            col: Math.ceil(this._grid.length / 2) + 1,
            row: this._grid.length - 3
          }
        ],
        [
          {
            col: Math.floor(this._grid.length * (1 / 4)),
            row: this._grid.length - 1
          },
          {
            col: Math.floor(this._grid.length * (3 / 4)),
            row: this._grid.length - 1
          }
        ]
      ]
    }

    for (let zone in DL_coordinates) {
      for (let row of DL_coordinates[zone]) {
        for (let dl of row) {
          this._grid[dl.col][dl.row] = new Cell(CELL_MULTIPLIERS_ENUM.DL)
        }
      }
    }
  }

  //================================================= BOARD INTERACTION START
  //IMPROVE: Return error codes instead of boolean?
  // show why tile cant be placed
  placeTile(tile: TileType, row: number, col: number) {
    const cell = this._grid[col][row]

    if (cell.isEmpty) {
      cell.tile = tile

      if (!this._mainWord) {
        this._mainWord = new Word()
      }

      //NOTE: Tile validation should be done in class Word
      // addTile checks if tile can be placed, according to the word, and checks against diagonals
      return this._mainWord.addTile({ ...tile, col, row } as TileOnBoard)
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
      return this._mainWord?.removeTile(tile)
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
    return this._mainWord?.removeAll()
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
    if (!this._mainWord) throw new Error('main word is not defined')

    for (
      let i = this._mainWord.position.start as number;
      i <= (this._mainWord.position.end as number);
      i++
    ) {
      // Anchored cells have already been searched
      if (this._grid[i][this._mainWord.position.index as number].isAnchored) {
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

      this._wordsList.push(nWord)
    }
  }
  private findVerticalWords() {
    if (!this._mainWord) throw new Error('main word is not defined')

    for (
      let i = this._mainWord.position.start as number;
      i <= (this._mainWord.position.end as number);
      i++
    ) {
      // Anchored cells have already been searched
      if (this._grid[this._mainWord.position.index as number][i].isAnchored) {
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

      this._wordsList.push(nWord)
    }
  }

  private async validatePlacement(
    dictionaryCallback: WordValidationCallbackType
  ) {
    //QUICKFIX:Safety check -> may be redundant, but this way no duplicate words will be found
    this._wordsList = []
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
    this._mainWord?.getMissingLettersFromBoard(this._grid)
    await this._mainWord?.checkDictionary(dictionaryCallback)
    if (!this._mainWord?.isValid) return false

    // ============================== IF SO -> CHECK FOR ADDITIONAL WORDS

    switch (this._mainWord.position.direction) {
      case VECTOR_DIRECTION_ENUM.HORIZONTAL: {
        this.findHorizontalWords()
      }
      case VECTOR_DIRECTION_ENUM.VERTICAL: {
        this.findVerticalWords()
      }
    }

    // ============================== VALIDATE WORD LIST
    for (const word of this._wordsList) {
      const isValid = await word.checkDictionary(dictionaryCallback)
      if (!isValid) {
        //If one of the found words is not valid, means that the word
        //cant be placed, even if its a real word
        this._wordsList = []
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
        case CELL_MULTIPLIERS_ENUM.DL: {
          // -> Multiply specific letter by 2
          return points.reduce(
            (sum, p, i) => (i === m.index ? sum + p * 2 : sum + p),
            0
          )
        }
        case CELL_MULTIPLIERS_ENUM.TL: {
          // -> Multiply specific letter by 3
          return points.reduce(
            (sum, p, i) => (i === m.index ? sum + p * 3 : sum + p),
            0
          )
        }
        case CELL_MULTIPLIERS_ENUM.DW: {
          // -> Multiply whole word 3
          return points.reduce((sum, p) => sum + p, 0) * 2
        }

        case CELL_MULTIPLIERS_ENUM.TW: {
          // -> Multiply whole word 3
          return points.reduce((sum, p) => sum + p, 0) * 3
        }

        default:
          return points.reduce((sum, p) => sum + p, 0)
      }
    }
    for (let word of this._wordsList) {
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

    this._mainWord?.removeAll()

    return points
  }
}
