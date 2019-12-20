import { bigButton, button, div, el, frag, h1, p, span } from './dom/dom-helper'
import { TextWidget } from './dom/text-widget'
import { blurToWidget, overlayWidget, showWidget } from './dom/widgets'
import { HueGameWidget } from './game/hue-game-widget'
import { levels } from './game/levels'
import { showSuggestion } from './game/suggestions'
import { randomVictoryMessage, shortVictoryMessage } from './game/victory'
import { fullscreenButton } from './util/fullscreen'

const fsButton = fullscreenButton('Vollbild', 'Vollbild beenden',
  'font-size: 83%; margin-top: 10vw')

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
    div(`${l.level}`, { class: 'lvl-id' }),
    div(l.highScore != null ? `Rekord: ${l.highScore}` : '', { class: 'high-score' }),
  ], { class: 'lvl' }, () => {
    startLevel(i)
  }))

  blurToWidget(new TextWidget(frag(
    el('h2', 'Alle Level'),
    div(levelsEl, { class: 'lvls' }),
  )))
}

function isGameComplete(): boolean {
  return completedLevels >= levels.length
}

function startLevel(lvl: number) {
  const game = new HueGameWidget(levels[lvl])
  if (game == null) throw new Error('Game is null')

  blurToWidget(game)
  game.victory.on((moves: number) => showVictoryForLevel(lvl, moves))
}

function showVictoryForLevel(lvl: number, moves: number) {
  const key = `lvl${lvl}`
  const previousRecord = +(localStorage[key] || 0) || null
  const isNewRecord = previousRecord != null && moves < previousRecord

  const showLvl0Msg = lvl === 0 && localStorage.showLvl0Msg == null
  localStorage.showLvl0Msg = 'shown'

  localStorage[key] = moves
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
        localStorage.gameCompleteShown = '1'
        blurToWidget(new TextWidget([
          h1('Spiel abge&shy;schlos&shy;sen'),
          p('Du hast alle Level beendet. Du kannst jetzt einzelne Level wiederholen, wenn du willst'),
          bigButton('Übersicht', () => levelOverview()),
        ]))
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
