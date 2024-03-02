import { ReactElement } from 'react'
import Timer from './Timer'
import { random } from '../../utils'
import Rack from './Rack'
import { AVATARS, COLORS } from './player-utils'

export default class Player {
  private _id: string
  name: string
  private _color: COLORS
  private _avatar: AVATARS
  points: number
  timer: Timer | undefined
  private _rack: Rack

  constructor(
    id: string,
    name?: string,
    color?: COLORS,
    avatar?: AVATARS,
    points?: number,
    timer?: Timer,
    rack?: Rack
  ) {
    this._id = id
    this.name = name || 'John Doe'
    this._color = color || this.randomizeColor()
    this._avatar = avatar || this.randomizeAvatar()
    this.points = points || 0
    //time and rack are initialized only by the game
    this._rack = rack || new Rack()
    this.timer = timer || undefined
  }

  randomizeColor() {
    this._color = random(COLORS, this._color)
    return this._color
  }
  randomizeAvatar() {
    this._avatar = random(AVATARS, this._avatar)
    return this._avatar
  }

  subtractRackPoints() {
    this.points -= this._rack.points
    if (this.points < 0) this.points = 0

    this._rack.clear()
  }

  get color() {
    return this._color
  }
  get avatar() {
    return this._avatar
  }
  get id() {
    return this._id
  }
  get rack() {
    return this._rack
  }
}
