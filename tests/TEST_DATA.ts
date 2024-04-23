import Cell from '../src/Logic/types/board/Cell'

export const TEST_VERTICAL_CELLS = {
  A: new Cell(1, 1, { letter: 'A', points: 1 }),
  B: new Cell(1, 2, { letter: 'B', points: 1 }),
  C: new Cell(1, 3, { letter: 'C', points: 1 }),
  D: new Cell(1, 4, { letter: 'D', points: 1 }),
  E: new Cell(1, 5, { letter: 'E', points: 1 }),
  F: new Cell(1, 6, { letter: 'F', points: 1 }),
  G: new Cell(1, 7, { letter: 'G', points: 1 })
}
export const TEST_HORIZONTAL_CELLS = {
  A: new Cell(1, 1, { letter: 'A', points: 1 }),
  B: new Cell(2, 1, { letter: 'B', points: 1 }),
  C: new Cell(3, 1, { letter: 'C', points: 1 }),
  D: new Cell(4, 1, { letter: 'D', points: 1 }),
  E: new Cell(5, 1, { letter: 'E', points: 1 }),
  F: new Cell(6, 1, { letter: 'F', points: 1 }),
  G: new Cell(7, 1, { letter: 'G', points: 1 })
}

export const TEST_TILES = {
  A: { letter: 'A', points: 1 },
  B: { letter: 'B', points: 1 },
  C: { letter: 'C', points: 1 },
  D: { letter: 'D', points: 1 },
  E: { letter: 'E', points: 1 },
  F: { letter: 'F', points: 1 },
  G: { letter: 'G', points: 1 }
}

/*
LOOKUP:
Array.fill creates copies by reference!
https://stackoverflow.com/a/37951043/22510505
*/
export const createTestBoard = (length = 15) =>
  Array.from({ length }, (e, i) =>
    Array.from({ length }, (e, j) => new Cell(i, j))
  )

export const EMPTY_TEST_BOARD = createTestBoard()
