import { CHARACTER_TYPE_ENUM } from '../lang/lang-utils'
import TileType from './Tile'

export default interface TileFromSetType extends TileType {
  quantity: number
  type: CHARACTER_TYPE_ENUM
}
