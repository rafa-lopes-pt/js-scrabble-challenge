import { useState } from 'react'
import { Timer } from '../Logic/timer'

function useCountdown(t: Timer) {
  const [countDown, setCountDown] = useState(t)

  let intervalID: number | undefined

  function pause() {
    clearInterval(intervalID)
  }

  function start() {
    intervalID = setInterval(() => {
      t.decrement()
    }, 1000)
  }

  return { start, pause }
}
