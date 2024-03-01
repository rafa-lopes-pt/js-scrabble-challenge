import { ReactElement } from 'react'
import { Timer } from './timer'
import { TileType } from './types'
import { randomizer } from './utils'
export enum COLORS {
  RED = '#f66',
  BLUE = '#36A',
  GREEN = '#3C5',
  YELLOW = '#FF6',
  PURPLE = '#90F',
  PINK = '#F8F'
}

FIX: 'define some kind of value or ref'
export enum AVATARS {
  a1,
  a2,
  a3,
  a4,
  a5,
  a6
}

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
    this._color = randomizer(COLORS, this._color)
  }
  randomizeAvatar() {
    this._avatar = randomizer(AVATARS, this._avatar)
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

export class Rack {
  private _rack: Array<TileType | null>
  constructor() {
    this._rack = new Array(7).fill(null)
  }

  get length() {
    return this._rack.length
  }

  get isEmpty() {
    return this._rack.every((e) => !e)
  }
  get isIncomplete() {
    return this._rack.some((e) => !e)
  }
  //Adds a tile to the first empty position, never exceeding it's length
  add(t: TileType) {
    if (this.isIncomplete) {
      const emptyIndex = this._rack.indexOf(null)
      this._rack.splice(emptyIndex, 1, t)
      return true
    } else return false
  }
  //Returns false if element is not found
  remove(n: number) {
    const e = this._rack.splice(n, 1, null)[0]
    if (e === undefined) return false
    return true
  }
  clear() {
    this._rack = new Array(7).fill(null)
  }
  map(callback: (e: Rack | null, i?: number) => any) {
    return this._rack.map(callback as any)
  }

  shuffle() {
    for (
      let currentIndex = this._rack.length - 1;
      currentIndex > 0;
      currentIndex--
    ) {
      let randIndex = Math.floor(Math.random() * (currentIndex + 1))
      var temp = this._rack[currentIndex]
      this._rack[currentIndex] = this._rack[randIndex]
      this._rack[randIndex] = temp
    }
  }

  swap(nTile: TileType, swapIndex: number) {
    this.remove(swapIndex) && this.add(nTile)
  }

  get points() {
    return this._rack.reduce((sum, e) => sum + (e?.points || 0), 0)
  }
}
