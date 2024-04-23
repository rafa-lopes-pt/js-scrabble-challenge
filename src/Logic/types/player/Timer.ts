import dayjs, { Dayjs } from 'dayjs'

export default class Timer {
  //NOTE: Dayjs doesn't support subclass
  //Not sure why or how...but...
  //think its because dayjs objects are immutable
  // https://stackoverflow.com/a/70497055/22510505
  private _time: Dayjs
  private _showHours: boolean

  constructor(time: { h?: number; m: number; s: number } | string) {
    if (typeof time === 'string') {
      try {
        const [h, m, s] = time.split(':')
        if (s) {
          this._time = dayjs().hour(+h).minute(+m).second(+s)
          this._showHours = true
        } else {
          this._time = dayjs().minute(+h).second(+m)
          this._showHours = false
        }
      } catch (e) {
        throw new Error(
          `Couldn't form timer due to invalid input. Received: ${time}`
        )
      }
    } else {
      this._time = time.h ? dayjs().hour(time.h) : dayjs()
      this._time = this._time.minute(time.m).second(time.s)
      this._showHours = time.h ? true : false
    }
  }

  decrement() {
    this._time =
      this._time.second() > 0 ? this._time.subtract(1, 'second') : this._time
  }

  get isFinished() {
    return this._showHours
      ? this.toString() === '00:00:00'
      : this.toString() === '00:00'
  }

  toString() {
    return this._showHours
      ? this._time.format('HH:mm:ss')
      : this._time.format('mm:ss')
  }
}
