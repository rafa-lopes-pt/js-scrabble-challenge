import { describe, expect, it } from 'vitest'
import Cell from '../../../../src/Logic/types/board/Cell'
import { CELL_MULTIPLIERS_ENUM } from '../../../../src/Logic/types/board/board-utils'
import { createTestBoard } from '../../../TEST_DATA'
import Board from '../../../../src/Logic/types/board/Board'
describe('Board class', () => {
  describe('static getLine methods', () => {
    const board = createTestBoard(5)
    board[0][0].tile = { letter: 'A', points: 1 }
    board[0][1].tile = { letter: 'B', points: 1 }
    board[1][0].tile = { letter: 'C', points: 1 }
    /*
    A   B   .   .

    C   .   .   .
    
    .   .   .   .
    
    .   .   .   .
    
    .   .   .   .
    
    */

    describe('getHorizontalLine()', () => {
      it('Should return an array containing the specified line', () => {
        const line = Board.getHorizontalLine<Cell>(board, 0)
        const emptyLine = Board.getHorizontalLine<Cell>(board, 3)
        expect(line[0].tile?.letter).toBe('A')
        expect(line[1].tile?.letter).toBe('C')
        expect(line[2].tile?.letter).toBe(undefined)
        expect(emptyLine[0].tile?.letter).toBe(undefined)
      })
    })
    describe('getVerticalLine()', () => {
      it('Should return an array containing the specified line', () => {
        const line = Board.getVerticalLine<Cell>(board, 0)
        const emptyLine = Board.getVerticalLine<Cell>(board, 3)
        expect(line[0].tile?.letter).toBe('A')
        expect(line[1].tile?.letter).toBe('B')
        expect(line[2].tile?.letter).toBe(undefined)
        expect(emptyLine[0].tile?.letter).toBe(undefined)
      })
    })
  })
})
