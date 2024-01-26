import './index.scss'

import { createContext, Dispatch, SetStateAction, useState } from 'react'
import { createPortal } from 'react-dom'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

import { byId } from './app/dom/dom-helper'
import { EndScreen } from './pages/EndScreen'
import { Level } from './pages/Level'
import { LevelOverview } from './pages/LevelOverview'
import { StartScreen } from './pages/StartScreen'
import { AppState, loadAppState, storeAppState } from './state/state'

export const app_state = loadAppState()

export const AppContext = createContext(app_state)

let setState_: Dispatch<SetStateAction<AppState>>

function App() {
  const [state, setState] = useState(app_state)
  setState_ = setState

  return (
    <AppContext.Provider value={state}>
      <BrowserRouter>
        <Routes>
          <Route path="lvl/:levelNum" element={<Level />} />
          <Route path="levels" element={<LevelOverview />} />
          <Route path="end" element={<EndScreen />} />
          <Route path="*" element={<StartScreen />} />
        </Routes>
      </BrowserRouter>
    </AppContext.Provider>
  )
}

createPortal(<App />, byId('root', HTMLDivElement))

export function setState(action: SetStateAction<Readonly<AppState>>) {
  if (typeof action === 'function') {
    setState_((prev) => {
      const state = action(prev)
      storeAppState(state)
      return state
    })
  } else {
    storeAppState(action)
    setState_(action)
  }
}
