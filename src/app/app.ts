import { bigButton, button, div, el, frag, h1, p, span } from './dom/dom-helper'
import { TextWidget } from './dom/text-widget'
import { blurToWidget, overlayWidget, showWidget } from './dom/widgets'
import { HueGameWidget } from './game/hue-game-widget'
import { levels, setHighScore } from './game/levels'
import { showSuggestion } from './game/suggestions'
import { randomVictoryMessage, shortVictoryMessage } from './game/victory'
import { fullscreenButton } from './util/fullscreen'
import { MemoryGameWidget } from './game/memory-game-widget'

const fsButton = fullscreenButton('Vollbild', 'Vollbild beenden', 'start-fs-button')

const levelFsButton = fullscreenButton('⛶', '⛶', 'heading-fs-button')


export function startScreen() {
  showWidget(new TextWidget(frag(
    h1('Farbwirbel'),
    bigButton('Start', () => introduction()),
    fsButton,
  )))

  if (window.innerWidth > window.innerHeight) {
    alert('Bitte öffne diese Website auf einem Handy oder Tablet im Hochformat!')
  }
}

let introShown: boolean = localStorage.introShown === 'true'
let completedLevels = localStorage.completedLevels == null ? 0 : +localStorage.completedLevels

export function introduction() {
  if (isGameComplete()) {
    levelOverview()
  } else if (introShown) {
    startLevel(completedLevels)
  } else {
    blurToWidget(new TextWidget([
      h1('Willkommen!'),
      p('Dieses kleine Spiel ist mein dies&shy;jähriges Weihnachts&shy;geschenk. Ich hoffe, es macht dir Spaß!'),
      bigButton('Weiter', () => blurToWidget(new TextWidget([
        p('Als ich eben etwas malen wollte, habe ich aus Versehen meine Farbkiste fallen gelassen, und alle Farben sind über den Boden verteilt.'),
        p('Kannst du die Farben wieder in die richtige Reihenfolge bringen?'),
        bigButton('Klar!', () => {
          localStorage.introShown = introShown = true
          startLevel(completedLevels)
        }),
      ]))),
    ]))
  }
}


function levelOverview() {
  const levelsEl = levels.map((l, i) => button([
    div(`${i + 1}`, { class: 'lvl-id' }),
    div(l.highScore != null ? `${l.highScore} Züge` : '', { class: 'high-score' }),
  ], { class: 'lvl' }, () => startLevel(i)))

  blurToWidget(new TextWidget(frag(
    el('h2', frag(
      span('Alle Level', { style: 'flex-grow: 1' }),
      levelFsButton,
    ), { style: 'display: flex; width: 100%' }),
    div(levelsEl, { class: 'lvls' }),
  )))
}

function isGameComplete(): boolean {
  return completedLevels >= levels.length
}

function startLevel(lvl: number) {
  const level = levels[lvl]
  if (level == null) throw new Error('Game is null')

  const game = level.type === 'hue-game'
    ? new HueGameWidget(lvl, level)
    : new MemoryGameWidget(lvl, level)

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

  const title = isNewRecord
    ? 'Neuer Rekord!'
    : showLvl0Msg ? shortVictoryMessage() : randomVictoryMessage()

  const text = isNewRecord
    ? [p(`${moves} Züge`), p(`Bisheriger Rekord: ${previousRecord} Züge`)]
    : showLvl0Msg
      ? p(`Mit deinen Adler&shy;augen war das wohl kein Problem für dich 😉. Aber der nächste Level ist nicht ganz so einfach!`)
      : null

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

  overlayWidget(new TextWidget(frag(
    h1(title),
    text,
    bigButton('Weiter', () => showSuggestion(proceed)),
    button('Wiederholen', { style: 'font-size: 83%; margin-top: 6vw' },
      () => showSuggestion(repeatLevel)),
  )))
}

function endScreen() {
  localStorage.gameCompleteShown = '1'

  blurToWidget(new TextWidget([
    h1('Spiel abge&shy;schlos&shy;sen'),
    p('Du hast alle Level beendet. Du kannst jetzt einzelne Level wiederholen, wenn du willst'),
    bigButton('Übersicht', () => levelOverview()),
  ]))
}
