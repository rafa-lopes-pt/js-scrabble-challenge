import TileType from '../tiles/Tile'
import TileSetType from '../tiles/TileSet'
import LangType from './Lang'
import { CHARACTER_TYPE_ENUM } from './lang-utils'

/**
 * Represents the tile set being used.
 * Defines the available tiles, and the language properties
 */
export default class LangSet {
  lang: LangType
  tileSet: TileSetType

  constructor(lang: LangType, set: TileSetType) {
    this.lang = lang
    this.tileSet = []
    for (const tile of set) {
      this.tileSet.push({ ...tile })
    }
  }

  //IMPROVE: Might be dead code
  static fromJSON(str: string) {
    try {
      const data = JSON.parse(str)
      const keys = Object.keys(this)
      const dataEntries = Object.entries(data)

      for (const [key, value] of dataEntries) {
        if (!keys.includes(key)) throw new Error()
      }

      const obj = new LangSet(data?.lang, data?.set)

      return obj
    } catch (err) {
      throw new Error('Could not parse lang set. Invalid JSON: \n' + str)
    }
  }

  has(search: string) {
    return this.tileSet.find((e) => e.letter === search && e.quantity > 0)
      ? true
      : false
  }
  /**
   * Returns the index of the first element in the array where predicate is true, and -1 otherwise.
   */
  findIndex(tile: TileType) {
    return this.tileSet.findIndex(
      (e) => e.letter === tile.letter && e.points === tile.points
    )
  }
  /**
   * Returns the quantity of vowels
   */
  get vowels() {
    return this.tileSet.reduce(
      (sum, e) =>
        e.type === CHARACTER_TYPE_ENUM.VOWEL ? sum + e.quantity : sum,
      0
    )
  }
  /**
   * Returns the quantity of consonants
   */
  get consonants() {
    return this.tileSet.reduce(
      (sum, e) =>
        e.type === CHARACTER_TYPE_ENUM.CONSONANT ? sum + e.quantity : sum,
      0
    )
  }
  /**
   * Returns the quantity of special characters
   */
  get special() {
    return this.tileSet.reduce(
      (sum, e) =>
        e.type === CHARACTER_TYPE_ENUM.SPECIAL ? sum + e.quantity : sum,
      0
    )
  }
  /**
   * Returns the total quantity of tiles
   */
  get totalTiles() {
    return this.tileSet.reduce((sum, e) => sum + e.quantity, 0)
  }
}
