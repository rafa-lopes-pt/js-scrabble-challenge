import Vector from './Vector'
import TileOnBoard from '../tiles/TileOnBoard'
import { VECTOR_DIRECTION_ENUM, VectorMapCallbackType } from './vector-utils'
import { isSequence } from '../../utils'

export default class TileOnBoardVector implements Vector<TileOnBoard> {
  private _vector: TileOnBoard[]
  private _start: number | undefined
  private _end: number | undefined
  private _index: number | undefined
  private _direction: VECTOR_DIRECTION_ENUM

  constructor(...items: TileOnBoard[]) {
    this._vector = items
    this.sequence()
  }

  private findDirection() {
    if (this._vector.length <= 1) {
      return VECTOR_DIRECTION_ENUM.UNDEFINED
    }

    if (this._vector.every((e) => e.col === this._vector[0].col))
      return VECTOR_DIRECTION_ENUM.VERTICAL
    //
    else if (this._vector.every((e) => e.row === this._vector[0].row))
      return VECTOR_DIRECTION_ENUM.HORIZONTAL
    //
    else return VECTOR_DIRECTION_ENUM.UNDEFINED
    //
  }

  private sequence() {
    this._direction = this.findDirection()

    switch (this.direction) {
      case VECTOR_DIRECTION_ENUM.HORIZONTAL: {
        this._vector.sort((a, b) => a.col - b.col)
        this._direction = VECTOR_DIRECTION_ENUM.HORIZONTAL
        this._start = this._vector[0].col
        this._end = this._vector[this._vector.length - 1].col
        this._index = this._vector[0].row
        return true
      }

      case VECTOR_DIRECTION_ENUM.VERTICAL: {
        this._vector.sort((a, b) => a.col - b.col)
        this._direction = VECTOR_DIRECTION_ENUM.VERTICAL
        this._start = this._vector[0].col
        this._end = this._vector[this._vector.length - 1].col
        this._index = this._vector[0].row
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
    this._vector.push(tile)
    this.sequence()
    //
    if (this.length > 1 && !this.isValid) {
      //This is not a vector
      /*
      TILE 0 --- TILE 1
        |
        |
      TILE C (new tile)

*/
      this.remove(tile)
      return false
    }
    //
    return true
  }

  removeIndex(i: number) {
    return this._vector.splice(i, 1)[0]
  }

  remove(tile: TileOnBoard) {
    for (const el in this._vector) {
      if (this._vector[el].isEqual(tile)) {
        return this._vector.splice(+el, 1)[0]
      }
    }
    return undefined
  }

  removeAll() {
    const tiles = [...this._vector]
    this._vector = []
    return tiles
  }

  get(index: number) {
    return { ...this._vector[index] } as TileOnBoard
  }

  map(callback: VectorMapCallbackType<TileOnBoard>) {
    return this._vector.map(callback)
  }

  get first() {
    return this._vector[0]
  }

  get last() {
    return this._vector[this._vector.length - 1]
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
    return this._vector.length
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
    return this._vector.length === 0
  }

  get isContinuous() {
    switch (this.direction) {
      case VECTOR_DIRECTION_ENUM.HORIZONTAL: {
        return isSequence(this._vector.map((e) => e.col))
      }

      case VECTOR_DIRECTION_ENUM.VERTICAL: {
        return isSequence(this._vector.map((e) => e.row))
      }

      default:
        return false
    }
  }

  toString() {
    return this._vector.reduce((w, e) => w + e.letter, '')
  }

  toArray() {
    return this._vector.map((e) => ({ ...e }) as TileOnBoard)
  }
}
