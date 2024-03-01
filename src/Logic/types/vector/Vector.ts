import VectorPositionType from './VectorPosition'
import { VectorMapCallbackType } from './vector-utils'

export default interface Vector<T> extends VectorPositionType {
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
