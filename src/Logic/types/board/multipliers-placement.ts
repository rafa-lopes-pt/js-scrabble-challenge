import Cell from './Cell'
import { CELL_MULTIPLIERS_ENUM } from './board-utils'

//this is just for convenience
export default function insertAllMultipliers(board: Cell[][]) {
  insertMultiplier(board, CELL_MULTIPLIERS_ENUM.TW)
  insertMultiplier(board, CELL_MULTIPLIERS_ENUM.DW)
  insertMultiplier(board, CELL_MULTIPLIERS_ENUM.TL)
  insertMultiplier(board, CELL_MULTIPLIERS_ENUM.DL)
}

//this allows me to select specific multipliers only
//might come in handy for custom games
export function insertMultiplier(
  board: Cell[][],
  multiplier: CELL_MULTIPLIERS_ENUM
) {
  switch (multiplier) {
    case CELL_MULTIPLIERS_ENUM.TW:
      parseTW(board)
      break

    case CELL_MULTIPLIERS_ENUM.DW:
      parseDW(board)
      break

    case CELL_MULTIPLIERS_ENUM.TL:
      parseTL(board)
      break

    case CELL_MULTIPLIERS_ENUM.DL:
      parseDL(board)
      break
  }
}

// === Messy multiplier definition
//TODO: improve that...maybe add new ones!
// these functions/coordinates should work with a grid of any size! now necessarily squared

// =======================================
//TW -> Corners and middle lines (H and 8)
//corners
/*
      TL [0,0]                              TM[][]                                TR [board.length - 1][0]
    





    
       TL [0][board[0].length - 1]                                     TR [board.length - 1][board[0].length - 1]
    */
const TW_coordinates = (board: Cell[][]) => [
  //topLeft:
  { col: 0, row: 0 },
  //topMiddle:
  { col: Math.ceil((board.length - 1) / 2), row: 0 },
  //topRight:
  { col: board.length - 1, row: 0 },
  //MiddleLeft:
  { col: 0, row: Math.ceil((board[0].length - 1) / 2) },
  //MiddleRight:
  {
    col: Math.ceil((board.length - 1) / 2),
    row: Math.ceil((board[0].length - 1) / 2)
  },
  //bottomLeft:
  { col: 0, row: board[0].length - 1 },
  //bottomMiddle:
  {
    col: Math.ceil((board.length - 1) / 2),
    row: board[0].length - 1
  },
  //bottomRight:
  { col: board.length - 1, row: board[0].length - 1 }
]
const parseTW = (board: Cell[][]) => {
  const data = TW_coordinates(board)
  for (let multiplier of data) {
    board[multiplier.col][multiplier.row] = new Cell(CELL_MULTIPLIERS_ENUM.TW)
  }
}

//diagonals from TW 4 times
const DW_coordinates = (board: Cell[][]) => ({
  topLeftCorner: [
    { col: 1, row: 1 },
    { col: 2, row: 2 },
    { col: 3, row: 3 },
    { col: 4, row: 4 }
  ],
  topRightCorner: [
    { col: board.length - 2, row: 1 },
    { col: board.length - 3, row: 2 },
    { col: board.length - 4, row: 3 },
    { col: board.length - 5, row: 4 }
  ],
  bottomLeftCorner: [
    { col: 0, row: board[0].length - 2 },
    { col: 0, row: board[0].length - 3 },
    { col: 0, row: board[0].length - 4 },
    { col: 0, row: board[0].length - 5 }
  ],
  bottomRightCorner: [
    { col: board.length - 2, row: board[0].length - 2 },
    { col: board.length - 3, row: board[0].length - 3 },
    { col: board.length - 4, row: board[0].length - 4 },
    { col: board.length - 5, row: board[0].length - 5 }
  ]
})
const parseDW = (board: Cell[][]) => {
  const data = DW_coordinates(board)
  for (let corner in data) {
    for (let multiplier of data[corner]) {
      board[multiplier.col][multiplier.row] = new Cell(CELL_MULTIPLIERS_ENUM.DW)
    }
  }
}
/*
            [c1,c2]
         [c1,c2,c3,c4]
         [c1,c2,c3,c4]
            [c1,c2]
    */
const TL_coordinates = (board: Cell[][]) => [
  [
    { col: Math.ceil(board.length / 2) - 2, row: 1 },
    { col: Math.ceil(board.length / 2) + 2, row: 1 }
  ],
  //
  [
    { col: 1, row: Math.ceil(board[0].length / 2) - 2 },
    {
      col: Math.ceil(board.length / 2) - 2,
      row: Math.ceil(board[0].length / 2) - 2
    },
    {
      col: Math.ceil(board.length / 2) + 2,
      row: Math.ceil(board[0].length / 2) - 2
    },
    {
      col: board.length - 2,
      row: Math.ceil(board[0].length / 2) - 2
    }
  ],
  //
  [
    { col: 1, row: Math.ceil(board[0].length / 2) + 2 },
    {
      col: Math.ceil(board.length / 2) - 2,
      row: Math.ceil(board[0].length / 2) + 2
    },
    {
      col: Math.ceil(board.length / 2) + 2,
      row: Math.ceil(board[0].length / 2) + 2
    },
    {
      col: board.length - 2,
      row: Math.ceil(board[0].length / 2) + 2
    }
  ],
  //
  [
    {
      col: Math.ceil(board.length / 2) - 2,
      row: board[0].length - 2
    },
    {
      col: Math.ceil(board.length / 2) + 2,
      row: board[0].length - 2
    }
  ]
]

const parseTL = (board: Cell[][]) => {
  const data = TL_coordinates(board)

  for (let row of data) {
    for (let multiplier of row) {
      board[multiplier.col][multiplier.row] = new Cell(CELL_MULTIPLIERS_ENUM.TL)
    }
  }
}

/*
        TOP
                      [c1,..............,c2]

                            [c1,....,c2]
                [c1,............,c2,............,c3]
          
        MID

            [c1,...........,c2,.....,c3,...........,c4]
            [....c1,...........................,c2....]
            [c1,...........,c2,.....,c3,...........,c4]
        
        BOT = TOP mirrored
                 
                 
    */
const DL_coordinates = (board: Cell[][]) => ({
  top: [
    [
      { col: Math.floor(board.length * (1 / 4)), row: 0 },
      { col: Math.floor(board.length * (3 / 4)), row: 0 }
    ],
    [
      { col: Math.ceil(board.length / 2) - 1, row: 2 },
      { col: Math.ceil(board.length / 2) + 1, row: 2 }
    ],
    [
      { col: 0, row: 3 },
      { col: Math.ceil(board.length / 2), row: 3 },
      { col: 0, row: 3 }
    ]
  ],
  middle: [
    [
      {
        col: Math.floor(board.length * (1 / 4)) - 1,
        row: Math.ceil(board.length / 2) - 1
      },
      {
        col: Math.ceil(board.length / 2) - 1,
        row: Math.ceil(board.length / 2) - 1
      },
      {
        col: Math.ceil(board.length / 2) + 1,
        row: Math.ceil(board.length / 2) - 1
      },
      {
        col: Math.floor(board.length * (3 / 4)) - 1,
        row: Math.ceil(board.length / 2) - 1
      }
    ],
    [
      {
        col: Math.floor(board.length * (1 / 4)),
        row: Math.ceil(board.length / 2)
      },
      {
        col: Math.floor(board.length * (3 / 4)),
        row: Math.ceil(board.length / 2)
      }
    ],
    [
      {
        col: Math.floor(board.length / 4) - 1,
        row: Math.ceil(board.length / 2) + 1
      },
      {
        col: Math.ceil(board.length / 2) - 1,
        row: Math.ceil(board.length / 2) + 1
      },
      {
        col: Math.ceil(board.length / 2) + 1,
        row: Math.ceil(board.length / 2) + 1
      },
      {
        col: Math.floor(board.length * (3 / 4)) - 1,
        row: Math.ceil(board.length / 2) + 1
      }
    ]
  ],
  bottom: [
    [
      { col: 0, row: board.length - 4 },
      { col: Math.ceil(board.length / 2), row: board.length - 4 },
      { col: 0, row: board.length - 4 }
    ],
    [
      {
        col: Math.ceil(board.length / 2) - 1,
        row: board.length - 3
      },
      {
        col: Math.ceil(board.length / 2) + 1,
        row: board.length - 3
      }
    ],
    [
      {
        col: Math.floor(board.length * (1 / 4)),
        row: board.length - 1
      },
      {
        col: Math.floor(board.length * (3 / 4)),
        row: board.length - 1
      }
    ]
  ]
})
const parseDL = (board: Cell[][]) => {
  const data = DL_coordinates(board)
  for (let zone in data) {
    for (let row of data[zone]) {
      for (let multiplier of row) {
        board[multiplier.col][multiplier.row] = new Cell(
          CELL_MULTIPLIERS_ENUM.DL
        )
      }
    }
  }
}
