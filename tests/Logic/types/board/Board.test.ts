import { describe, expect, it } from 'vitest'
import Cell from '../../../../src/Logic/types/board/Cell'
import { CELL_MULTIPLIERS_ENUM } from '../../../../src/Logic/types/board/board-utils'
import { createTestBoard } from '../../../TEST_DATA'
import Board from '../../../../src/Logic/types/board/Board'
import { BOARD_PRESETS } from '../../../../src/Logic/types/board/board-presets'
describe('Board class', () => {
  const board = new Board(BOARD_PRESETS.DEFAULT)

  describe('placeTile() === TODO ===', () => {
    it('Should add new tiles to the board, if their position is valid', () => {
      /*
    Test proper error throwing
     */
      board.placeTile({ letter: 'B', points: 1 }, 0, 0)
      board.placeTile({ letter: 'U', points: 1 }, 1, 0)
      board.placeTile({ letter: 'I', points: 1 }, 2, 0)
      board.placeTile({ letter: 'C', points: 1 }, 3, 0)
      board.placeTile({ letter: 'A', points: 1 }, 4, 0)
    })
  })

  it('mainWord should return a string representing the newly, inserted tiles', () => {
    expect(board.mainWord).toBe('BUICA')
    board.anchorCells()
    expect(board.mainWord).toBe(undefined)
  })

  describe('getAdjacentWords()', () => {
    it('', () => {
      board.placeTile({ letter: 'O', points: 1 }, 0, 1)
      board.placeTile({ letter: 'O', points: 1 }, 0, 2)
      board.placeTile({ letter: 'O', points: 1 }, 3, 2)

      expect(board.mainWord).toBe('BOO')

      expect(board.getAdjacentWords()).toEqual(['BUICA'])
    })
  })

  describe('takeTile() === TODO ===', () => {
    it('Should remove tiles from the board, if their position is valid', () => {
      /*
    Test proper error throwing
     */
    })
  })
})
