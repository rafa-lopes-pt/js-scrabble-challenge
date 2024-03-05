import { describe, it, expect, beforeAll, afterEach, beforeEach } from 'vitest'
import Rack from '../../../../src/Logic/types/player/Rack'
import TileOnBoard from '../../../../src/Logic/types/tiles/TileOnBoard'
import TileType from '../../../../src/Logic/types/tiles/Tile'
import TileOnBoardVector from '../../../../src/Logic/types/vector/TileOnBoardVector'
import {
  EMPTY_TEST_BOARD,
  TEST_HORIZONTAL_TILES,
  TEST_VERTICAL_TILES
} from '../../../TEST_DATA'
import { VECTOR_DIRECTION_ENUM } from '../../../../src/Logic/types/vector/vector-utils'
import Word from '../../../../src/Logic/types/word/Word'
import { WordValidationCallbackType } from '../../../../src/Logic/types/word/word-utils'
import Cell from '../../../../src/Logic/types/board/Cell'
import Board from '../../../../src/Logic/types/board/Board'

describe('Word class', () => {
  //Word class is composed of 2 vectors
  //tiles -> user input
  //possibleWord -> inferred word from board
  //possibleWord should be reset upon changes on tile vector
  let word = new Word()
  beforeEach(() => {
    word = new Word(
      new TileOnBoardVector(
        new TileOnBoard({ letter: 'B', points: 1 }, 0, 1),
        new TileOnBoard({ letter: 'D', points: 1 }, 2, 1)
      )
    )
  })

  describe('Word.getMissingLettersFromLine()', () => {
    it('Should update possibleWord', () => {
      EMPTY_TEST_BOARD[1][1].tile = { letter: 'A', points: 1 }

      const line = Board.getHorizontalLine(
        EMPTY_TEST_BOARD,
        1,
        Cell.parseTileFromCell
      )

      expect(line.some((e) => e.tile)).toBeTruthy()

      const possibleWord = Word.getMissingLettersFromLine(1, line, new TileOnBoardVector())
      //expect(possibleWord).toBe('BAD')
    })
  })

  describe('getMissingLettersFromBoard()', () => {
    it('Should update possibleWord', () => {
      EMPTY_TEST_BOARD[1][1].tile = { letter: 'A', points: 1 }

      const line = Board.getHorizontalLine<Cell>(EMPTY_TEST_BOARD, 1)

      expect(line.some((e) => e.tile)).toBeTruthy()

      const possibleWord = word.getMissingLettersFromBoard(EMPTY_TEST_BOARD)
      //expect(possibleWord).toBe('BAD')
    })
  })

  describe('checkDictionary()', () => {
    it('Should ', () => {
      // word.getMissingLettersFromBoard([[]])
      //   word.checkDictionary(fn)
      // expect(word.isValid).toBeTruthy()
    })
  })

  it("Should convert the word to a string, only if there's a possible word defined. Otherwise return an empty string", () => {
    // expect(new Word().toString()).toBe('')
    // expect(new Word().toString()).toBe('BAD')
  })

  describe('addTile()', () => {
    it('Should add a new tile, invalidating the word', () => {})
  })
})
