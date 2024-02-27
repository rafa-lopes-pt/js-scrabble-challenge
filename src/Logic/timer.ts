import dayjs, { Dayjs } from 'dayjs'

export class Timer {
  private _time: Dayjs
  private showHours: boolean

  constructor(h, m = 0, s = 0) {
    this.showHours = typeof h === 'number' ? true : false
    this._time = dayjs(new Date())
      .hour(h || 0)
      .minute(m)
      .second(s)
  }

  decrement() {
    this._time = this._time.subtract(1, 'second')
  }

  toString() {
    if (this.showHours) {
      return this._time.format('HH:mm:ss')
    } else return this._time.format('mm:ss')
  }
}
