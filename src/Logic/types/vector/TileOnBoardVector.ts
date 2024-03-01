import Vector from './Vector'
import TileOnBoard from '../tiles/TileOnBoard'
import { VECTOR_DIRECTION_ENUM, VectorMapCallbackType } from './vector-utils'
import { isSequence } from '../../utils'

export default class TileOnBoardVector implements Vector<TileOnBoard> {
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
