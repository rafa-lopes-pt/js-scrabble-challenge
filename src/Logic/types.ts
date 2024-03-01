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

import { Rack } from './player'
import { isSequence } from './utils'

export interface TileType {
  letter: string
  points: number
}

export enum CHARACTER_TYPE_ENUM {
  VOWEL,
  CONSONANT,
  SPECIAL
}

export interface TileFromSetType extends TileType {
  qt: number
  type: CHARACTER_TYPE_ENUM
}

export type TileSetType = TileFromSetType[]

export interface LangType {
  id: string
  label: string
}

export class LangSet {
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

export class TileBag extends LangSet {
  swap(tile: TileType) {
    let newTile = this.takeTile()
    this.putTile(tile)
  }

  private putTile(tile: TileType) {
    const tileIndex = this.tileSet.findIndex((e) => e.letter === tile.letter)
    if (tileIndex > 0) {
      this.tileSet[tileIndex].qt++
      return true
    } else return false
  }

  private takeTile() {
    let randomIndex = -1
    do {
      randomIndex = Math.floor(Math.random() * this.tileSet.length - 1)
    } while (this.tileSet[randomIndex].qt === 0)

    const tile: TileType = this.tileSet[randomIndex]
    this.tileSet[randomIndex].qt--
    return tile
  }

  fillRack(rack: Rack) {
    while (rack.isIncomplete) {
      rack.add(this.takeTile())
    }
    return rack //rack is a ref...so...dont need the return i think
  }
}

export enum BOARD_MULTIPLIERS_ENUM {
  NULL,
  DL,
  TL,
  DW ,
  TW 
}

export type WORD_MULTIPLIER_TYPE = {
  value: BOARD_MULTIPLIERS_ENUM
  index: number
}

export class TileOnBoard implements TileType {
  private _letter: string
  private _points: number
  private _row: number
  private _col: number

  constructor(tile: TileType, row: number, col: number) {
    this._col = col
    this._row = row
    this._letter = tile.letter
    this._points = tile.points
  }

  isEqual(tile: TileOnBoard) {
    const keys = Object.keys(this),
      tileKeys = Object.keys(tile)

    if (keys.length !== tileKeys.length) return false

    for (let key in keys) {
      if (!tile.hasOwnProperty(key) || this[key] !== tile[key]) return false
    }

    return true
  }

  get letter() {
    return this._letter
  }
  get points() {
    return this._points
  }
  get row() {
    return this._row
  }
  get col() {
    return this._col
  }
}

export type WordValidationCallbackType = (str: string) => Promise<boolean>

export enum VECTOR_DIRECTION_ENUM {
  HORIZONTAL,
  VERTICAL,
  UNDEFINED
}
export type VectorPositionType = {
  start: number | undefined
  end: number | undefined
  index: number | undefined
  direction: VECTOR_DIRECTION_ENUM
}

interface Vector<T> extends VectorPositionType {
  first: T
  last: T
  length: number
  isEmpty: boolean
  /*
  isValid
    @true - a proper vector with at least 2 points
    @false - a "pseudo-vector" that needs a 2 point to be defined
  */
  isValid: boolean
  insert: (tile: T) => boolean
  removeIndex: (i: number) => T | undefined
  remove: (el: T) => T | undefined
  removeAll: () => T[]
  get: (index: number) => T
  map: (callback: VectorMapCallbackType<T>) => unknown[]
  toString: () => string
}
export type VectorMapCallbackType<T> = (e: T, i?: number) => unknown

export class TileOnBoardVector implements Vector<TileOnBoard> {
  private vector: TileOnBoard[]
  private _start: number | undefined
  private _end: number | undefined
  private _index: number | undefined
  private _direction: VECTOR_DIRECTION_ENUM

  constructor(...items: TileOnBoard[]) {
    this.vector = items
    this.sequence()
  }

  private findDirection() {
    if (this.vector.length <= 1) {
      return VECTOR_DIRECTION_ENUM.UNDEFINED
    }

    if (this.vector.every((e) => e.col === this.vector[0].col))
      return VECTOR_DIRECTION_ENUM.VERTICAL
    //
    else if (this.vector.every((e) => e.row === this.vector[0].row))
      return VECTOR_DIRECTION_ENUM.HORIZONTAL
    //
    else return VECTOR_DIRECTION_ENUM.UNDEFINED
    //
  }

  private sequence() {
    this._direction = this.findDirection()

    switch (this.direction) {
      case VECTOR_DIRECTION_ENUM.HORIZONTAL: {
        this.vector.sort((a, b) => a.col - b.col)
        this._direction = VECTOR_DIRECTION_ENUM.HORIZONTAL
        this._start = this[0].col
        this._end = this[this.vector.length - 1].col
        this._index = this[0].row
        return true
      }

      case VECTOR_DIRECTION_ENUM.VERTICAL: {
        this.vector.sort((a, b) => a.col - b.col)
        this._direction = VECTOR_DIRECTION_ENUM.VERTICAL
        this._start = this[0].col
        this._end = this[this.vector.length - 1].col
        this._index = this[0].row
        return true
      }
      default: {
        this._start = undefined
        this._end = undefined
        this._index = undefined
        this._direction = VECTOR_DIRECTION_ENUM.UNDEFINED
        return false
      }
    }
  }

  insert(tile: TileOnBoard) {
    this.vector.push(tile)
    this.sequence()
    //
    if (!this.isValid) {
      //This is not a vector
      const i = this.vector.findIndex(
        (e) => e.col === tile.col && e.row === tile.row
      )
      //REMOVE
      return false
    }
    //
    return true
  }

  removeIndex(i: number) {
    if (i >= 0 && i <= this.vector.length) {
      return this.vector.splice(i, 1)[0]
    }
    return undefined
  }

  remove(tile: TileOnBoard) {
    for (const el in this.vector) {
      if (this.vector[el].isEqual(tile)) {
        return this.vector.splice(+el, 1)[0]
      }
    }
    return undefined
  }

  removeAll() {
    const tiles = [...this.vector]
    this.vector = []
    return tiles
  }

  get(index: number) {
    return this.vector[index]
  }

  map(callback: VectorMapCallbackType<TileOnBoard>) {
    return this.vector.map(callback)
  }

  get first() {
    return this.vector[0]
  }

  get last() {
    return this.vector[this.vector.length - 1]
  }

  get start() {
    return this._start
  }

  get end() {
    return this._end
  }

  get index() {
    return this._index
  }

  get direction() {
    return this._direction
  }

  get length() {
    return this.vector.length
  }

  get isValid() {
    if (
      this.start &&
      this.end &&
      this.index &&
      this.direction != VECTOR_DIRECTION_ENUM.UNDEFINED
    )
      return true
    else return false
  }

  get isEmpty() {
    return this.vector.length === 0
  }

  get isContinuous() {
    switch (this.direction) {
      case VECTOR_DIRECTION_ENUM.HORIZONTAL: {
        return isSequence(this.vector.map((e) => e.col))
      }

      case VECTOR_DIRECTION_ENUM.VERTICAL: {
        return isSequence(this.vector.map((e) => e.row))
      }

      default: {
        return (
          isSequence(this.vector.map((e) => e.col)) ||
          isSequence(this.vector.map((e) => e.row))
        )
      }
    }
  }

  toString() {
    return this.vector.reduce((w, e) => w + e.letter, '')
  }
}
