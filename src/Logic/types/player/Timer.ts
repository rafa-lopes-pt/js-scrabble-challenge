import { Dayjs } from 'dayjs'

//FIX:
//Extend dayjs class instead of creating a new one like this

export default class Timer extends Dayjs {
  private _showHours: boolean

  constructor(date: Date, showHours?: boolean) {
    super(date)
    this._showHours = showHours || true
  }

  decrement() {
    this.subtract(1, 'second')
  }

  toString() {
    if (this._showHours) {
      return this.format('HH:mm:ss')
    } else return this.format('mm:ss')
  }
}
