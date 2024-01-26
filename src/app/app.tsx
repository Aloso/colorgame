import { BigButton } from './dom/dom-helper'
import { blurToReactWidget, blurToWidget, overlayReactWidget, showReactWidget, showWidget } from './dom/widgets'
import { FloodGameWidget } from './game/flood-game-widget'
import { HueGameWidget } from './game/hue-game-widget'
import { levels, setHighScore } from './game/levels'
import { MemoryGameWidget } from './game/memory-game-widget'
import { showSuggestion } from './game/suggestions'
import { randomVictoryMessage, shortVictoryMessage } from './game/victory'
import { FullscreenButton } from './util/fullscreen'

export function StartScreen() {
  if (location.hash === '') {
    showReactWidget(
      <>
        <h1>Farbwirbel</h1>
        <BigButton onClick={() => introduction()}>Start</BigButton>
        <FullscreenButton normalText="Vollbild" fsText="Vollbild beenden" className="start-fs-button" />
      </>,
    )
  } else {
    showReactWidget(<h1>Farbwirbel</h1>)

    setTimeout(() => {
      const hash = location.hash
      if (hash === '#levels') {
        levelOverview()
      } else if (hash === '#end') {
        endScreen()
      } else if (hash.startsWith('#lvl-')) {
        const id = hash.replace(/^#lvl-/, '')
        const lvl = levels.findIndex((l) => l.id === id)
        if (lvl >= 0) {
          startLevel(lvl)
        } else {
          introduction()
        }
      } else {
        introduction()
      }
    }, 500)
  }

  if (window.innerWidth > window.innerHeight) {
    alert('Bitte öffne diese Website auf einem Handy oder Tablet im Hochformat!')
  }
}

let completedLevels = localStorage.completedLevels == null ? 0 : +localStorage.completedLevels

export function introduction() {
  if (isGameComplete()) {
    levelOverview()
  } else {
    startLevel(completedLevels)
  }
}

function levelOverview() {
  location.hash = `#levels`

  blurToReactWidget(
    <>
      <h2 style={{ display: 'flex', width: '100%' }}>
        <span style={{ flexGrow: 1 }}>Alle Level</span>
        <FullscreenButton normalText="⛶" fsText="⛶" className="heading-fs-button" />
      </h2>
      <div className="lvls">
        {levels.map((l, i) => (
          <button className="lvl" onClick={() => startLevel(i)}>
            <div className="lvl-id">{i + 1}</div>
            <div className="high-score">{l.highScore != null ? `${l.highScore} Züge` : ''}</div>
          </button>
        ))}
      </div>
    </>,
  )
}

function isGameComplete(): boolean {
  return completedLevels >= levels.length
}

function startLevel(lvl: number) {
  const level = levels[lvl]
  if (level == null) throw new Error('Game is null')

  if (level.onceBefore && localStorage[`${level.id}_before`] == null) {
    level.onceBefore().then(() => {
      localStorage[`${level.id}_before`] = 'true'
      startLevel(lvl)
    })
    return
  }

  location.hash = `#lvl-${level.id}`

  const game =
    level.type === 'hue-game'
      ? new HueGameWidget(lvl, level)
      : level.type === 'memory-game'
        ? new MemoryGameWidget(lvl, level)
        : new FloodGameWidget(lvl, level)

  blurToWidget(game)
  game.victory.on((moves: number) => showVictoryForLevel(lvl, moves))
}

function showVictoryForLevel(lvl: number, moves: number) {
  const previousRecord = levels[lvl].highScore
  const isNewRecord = setHighScore(lvl, moves)

  const showLvl0Msg = lvl === 0 && localStorage.showLvl0Msg == null
  localStorage.showLvl0Msg = 'shown'

  if (completedLevels === lvl) {
    localStorage.completedLevels = completedLevels = lvl + 1
  }

  const title = isNewRecord ? 'Neuer Rekord!' : showLvl0Msg ? shortVictoryMessage() : randomVictoryMessage()

  function proceed() {
    if (isGameComplete()) {
      if (localStorage.gameCompleteShown != null) {
        levelOverview()
      } else {
        endScreen()
      }
    } else {
      localStorage.removeItem('gameCompleteShown')
      startLevel(lvl + 1)
    }
  }

  function repeatLevel() {
    startLevel(lvl)
  }

  overlayReactWidget(
    <>
      <h1 dangerouslySetInnerHTML={{ __html: title }}></h1>
      {isNewRecord ? (
        <>
          <p>{moves} Züge</p>
          <p>Bisheriger Rekord: {previousRecord} Züge</p>
        </>
      ) : showLvl0Msg ? (
        <p>
          Mit deinen Adler&shy;augen war das wohl kein Problem für dich 😉. Aber der nächste Level ist nicht ganz so
          einfach!
        </p>
      ) : null}
      <BigButton onClick={() => showSuggestion(proceed)}>Weiter</BigButton>
      <button onClick={() => showSuggestion(repeatLevel)} style={{ fontSize: '83%', marginTop: '6vw' }}>
        Wiederholen
      </button>
    </>,
  )
}

function endScreen() {
  localStorage.gameCompleteShown = '1'

  location.hash = `#end`

  blurToReactWidget(
    <>
      <h1>
        🎄 Frohe 🎄
        <br />
        Weih&shy;nachten
      </h1>
      <p>
        Du hast alle Level abge&shy;schlossen. Du kannst jetzt ein&shy;zelne Level wieder&shy;holen, wenn du willst.
      </p>
      <BigButton onClick={() => levelOverview()}>Übersicht</BigButton>
    </>,
  )
}
