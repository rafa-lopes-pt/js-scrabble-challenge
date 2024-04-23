import { useCallback, useReducer, useState } from 'react'
import Timer from '../Logic/types/player/Timer'
import LangSet from '../Logic/types/lang/LangSet'
import Player from '../Logic/types/player/Player'
import Board from '../Logic/types/board/Board'

enum PLAYER_ACTIONS {
  ADD,
  REMOVE,
  UPDATE
}
type PlayerActionType = {
  type: PLAYER_ACTIONS
  payload: Player
}

function playerReducer(state: Player[], action: PlayerActionType) {
  switch (action.type) {
    case PLAYER_ACTIONS.ADD: {
      if (state.length < 4) {
        return [...state, action.payload]
      } else return state
    }
    case PLAYER_ACTIONS.REMOVE: {
      const pIdx = state.findIndex((p) => p.id === action.payload.id)
      if (pIdx >= 0) {
        const arr = [...state]
        arr.splice(pIdx, 1)

        return arr
      } else return state
    }
    case PLAYER_ACTIONS.UPDATE: {
      const pIdx = state.findIndex((p) => p.id === action.payload.id)
      if (pIdx >= 0) {
        const arr = [...state]
        arr.splice(pIdx, 1, action.payload)

        return arr
      } else return state
    }
  }
}

function useLocalGame(t: Timer, set: LangSet) {
  /*
  REQUIRED DATA
  id: string
  time: Timer | undefined -> game ends after x time, or when first/last player timer ends
  set: TileBag
  wordBlacklist: string[]
  playerList: Player[]
  winner: string

*/
  const [timer, setTimer] = useState(t)

  const [playerList, dispatchPlayerList] = useReducer(
    playerReducer,
    new Array<Player>()
  )
}
