import { describe, expect, it } from 'vitest'
import Rack from '../../../../src/Logic/types/player/Rack'
import { TEST_TILES } from '../../../TEST_DATA'
import Timer from '../../../../src/Logic/types/player/Timer'
import dayjs from 'dayjs'
describe('class Timer', () => {
  describe('Constructor', () => {
    const timer = new Timer({ m: 0, s: 5 })
    const timer2 = new Timer({ h: 15, m: 12, s: 35 })
    const timer3 = new Timer('15:5')

    it('Should print the time in the HH:mm:ss format', () => {
      expect(timer.toString()).toBe('00:05')
      expect(timer2.toString()).toBe('15:12:35')
      expect(timer3.toString()).toBe('15:05')
    })
    it('Should decrement timer to negative values', () => {
      timer.decrement()
      timer.decrement()
      timer.decrement()
      timer.decrement()
      expect(timer.toString()).toBe('00:01')
      timer.decrement()
      expect(timer.toString()).toBe('00:00')
      timer.decrement()
      expect(timer.toString()).toBe('00:00')
    })
  })
})
