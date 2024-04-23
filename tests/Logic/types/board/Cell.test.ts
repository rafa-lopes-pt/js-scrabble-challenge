import { describe, expect, it } from 'vitest'
import Cell from '../../../../src/Logic/types/board/Cell'
import { CELL_MULTIPLIERS_ENUM } from '../../../../src/Logic/types/board/board-utils'

describe('Cell class', () => {
  /*
  This test became redundant since Cell.isEqual now depends on the ./utils.ts file
  However ill leave the test anyways cz...its already written and its will warn if
  any future changes to the isEqual fn result in faulty cell equality check
  */
  it('Should contain an isEqual method for proper equality check', () => {
    const cell1 = new Cell(1, 1, { letter: 'A', points: 5 }),
      cell2 = new Cell(1, 1, { letter: 'A', points: 5 }),
      cell3 = new Cell(1, 2, { letter: 'A', points: 5 }),
      cell4 = new Cell(1, 2, { letter: 'A', points: 5 }),
      cell5 = new Cell(1, 2, { letter: 'B', points: 5 })

    expect(cell1.isEqual(cell2)).toBeTruthy()
    expect(cell3.isEqual(cell4)).toBeTruthy()
    expect(cell1.isEqual(cell4)).toBeFalsy()
    expect(cell2.isEqual(cell4)).toBeFalsy()
    expect(cell3.isEqual(cell5)).toBeFalsy()
  })
  it("Anchored cells can't be modifed", () => {
    const cell = new Cell(
      0,
      0,
      { letter: 'A', points: 2 },
      CELL_MULTIPLIERS_ENUM.NULL,
      true
    )
    cell.tile = { letter: 'B', points: 3 }
    expect(cell.tile).toEqual({ letter: 'A', points: 2 })
  })
})
