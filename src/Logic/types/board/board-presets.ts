import { MultiplierMap, multiplierMaps } from './multipliers-placement'

export type BoardPresetType = {
  cols: number
  rows: number
  multiplierMap: MultiplierMap
}

export const BOARD_PRESETS = {
  DEFAULT: {
    cols: 15,
    rows: 15,
    multiplierMap: multiplierMaps[0]
  } as BoardPresetType
}
