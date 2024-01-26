import { useContext } from 'react'

import { AppContext } from '..'
import { levels } from '../app/game/levels'
import { BigLink } from '../components/big'
import { FullscreenButton } from '../components/FullscreenButton'
import { TextWidget } from '../components/TextWidget'

export function StartScreen() {
  if (window.innerWidth > window.innerHeight) {
    setTimeout(
      () => alert('Bitte öffne diese Website auf einem Handy oder Tablet im Hochformat!'),
      100,
    )
  }

  const { completed_levels: completedLevels } = useContext(AppContext)
  const gameComplete = completedLevels >= levels.length

  return (
    <TextWidget>
      <h1>Farbwirbel</h1>
      <BigLink to={gameComplete ? '/end' : `/lvl/${completedLevels}`}>Start</BigLink>
      <FullscreenButton
        fsText="Vollbild beenden"
        normalText="Vollbild"
        className="start-fs-button"
      />
    </TextWidget>
  )
}
