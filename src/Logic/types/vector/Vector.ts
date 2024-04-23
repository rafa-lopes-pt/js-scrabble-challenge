import { VECTOR_DIRECTION_ENUM } from './vector-utils'

/**
 * Represents a list of points that MUST form a 2D vector.
 * A vector with less that 2 elements is considered invalid,
 * and all position properties (direction,index,start,end)
 * will be undefined.
 * Once the 2nd element is inserted, position properties will be
 * automatically defined, and items will be sorted as well.
 * After the 2nd element, new points can only be added if they can
 * be "reached" by the vector.
 * i.e. Vector[ (1,1), (1,2)] can accept (1,3) as a new element,
 * but (3,1) is invalid and won't be inserted.
 *
 * Concrete implementations must define ways of working with the
 * coordinate system
 */
export default abstract class Vector<T> {
  protected _vector: T[]
  protected _start: number | undefined
  protected _end: number | undefined
  protected _index: number | undefined
  protected _direction: VECTOR_DIRECTION_ENUM

  constructor(...items: T[]) {
    this._vector = []
    for (let i in items) {
      this.insert(items[i])
    }
    //needs to be called cz items might be null, and if insert is
    //never called, position props wont be defined
    this.sequence()
  }
  /**
   * Sorts the vector and defines position properties
   * Should be called after every mutation
   */
  protected abstract sequence(): void

  /**
   * Checks weather an element is valid in the vector context.
   * This method is called before inserting an element.
   */
  protected abstract validateElement(element: T): boolean
  /**
   * @returns true or false indicating if the element was inserted
   */
  insert(element: T) {
    //No duplicates nor invalid points
    if (!this.validateElement(element) || this.includes(element)) return false
    //
    this._vector.push(element)
    this.length > 1 && this.sequence()

    return true
  }
  /**
   * @returns the removed element, or undefined if it doesn't exists
   */
  removeIndex(i: number) {
    const nTile = this._vector.splice(i, 1)[0]
    this.sequence()
    return nTile
  }
  /**
   * @returns the removed element, or undefined if it doesn't exists
   */
  abstract remove(element: T): T | undefined
  /**
   * @returns removed element, or undefined if it doesn't exists
   */
  removeAll() {
    const copy = [...this._vector]
    this._vector = []
    this.sequence() //resets position props
    return copy
  }
  /**
   *
   * @returns a ref to the object
   */
  get(index: number) {
    return this._vector[index]
  }

  /**
   * Maps over the ACTUAL elements
   * @returns
   */
  map<U>(callback: (e: T, i?: number) => U): U[] {
    return this._vector.map<U>(callback)
  }
  /** 
  @return A shallow copy of the underlying array
  */
  toArray() {
    return [...this._vector]
  }
  abstract includes(search: T): boolean
  /**
   * Given a valid source, checks items on same index, before, between and after.
   * @param grid double-dim array
   * @param args accepts other arguments for concrete implementation
   * @returns a sorted array containing all the elements in the vector plus the ones that pass the condition
   * @returns undefined if vector is not valid
   */
  abstract apply(grid: T[][], ...args: any): T[] | undefined

  //======= GETTERS
  get length() {
    return this._vector.length
  }
  get first() {
    return this._vector[0]
  }
  get last() {
    return this._vector[this._vector.length - 1]
  }

  /**
   * A vector is only valid if it has 2 or more points, thus it needs to have a start, end, index and direction defined
   * @returns @true if all position properties are defined, @false otherwise
   */
  get isValid() {
    if (
      typeof this.start === 'number' &&
      typeof this.end === 'number' &&
      typeof this.index === 'number' &&
      this.direction != VECTOR_DIRECTION_ENUM.UNDEFINED
    )
      return true
    else return false
  }
  get isEmpty() {
    return this._vector.length === 0
  }
  /**
   * Flags if all elements are in sequence and with no gaps
   */
  abstract get isContinuous(): boolean

  //Position properties
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
}
