import { VECTOR_DIRECTION_ENUM } from './vector-utils'

export default interface VectorPositionType {
  start: number | undefined
  end: number | undefined
  index: number | undefined
  direction: VECTOR_DIRECTION_ENUM
}
