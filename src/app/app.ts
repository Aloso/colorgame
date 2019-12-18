// enable hot reloading for this module:
import { HslColor } from './color/hslColor'
import { button, h1, p } from './dom/dom-helper'
import { TextWidget } from './dom/text-widget'
import { blurToWidget, showWidget } from './dom/widgets'
import { GameWidget } from './game/game-widget'

export function start() {
  showWidget(new TextWidget([
    h1('Farbwirbel'),
    button('Start', { class: 'big' }, () => blurToWidget(new TextWidget([
      h1('Willkommen!'),
      p('Dieses kleine Spiel ist mein dies&shy;jähriges Weihnachts&shy;geschenk. Ich hoffe, es macht dir Spaß!'),
      button('Weiter', { class: 'big' }, () => blurToWidget(new TextWidget([
        p('Als ich eben etwas malen wollte, habe ich aus Versehen meine Farbkiste fallen gelassen, und alle Farben sind über den Boden verteilt.'),
        p('Kannst du die Farben wieder in die richtige Reihenfolge bringen?'),
        button('Klar!', { class: 'big' }, () => startGame()),
      ]))),
    ]))),
  ]))
}

function startGame() {
  const game = new GameWidget({
    width: 5,
    height: 7,
    level: 1,
    corners: [
      new HslColor(  0, 100, 50),
      new HslColor( 60, 100, 60),
      new HslColor(240, 100, 60),
      new HslColor(120, 100, 40),
    ],
    given: [0, 1, 2, 3, 4, 5, 6, 7, 13, 14, 20, 21, 27, 28, 29, 30, 31, 32, 33, 34],
  })
  blurToWidget(game)

  game.victory.on(() => {
    console.log('won')
  })
}
