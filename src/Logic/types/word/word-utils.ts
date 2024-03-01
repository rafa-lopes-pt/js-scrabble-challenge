import { CELL_MULTIPLIERS_ENUM } from '../board/board-utils'

export type WordValidationCallbackType = (str: string) => Promise<boolean>

export type WORD_MULTIPLIER_TYPE = {
  value: CELL_MULTIPLIERS_ENUM
  index: number
}
