import { CELL_MULTIPLIERS_ENUM } from './board-utils'

export type MultiplierPositionType = {
  cell: { col: number; row: number }
  type: CELL_MULTIPLIERS_ENUM
}
export type MultiplierMap = Array<MultiplierPositionType>

//============ MAP 1 =================
const DL_Multipliers_Coordinates: MultiplierMap = [
  { cell: { col: 3, row: 0 }, type: CELL_MULTIPLIERS_ENUM.DL },
  { cell: { col: 11, row: 0 }, type: CELL_MULTIPLIERS_ENUM.DL },
  { cell: { col: 6, row: 2 }, type: CELL_MULTIPLIERS_ENUM.DL },
  { cell: { col: 8, row: 2 }, type: CELL_MULTIPLIERS_ENUM.DL },
  { cell: { col: 0, row: 3 }, type: CELL_MULTIPLIERS_ENUM.DL },
  { cell: { col: 7, row: 3 }, type: CELL_MULTIPLIERS_ENUM.DL },
  { cell: { col: 14, row: 3 }, type: CELL_MULTIPLIERS_ENUM.DL },
  //
  { cell: { col: 2, row: 6 }, type: CELL_MULTIPLIERS_ENUM.DL },
  { cell: { col: 6, row: 6 }, type: CELL_MULTIPLIERS_ENUM.DL },
  { cell: { col: 8, row: 6 }, type: CELL_MULTIPLIERS_ENUM.DL },
  { cell: { col: 12, row: 6 }, type: CELL_MULTIPLIERS_ENUM.DL },
  { cell: { col: 3, row: 7 }, type: CELL_MULTIPLIERS_ENUM.DL },
  { cell: { col: 11, row: 7 }, type: CELL_MULTIPLIERS_ENUM.DL },
  { cell: { col: 2, row: 8 }, type: CELL_MULTIPLIERS_ENUM.DL },
  { cell: { col: 6, row: 8 }, type: CELL_MULTIPLIERS_ENUM.DL },
  { cell: { col: 8, row: 8 }, type: CELL_MULTIPLIERS_ENUM.DL },
  { cell: { col: 12, row: 8 }, type: CELL_MULTIPLIERS_ENUM.DL },
  //
  { cell: { col: 3, row: 14 }, type: CELL_MULTIPLIERS_ENUM.DL },
  { cell: { col: 11, row: 14 }, type: CELL_MULTIPLIERS_ENUM.DL },
  { cell: { col: 6, row: 12 }, type: CELL_MULTIPLIERS_ENUM.DL },
  { cell: { col: 8, row: 12 }, type: CELL_MULTIPLIERS_ENUM.DL },
  { cell: { col: 0, row: 11 }, type: CELL_MULTIPLIERS_ENUM.DL },
  { cell: { col: 7, row: 11 }, type: CELL_MULTIPLIERS_ENUM.DL },
  { cell: { col: 14, row: 11 }, type: CELL_MULTIPLIERS_ENUM.DL }
]
const TL_Multipliers_Coordinates: MultiplierMap = [
  { cell: { col: 5, row: 1 }, type: CELL_MULTIPLIERS_ENUM.TL },
  { cell: { col: 9, row: 1 }, type: CELL_MULTIPLIERS_ENUM.TL },
  //
  { cell: { col: 1, row: 5 }, type: CELL_MULTIPLIERS_ENUM.TL },
  { cell: { col: 5, row: 5 }, type: CELL_MULTIPLIERS_ENUM.TL },
  { cell: { col: 9, row: 5 }, type: CELL_MULTIPLIERS_ENUM.TL },
  { cell: { col: 13, row: 5 }, type: CELL_MULTIPLIERS_ENUM.TL },
  //
  { cell: { col: 1, row: 9 }, type: CELL_MULTIPLIERS_ENUM.TL },
  { cell: { col: 5, row: 9 }, type: CELL_MULTIPLIERS_ENUM.TL },
  { cell: { col: 9, row: 9 }, type: CELL_MULTIPLIERS_ENUM.TL },
  { cell: { col: 13, row: 9 }, type: CELL_MULTIPLIERS_ENUM.TL },
  //
  { cell: { col: 5, row: 13 }, type: CELL_MULTIPLIERS_ENUM.TL },
  { cell: { col: 9, row: 13 }, type: CELL_MULTIPLIERS_ENUM.TL }
]
const DW_Multipliers_Coordinates: MultiplierMap = [
  { cell: { col: 1, row: 1 }, type: CELL_MULTIPLIERS_ENUM.DW },
  { cell: { col: 13, row: 1 }, type: CELL_MULTIPLIERS_ENUM.DW },
  { cell: { col: 2, row: 2 }, type: CELL_MULTIPLIERS_ENUM.DW },
  { cell: { col: 12, row: 2 }, type: CELL_MULTIPLIERS_ENUM.DW },
  { cell: { col: 3, row: 3 }, type: CELL_MULTIPLIERS_ENUM.DW },
  { cell: { col: 11, row: 3 }, type: CELL_MULTIPLIERS_ENUM.DW },
  { cell: { col: 4, row: 4 }, type: CELL_MULTIPLIERS_ENUM.DW },
  { cell: { col: 10, row: 4 }, type: CELL_MULTIPLIERS_ENUM.DW },
  //
  { cell: { col: 1, row: 13 }, type: CELL_MULTIPLIERS_ENUM.DW },
  { cell: { col: 13, row: 13 }, type: CELL_MULTIPLIERS_ENUM.DW },
  { cell: { col: 2, row: 12 }, type: CELL_MULTIPLIERS_ENUM.DW },
  { cell: { col: 12, row: 12 }, type: CELL_MULTIPLIERS_ENUM.DW },
  { cell: { col: 3, row: 11 }, type: CELL_MULTIPLIERS_ENUM.DW },
  { cell: { col: 11, row: 11 }, type: CELL_MULTIPLIERS_ENUM.DW },
  { cell: { col: 4, row: 10 }, type: CELL_MULTIPLIERS_ENUM.DW },
  { cell: { col: 10, row: 10 }, type: CELL_MULTIPLIERS_ENUM.DW }
]
const TW_Multipliers_Coordinates: MultiplierMap = [
  { cell: { col: 0, row: 0 }, type: CELL_MULTIPLIERS_ENUM.TW },
  { cell: { col: 7, row: 0 }, type: CELL_MULTIPLIERS_ENUM.TW },
  { cell: { col: 14, row: 0 }, type: CELL_MULTIPLIERS_ENUM.TW },
  //
  { cell: { col: 0, row: 7 }, type: CELL_MULTIPLIERS_ENUM.TW },
  { cell: { col: 14, row: 7 }, type: CELL_MULTIPLIERS_ENUM.TW },
  //
  { cell: { col: 0, row: 14 }, type: CELL_MULTIPLIERS_ENUM.TW },
  { cell: { col: 7, row: 14 }, type: CELL_MULTIPLIERS_ENUM.TW },
  { cell: { col: 14, row: 14 }, type: CELL_MULTIPLIERS_ENUM.TW }
]
//====================================

//IMPROVE: Add support for multiple multiplier maps
export const multiplierMaps = [
  [
    ...DL_Multipliers_Coordinates,
    ...TL_Multipliers_Coordinates,
    ...DW_Multipliers_Coordinates,
    ...TW_Multipliers_Coordinates
  ]
]
