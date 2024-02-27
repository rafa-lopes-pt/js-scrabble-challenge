import React, { useState } from 'react'
import './styles/sass.css'

import ConfigGame from './pages/ConfigGame'
import Home from './pages/Home'

enum SCREENS {
  HOME,
  CONFIG_GAME,
  GAME
}

function App() {
  const [screen, setScreen] = useState(SCREENS.HOME)

  switch (screen) {
    case SCREENS.HOME: {
      return <Home onPlay={() => setScreen(SCREENS.CONFIG_GAME)} />
    }

    case SCREENS.CONFIG_GAME: {
      return <ConfigGame onGameStart={() => setScreen(SCREENS.CONFIG_GAME)} />
    }

    case SCREENS.GAME: {
      return <>Game</>
    }
  }
}

export default App
