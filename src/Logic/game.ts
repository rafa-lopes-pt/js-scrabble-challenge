import { Timer } from './timer'
import { Player } from './player'
import { LangSet, TileSetType } from './types'
import englishSet from './Lang/en-uk.json'
const GAME_LANG_SETS = {
  ENGLISH: LangSet.fromJSON(englishSet)
}
