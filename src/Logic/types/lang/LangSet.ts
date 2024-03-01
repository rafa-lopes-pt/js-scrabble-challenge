import TileSetType from '../tiles/TileSet'
import { CHARACTER_TYPE_ENUM } from './lang-utils'
import LangType from './Lang'

/*
English-language editions of Scrabble contain 100 letter tiles, in the following distribution:

2 blank tiles (scoring 0 points)
1 point: E ×12, A ×9, I ×9, O ×8, N ×6, R ×6, T ×6, L ×4, S ×4, U ×4
2 points: D ×4, G ×3
3 points: B ×2, C ×2, M ×2, P ×2
4 points: F ×2, H ×2, V ×2, W ×2, Y ×2
5 points: K ×1
8 points: J ×1, X ×1
10 points: Q ×1, Z ×1

*/

export default class LangSet {
  protected lang: LangType
  protected tileSet: TileSetType

  constructor(lang: LangType, set: TileSetType) {
    this.lang = lang
    this.tileSet = set
  }

  static fromJSON(str) {
    try {
      const data = JSON.parse(str)
      const keys = Object.keys(this)
      const values = Object.values(this)
      let isEqual = true

      const dataEntries = Object.entries(data)

      for (const [key, value] of dataEntries) {
        if (!keys.includes(key)) isEqual = false
        //IMPROVE: Should improve this check...but for now it will do
        if (typeof values[key] !== typeof value) isEqual = false

        if (!isEqual) break
      }
      return data as unknown as LangSet
    } catch (err) {
      throw new Error('Could not parse lang set. Invalid object: \n' + str)
    }
  }

  get vowels() {
    return this.tileSet.reduce(
      (sum, e) => (e.type === CHARACTER_TYPE_ENUM.VOWEL ? sum++ : sum),
      0
    )
  }

  get consonants() {
    return this.tileSet.reduce(
      (sum, e) => (e.type === CHARACTER_TYPE_ENUM.CONSONANT ? sum++ : sum),
      0
    )
  }

  get special() {
    return this.tileSet.reduce(
      (sum, e) => (e.type === CHARACTER_TYPE_ENUM.SPECIAL ? sum++ : sum),
      0
    )
  }

  get total() {
    return this.tileSet.length
  }
}
