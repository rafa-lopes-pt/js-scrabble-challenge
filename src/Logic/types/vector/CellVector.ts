import { isSequence } from '../../utils'
import Cell from '../board/Cell'
import Vector from './Vector'
import { VECTOR_DIRECTION_ENUM } from './vector-utils'

/**
 * Concrete implementation of Vector class.
 */
export default class CellVector extends Vector<Cell> {
  private findDirection(arr = this._vector) {
    if (arr.length <= 1) {
      return VECTOR_DIRECTION_ENUM.UNDEFINED
    }

    if (arr.every((e) => e.col === arr[0].col))
      return VECTOR_DIRECTION_ENUM.VERTICAL
    //
    else if (arr.every((e) => e.row === arr[0].row))
      return VECTOR_DIRECTION_ENUM.HORIZONTAL
    //
    else return VECTOR_DIRECTION_ENUM.UNDEFINED
    //
  }

  protected sequence() {
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
        this._vector.sort((a, b) => a.row - b.row)
        this._direction = VECTOR_DIRECTION_ENUM.VERTICAL
        this._start = this._vector[0].row
        this._end = this._vector[this._vector.length - 1].row
        this._index = this._vector[0].col
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

  get isContinuous() {
    switch (this.direction) {
      case VECTOR_DIRECTION_ENUM.HORIZONTAL: {
        return isSequence(this._vector.map((e) => e.col))
      }

      case VECTOR_DIRECTION_ENUM.VERTICAL: {
        return isSequence(this._vector.map((e) => e.col))
      }

      default:
        return false
    }
  }

  protected validateElement(element: Cell): boolean {
    const isDefined = element && element.tile,
      isNotDuplicate = !this.includes(element),
      isValid = this.isEmpty
        ? true
        : this.findDirection([...this._vector, element]) !==
          VECTOR_DIRECTION_ENUM.UNDEFINED

    return isDefined && isNotDuplicate && isValid ? true : false
  }

  remove(element: Cell): Cell | undefined {
    if (!this.includes(element)) return undefined

    for (let i in this._vector) {
      if (this._vector[i].isEqual(element)) {
        const oldEl = this._vector.splice(+i, 1)[0]
        this.sequence()
        return oldEl
      }
    }
    return undefined // Should never get here
  }

  includes(search: Cell): boolean {
    return this._vector.find((e) => e.isEqual(search)) ? true : false
  }

  // ========================= EXTEND IMPLEMENTATION START
  private searchBefore(data: Cell[]) {
    let arr: Cell[] = []
    // @ts-ignore
    let i = this.start - 1
    while (i >= 0) {
      const cell = data[i]
      if (cell && cell.isEmpty) break

      arr.push(cell)
      i--
    }

    return arr
  }
  private searchBetween(data: Cell[]) {
    if (this.isContinuous) return this.toArray()

    let arr: Cell[] = []
    let i = this.start as number
    while (i <= (this.end as number)) {
      const cell = data[i]
      if (cell && cell.isEmpty)
        throw new Error('Vector has a gap between bounds.')

      arr.push(cell)
      i++
    }

    return arr
  }
  private searchAfter(data: Cell[]) {
    let arr: Cell[] = []
    // @ts-ignore
    let i = this.end + 1
    while (i < data.length) {
      const cell = data[i]
      if (cell && cell.isEmpty) break

      arr.push(cell)
      i++
    }

    return arr
  }
  inferVectorFromAdjacentPoint(
    grid: Cell[][],
    prioritizeDirection: VECTOR_DIRECTION_ENUM = VECTOR_DIRECTION_ENUM.HORIZONTAL
  ) {
    if (this.isEmpty) return undefined
    const col = this.first.col,
      row = this.first.row

    //find grid bounds
    const colBound = grid[col].length - 1,
      rowBound = grid.length - 1

    //NOTE: could this be optimized? xD smells like a shitty hardcoded solution
    //Find one of the 4 possible points
    const findHorizontal = () => {
      const v1 = col - 1 >= 0 && grid[col - 1][row]
      if (v1 && v1.tile) {
        this.insert(v1)
        return
      }
      const v2 = col + 1 <= colBound && grid[col + 1][row]
      if (v2 && v2.tile) {
        this.insert(v2)
        return
      }
    }
    const findVertical = () => {
      const v3 = row - 1 >= 0 && grid[col][row - 1]
      if (v3 && v3.tile) {
        this.insert(v3)
        return
      }
      const v4 = row + 1 <= rowBound && grid[col][row + 1]
      if (v4 && v4.tile) {
        this.insert(v4)
        return
      }
    }

    if (prioritizeDirection === VECTOR_DIRECTION_ENUM.HORIZONTAL) {
      findHorizontal()
      findVertical()
    } else {
      findVertical()
      findHorizontal()
    }
  }
  /**
   * Given a valid 2D array as source, returns the continuous
   * subsection of the line where the vector is defined
   * @returns 1D Array or undefined if the vector is not valid
   */
  apply(grid: Cell[][]) {
    if (this.isValid) {
      //data will always be defined cz vector is valid
      // @ts-ignore

      const data = this.getVectorLineFromSource(grid) as Cell[]

      return [
        ...this.searchBefore(data),
        ...this.searchBetween(data),
        ...this.searchAfter(data)
      ]
    } else {
      return undefined
    }
  }
  private getVectorLineFromSource(grid: Cell[][]) {
    switch (this.direction) {
      case VECTOR_DIRECTION_ENUM.HORIZONTAL: {
        return grid.map((e) => e[this.index as number])
      }
      case VECTOR_DIRECTION_ENUM.VERTICAL: {
        return grid[this.index as number]
      }
      default:
        return []
    }
  }

  getCrossVectorFromSource(grid: Cell[][], perpendicularIndex: number) {
    if (!this.isValid) throw new Error('Vector is not defined')
    // @ts-ignore
    if (perpendicularIndex < this?.start || perpendicularIndex > this?.end)
      return undefined

    switch (this.direction) {
      case VECTOR_DIRECTION_ENUM.HORIZONTAL: {
        const data = grid[perpendicularIndex] //perpendicular line

        return new CellVector(
          ...data.slice(
            // @ts-ignore
            Math.max(this.index - 1, 0),

            // @ts-ignore
            Math.min(data.length - 1, this.index + 1) + 1
          )
        )
      }
      case VECTOR_DIRECTION_ENUM.VERTICAL: {
        const data = grid.map((e) => e[perpendicularIndex]) //perpendicular line

        return new CellVector(
          ...data.slice(
            // @ts-ignore
            Math.max(this.index - 1, 0),
            // @ts-ignore
            Math.min(data.length - 1, this.index + 1) + 1
          )
        )
      }
      default:
        return undefined
    }
  }
  // ========================= EXTEND IMPLEMENTATION END

  toString() {
    return this._vector.reduce((w, e) => w + e.tile?.letter, '')
  }
}
