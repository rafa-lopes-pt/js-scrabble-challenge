import { Timer } from './timer'
import { Player } from './player'
import { LangSet } from './types'

/* NOTE: If you're reading this...yes i used chatgpt :P 
with the right prompting he's great to write objs and stuff like this */
export const ENGLISH_SET: LangSet = {
  id: 'EN',
  label: 'English',
  tileSet: [
    { letter: '*', points: 0, qt: 2 },
    //
    { letter: 'E', points: 1, qt: 12 },
    { letter: 'A', points: 1, qt: 9 },
    { letter: 'I', points: 1, qt: 9 },
    { letter: 'O', points: 1, qt: 8 },
    { letter: 'N', points: 1, qt: 6 },
    { letter: 'R', points: 1, qt: 6 },
    { letter: 'T', points: 1, qt: 6 },
    { letter: 'L', points: 1, qt: 4 },
    { letter: 'S', points: 1, qt: 4 },
    { letter: 'U', points: 1, qt: 4 },
    //
    { letter: 'B', points: 3, qt: 2 },
    { letter: 'C', points: 3, qt: 2 },
    { letter: 'M', points: 3, qt: 2 },
    { letter: 'P', points: 3, qt: 2 },
    //
    { letter: 'F', points: 4, qt: 2 },
    { letter: 'H', points: 4, qt: 2 },
    { letter: 'V', points: 4, qt: 2 },
    { letter: 'W', points: 4, qt: 2 },
    { letter: 'Y', points: 4, qt: 2 },
    //
    { letter: 'K', points: 5, qt: 1 },
    //
    { letter: 'J', points: 8, qt: 1 },
    { letter: 'X', points: 8, qt: 1 },
    //
    { letter: 'Q', points: 10, qt: 1 },
    { letter: 'Z', points: 10, qt: 1 }
  ]
}

class Game {
  id: string
  time: Timer
  set: LangSet
  wordBlacklist: string[]
  playerList: Player[]
  winner: string

  constructor(time: Timer, set: LangSet, playerList: Player[]) {
    // this.id = uuid() implement later if ever used with server
    this.time = time
    this.set = set
    this.playerList = playerList
  }

  initializePlayerRacks() {
    for (let p in this.playerList) {
    }
  }
}
