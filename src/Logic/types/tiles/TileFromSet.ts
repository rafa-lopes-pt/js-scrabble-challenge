import { CHARACTER_TYPE_ENUM } from '../lang/lang-utils'
import TileType from './Tile'

/**
 * Represents a tile, the number of equal tiles on a set, and the type of tile
 */
export default interface TileFromSetType extends TileType {
  quantity: number
  type: CHARACTER_TYPE_ENUM
}
