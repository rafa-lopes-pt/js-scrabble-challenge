import Cell from './Cell'

export enum CELL_MULTIPLIERS_ENUM {
  NULL,
  DL,
  TL,
  DW,
  TW
}

export function applyMultiplierPoints(
  m: WORD_MULTIPLIER_TYPE,
  points: number[]
) {
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

export type CellParserCallback<T> = (cell: Cell, col: number, row: number) => T

export type DictionaryCallback = (word: string) => Promise<boolean>

export enum CELL_HANDLING_CODES {
  IS_ANCHORED,
  HAS_TILE,
  CANT_FORM_WORD,
  IS_EMPTY,
  IS_OK,
  NOT_FOUND
  // IS_UNAVAILABLE -> Implement in the future for boards that contain unreachable cells
}
