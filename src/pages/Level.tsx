import { useContext, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { AppContext, setState } from '..'
import { levels } from '../app/game/levels'
import { Victory } from '../components/Victory'
import { FloodGame } from '../games/FloodGame'
import { Highscore } from '../state/state'

export function Level() {
  const { levelNum } = useParams()
  const navigate = useNavigate()
  const ctx = useContext(AppContext)

  const [won, setWon] = useState(false)
  const [moves, setMoves] = useState(0)
  const [previousHigh, setPreviousHigh] = useState<Highscore>(undefined)

  if (levelNum == null || isNaN(+levelNum)) {
    return <>Error: Level {levelNum} is not a number</>
  }

  const levelIdx = +levelNum - 1
  const level = levels[levelIdx]
  if (level == null) {
    return <>Error: Level {levelNum} does not exist</>
  }

  function setTutorialShown() {
    setState((prev) => ({
      ...prev,
      tutorials_shown: { ...prev.tutorials_shown, [level.type]: true },
    }))
  }

  const onVictory = (moves: number) => {
    setWon(true)
    setMoves(moves)
    setPreviousHigh(ctx.highscores[levelIdx])
  }

  const proceed = (action: 'repeat' | 'next' | 'overview') => {
    switch (action) {
      case 'repeat':
        setWon(false)
        break
      case 'next':
        if (ctx.completed_levels >= levels.length) {
          if (ctx.end_shown) {
            navigate('/levels')
          } else {
            navigate('/end')
          }
        } else {
          setState((prev) => ({
            ...prev,
            end_shown: true,
          }))
          navigate(`/lvl/${levelNum}`)
        }
        break
      case 'overview':
        navigate('/levels')
    }
  }

  if (won) {
    return <Victory lvl={levelIdx} moves={moves} previous_high={previousHigh} proceed={proceed} />
  } else if (level.Tutorial && !ctx.tutorials_shown[level.type]) {
    return <level.Tutorial proceed={setTutorialShown} />
  }

  switch (level.type) {
    case 'hue':
      return <HueGame config={level} levelIdx={levelIdx} on_victory={onVictory} />
    case 'flood':
      return <FloodGame config={level} levelIdx={levelIdx} on_victory={onVictory} />
    case 'mem':
      return <MemoryGame config={level} levelIdx={levelIdx} on_victory={onVictory} />
  }
}
