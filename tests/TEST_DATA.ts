import Cell from '../src/Logic/types/board/Cell'
import { CELL_MULTIPLIERS_ENUM } from '../src/Logic/types/board/board-utils'
import TileType from '../src/Logic/types/tiles/Tile'
import TileOnBoard from '../src/Logic/types/tiles/TileOnBoard'

export const TEST_VERTICAL_TILES = {
  A: new TileOnBoard({ letter: 'A', points: 1 }, 1, 1),
  B: new TileOnBoard({ letter: 'B', points: 1 }, 1, 2),
  C: new TileOnBoard({ letter: 'C', points: 1 }, 1, 3),
  D: new TileOnBoard({ letter: 'D', points: 1 }, 1, 4),
  E: new TileOnBoard({ letter: 'E', points: 1 }, 1, 5),
  F: new TileOnBoard({ letter: 'F', points: 1 }, 1, 6),
  G: new TileOnBoard({ letter: 'G', points: 1 }, 1, 7)
}
export const TEST_HORIZONTAL_TILES = {
  A: new TileOnBoard({ letter: 'A', points: 1 }, 1, 1),
  B: new TileOnBoard({ letter: 'B', points: 1 }, 2, 1),
  C: new TileOnBoard({ letter: 'C', points: 1 }, 3, 1),
  D: new TileOnBoard({ letter: 'D', points: 1 }, 4, 1),
  E: new TileOnBoard({ letter: 'E', points: 1 }, 5, 1),
  F: new TileOnBoard({ letter: 'F', points: 1 }, 6, 1),
  G: new TileOnBoard({ letter: 'G', points: 1 }, 7, 1)
}

/*
LOOKUP:
Array.fill creates copies by reference!
https://stackoverflow.com/a/37951043/22510505
*/
export const createTestBoard = (length = 15) =>
  Array.from({ length }, (e) => Array.from({ length }, (e) => new Cell()))

export const EMPTY_TEST_BOARD = createTestBoard()
