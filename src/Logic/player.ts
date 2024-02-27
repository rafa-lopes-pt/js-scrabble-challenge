import { ReactElement } from 'react'
import { Timer } from './timer'
import { Tile } from './types'

export class Player {
  private _id: string
  name: string
  color: string
  avatar: string
  points: number
  time: Timer | undefined
  rack: Rack

  constructor(id: string) {
    this._id = id
    this.name = 'John Doe'
    this.color = '#f77' //randomize
    this.avatar = '' //create list of avatars
    this.points = 0
    //time and rack are initialized only by the game
    this.rack = new Rack()
  }
}

export class Rack {
  private rack: Array<Tile | null>
  constructor() {
    this.rack = new Array(7).fill(null)
  }

  get length() {
    return this.rack.length
  }

  get isEmpty() {
    return this.rack.every((e) => !e)
  }
  get isIncomplete() {
    return this.rack.some((e) => !e)
  }
  //Adds a tile to the first empty position, never exceeding it's length
  add(t: Tile) {
    if (this.isIncomplete) {
      const emptyIndex = this.rack.indexOf(null)
      this.rack.splice(emptyIndex, 1, t)
      return true
    } else return false
  }
  remove(n: number) {
    return this.rack.splice(n, 1, null)[0]
  }
  clear() {
    this.rack = new Array(7).fill(null)
  }
  map(callback: (e: Rack | null, i?: number) => any) {
    return this.rack.map(callback as any)
  }

  shuffle() {
    for (
      let currentIndex = this.rack.length - 1;
      currentIndex > 0;
      currentIndex--
    ) {
      let randIndex = Math.floor(Math.random() * (currentIndex + 1))
      var temp = this.rack[currentIndex]
      this.rack[currentIndex] = this.rack[randIndex]
      this.rack[randIndex] = temp
    }
  }

  get points() {
    return this.rack.reduce((sum, e) => sum + (e?.points || 0), 0)
  }
}
