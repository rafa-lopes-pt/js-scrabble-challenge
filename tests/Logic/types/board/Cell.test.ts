import { describe, expect, it } from 'vitest'
import Cell from '../../../../src/Logic/types/board/Cell'
import { CELL_MULTIPLIERS_ENUM } from '../../../../src/Logic/types/board/board-utils'

describe('Cell class', () => {
  it('Once isAnchored is set to true, multiplier should become null', () => {
    const cell = new Cell({ letter: 'A', points: 1 }, CELL_MULTIPLIERS_ENUM.DL)

    expect(cell.multiplier).toBe(CELL_MULTIPLIERS_ENUM.DL)
    cell.isAnchored = true
    expect(cell.multiplier).toBe(CELL_MULTIPLIERS_ENUM.NULL)
  })
})
