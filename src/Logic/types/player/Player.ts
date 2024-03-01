import { ReactElement } from 'react'
import { Timer } from './Timer'
import { random } from '../../utils'
import Rack from './Rack'
import { AVATARS, COLORS } from './player-utils'

export class Player {
  private _id: string
  name: string
  private _color: COLORS
  private _avatar: AVATARS
  points: number
  time: Timer | undefined
  rack: Rack

  constructor(id: string) {
    this._id = id
    this.name = 'John Doe'
    this.randomizeColor()
    this.randomizeAvatar()
    this.points = 0
    //time and rack are initialized only by the game
    this.rack = new Rack()
  }

  randomizeColor() {
    this._color = random(COLORS, this._color)
  }
  randomizeAvatar() {
    this._avatar = random(AVATARS, this._avatar)
  }

  subtractRackPoints() {
    this.points -= this.rack.points
    if (this.points < 0) this.points = 0

    this.rack.clear()
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
}
