import { useContext, useEffect } from 'react'

import { AppContext, setState } from '..'
import { randomVictoryMessage, shortVictoryMessage } from '../app/game/victory'
import { BigButton } from './big'
import { TextWidget } from './TextWidget'

interface VictoryProps {
  lvl: number
  moves: number
  previous_high: number | undefined

  proceed(action: 'repeat' | 'next' | 'overview'): void
}

export function Victory({ lvl, moves, previous_high, proceed }: VictoryProps) {
  const ctx = useContext(AppContext)

  useEffect(() => {
    setState((prev) => ({
      ...prev,
      completed_levels: prev.completed_levels + 1,
      lvl0_message_shown: true,
    }))
  }, [])

  const isNewHigh = previous_high != null && moves < previous_high
  const showLvl0Msg = lvl === 0 && !ctx.lvl0_message_shown

  const title = isNewHigh
    ? 'Neuer Rekord!'
    : showLvl0Msg
    ? shortVictoryMessage()
    : randomVictoryMessage()

  const text = isNewHigh ? (
    <>
      <p>{moves} Züge</p>
      <p>Bisheriger Rekord: {previous_high} Züge</p>
    </>
  ) : showLvl0Msg ? (
    <p>
      Mit deinen Adler&shy;augen war das wohl kein Problem für dich 😉. Aber der nächste Level ist
      nicht ganz so einfach!
    </p>
  ) : null

  return (
    <TextWidget>
      <h1>{title}</h1>
      {text}
      <BigButton onClick={() => showSuggestion(proceed('next'))}>Weiter</BigButton>
      <button
        style={{ fontSize: '83%', marginTop: '6vw' }}
        onClick={() => showSuggestion(() => proceed('repeat'))}
      >
        Wiederholen
      </button>
    </TextWidget>
  )
}
