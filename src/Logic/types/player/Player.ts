import { ReactElement } from 'react'
import Timer from './Timer'
import { random } from '../../utils'
import Rack from './Rack'
import { AVATARS, COLORS } from './player-utils'

/**
 * Represents a player entity.
 * Each player has an unique id, rack and timer.
 */
export default class Player {
  private _id: string
  private _name: string
  private _color: COLORS
  private _avatar: AVATARS
  private _points: number
  private _timer: Timer | undefined
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
    this._name = name || 'Mike Hawk'
    this._color = color || this.randomizeColor()
    this._avatar = avatar || this.randomizeAvatar()
    this._points = points || 0
    //time and rack are initialized only by the game
    this._rack = rack || new Rack()
    this._timer = timer || undefined
  }

  randomizeColor(prev?: COLORS) {
    this._color = random(COLORS, (rnd) => (prev ? prev : this._color) !== rnd)
    return this._color
  }
  randomizeAvatar(prev?: AVATARS) {
    this._avatar = random(
      AVATARS,
      (rnd) => (prev ? prev : this._avatar) !== rnd
    )
    return this._avatar
  }

  subtractRackPoints() {
    this.points -= this._rack.points
    if (this.points < 0) this.points = 0

    this._rack.clear()
  }

  //GETTERS
  get id() {
    return this._id
  }
  get name() {
    return this._name
  }
  get color() {
    return this._color
  }
  get avatar() {
    return this._avatar
  }
  get points() {
    return this._points
  }
  get timer() {
    return this._timer
  }
  get rack() {
    return this._rack
  }
  //SETTERS
  set name(name: string) {
    this._name = name
  }
  set points(points: number) {
    this._points = points
  }
}
