import { describe, it, expect } from 'vitest'
import { Timer } from '../../src/Logic/timer'

describe('class Timer', () => {
  it('Should return a string in the format hh:mm:ss', () => {
    expect(new Timer(12, 34, 56).toString()).toBe('12:34:56')
    expect(new Timer(0, 34, 56).toString()).toBe('00:34:56')
    expect(new Timer(0, 0, 0).toString()).toBe('00:00:00')
    expect(new Timer(null, 34, 56).toString()).toBe('34:56')
  })

  it('Should decrement the given time by 1 second on each call', () => {
    const t = new Timer(12, 34, 56)
    t.decrement()
    expect(t.toString()).toBe('12:34:55')
    t.decrement()
    t.decrement()
    t.decrement()
    expect(t.toString()).toBe('12:34:52')
  })
})
