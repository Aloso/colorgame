import { HslColor } from '../color/hslColor'
import { bigButton, h1, p } from '../dom/dom-helper'
import { TextWidget } from '../dom/text-widget'
import { blurToWidget } from '../dom/widgets'
import { FloodGameConfig } from './flood-game-widget'
import { HueGameConfig } from './hue-game-widget'
import { MemoryGameConfig } from './memory-game-widget'

export interface GameConfig {
  type: 'hue-game' | 'memory-game' | 'flood-game'
  id: string

  width: number
  height: number

  onceBefore?: () => Promise<void>
  highScore?: number
}

export interface GameProps {
  width: number
  height: number

  onceBefore?: () => Promise<void>
  highScore?: number
}

export const levels: (HueGameConfig | MemoryGameConfig | FloodGameConfig)[] = [
  {
    type: 'hue-game',
    id: 'hue-1',

    width: 5,
    height: 7,
    corners: [
      new HslColor(0, 100, 50),
      new HslColor(60, 100, 60),
      new HslColor(240, 100, 60),
      new HslColor(120, 100, 40),
    ],
    given: [0, 1, 2, 3, 4, 5, 6, 7, 13, 14, 20, 21, 27, 28, 29, 30, 31, 32, 33, 34],

    onceBefore: () =>
      new Promise((resolve) =>
        blurToWidget(
          new TextWidget([
            h1('Willkommen!'),
            p(
              'Dieses kleine Spiel ist mein dies&shy;jähriges Weihnachts&shy;geschenk. Ich hoffe, es macht dir Spaß!',
            ),
            bigButton('Weiter', () =>
              blurToWidget(
                new TextWidget([
                  p(
                    'Als ich eben etwas malen wollte, habe ich aus Versehen meine Farbkiste fallen gelassen, ' +
                      'und alle Wasser&shy;farben sind über den Boden verteilt.',
                  ),
                  p('Kannst du die Farben wieder in die richtige Reihenfolge bringen?'),
                  bigButton('Klar!', () => resolve()),
                ]),
              ),
            ),
          ]),
        ),
      ),
  },
  {
    type: 'memory-game',
    id: 'mem-1',

    width: 4,
    height: 5,
    colors: [
      '#ff0000',
      '#ff6e00',
      '#ffb100',
      '#fffa00',
      '#87ff00',
      '#00ffc0',
      '#00b2ff',
      '#0049ff',
      '#7700ff',
      '#ff00de',
    ],

    onceBefore: () =>
      new Promise((resolve) =>
        blurToWidget(
          new TextWidget([
            h1('Memory'),
            p('Auch meine buten Papiere sind durch&shy;einan&shy;der gera&shy;ten!'),
            p(
              'Ich habe jede Farbe zwei mal. Kannst du die Farb&shy;paare geord&shy;net auf&shy;sam&shy;meln?',
            ),
            bigButton('In Ordnung!', () => resolve()),
          ]),
        ),
      ),
  },
  {
    type: 'flood-game',
    id: 'flood-1',

    width: 10,
    height: 12,
    colors: ['#f02913', '#33cb00', '#2544cf', '#e55aff', '#ffff00', '#89e4ff'],

    onceBefore: () =>
      new Promise((resolve) =>
        blurToWidget(
          new TextWidget([
            h1('Farbenflut'),
            p('Färbe alle Felder in der gleichen Farbe!'),
            p(
              'Du startest links oben; wenn du unten auf eine Farbe tippst, ' +
                'werden oben alle angren&shy;zen&shy;den Fel&shy;der mit der glei&shy;chen Farbe so ein&shy;ge&shy;färbt.',
            ),
            bigButton('Los!', () => resolve()),
          ]),
        ),
      ),
  },
  {
    type: 'hue-game',
    id: 'hue-2',

    width: 6,
    height: 7,
    corners: [
      new HslColor(240, 100, 60),
      new HslColor(120, 100, 40),
      new HslColor(0, 100, 50),
      new HslColor(60, 100, 60),
    ],
    given: [0, 1, 2, 3, 4, 5, 6, 7, 13, 14, 20, 21, 27, 28, 34, 35, 36, 37, 38, 39, 40, 41],
  },
  {
    type: 'memory-game',
    id: 'mem-2',

    width: 4,
    height: 6,
    colors: [
      '#ff0000',
      '#ff6e00',
      '#ffb100',
      '#fffa00',
      '#95ff00',
      '#00ff35',
      '#00f4ff',
      '#0090ff',
      '#0059ff',
      '#5800ff',
      '#8b00ff',
      '#ff00de',
    ],
  },
  {
    type: 'flood-game',
    id: 'flood-2',

    width: 11,
    height: 14,
    colors: ['#f02913', '#33cb00', '#2544cf', '#e55aff', '#ffff00', '#89e4ff'],
  },
  {
    type: 'hue-game',
    id: 'hue-3',

    width: 6,
    height: 7,
    corners: [
      new HslColor(120, 100, 40),
      new HslColor(270, 100, 60),
      new HslColor(60, 100, 60),
      new HslColor(0, 100, 50),
    ],
    given: [0, 1, 2, 3, 4, 5, 6, 7, 13, 14, 20, 21, 27, 28, 34, 35, 36, 37, 38, 39, 40, 41],
  },
  {
    type: 'memory-game',
    id: 'mem-3',

    width: 4,
    height: 6,
    colors: [
      '#d90000',
      '#d95a00',
      '#d99400',
      '#d9d200',
      '#82d900',
      '#00d92b',
      '#00d2d9',
      '#007bd9',
      '#004cd9',
      '#4800d9',
      '#7400d9',
      '#d900bf',
    ],
  },
  {
    type: 'flood-game',
    id: 'flood-3',

    width: 12,
    height: 15,
    colors: ['#f02913', '#33cb00', '#2544cf', '#e55aff', '#ffff00', '#89e4ff'],
  },
  {
    type: 'hue-game',
    id: 'hue-4',

    width: 6,
    height: 8,
    corners: [
      new HslColor(120, 85, 70),
      new HslColor(300, 100, 70),
      new HslColor(240, 100, 40),
      new HslColor(0, 100, 50),
    ],
    given: [0, 1, 2, 3, 4, 5, 6, 7, 8, 15, 16, 23, 24, 31, 32, 39, 40, 41, 42, 43, 44, 45, 46, 47],
  },
  {
    type: 'memory-game',
    id: 'mem-4',

    width: 4,
    height: 7,
    colors: [
      '#ff0000',
      '#ff6e00',
      '#ffb100',
      '#fffa00',
      '#95ff00',
      '#00ff35',
      '#00f4ff',
      '#0090ff',
      '#0059ff',
      '#5800ff',
      '#8b00ff',
      '#ff00de',
      '#636363',
      '#c7c7c7',
    ],
  },
  {
    type: 'flood-game',
    id: 'flood-4',

    width: 13,
    height: 17,
    colors: ['#f02913', '#33cb00', '#2544cf', '#e55aff', '#ffff00', '#89e4ff'],
  },
  {
    type: 'hue-game',
    id: 'hue-5',

    width: 6,
    height: 8,
    corners: [
      new HslColor(300, 80, 30),
      new HslColor(240, 80, 60),
      new HslColor(60, 80, 60),
      new HslColor(0, 80, 60),
    ],
    given: [0, 1, 2, 3, 4, 5, 6, 7, 8, 15, 16, 23, 24, 31, 32, 39, 40, 41, 42, 43, 44, 45, 46, 47],
  },
  {
    type: 'memory-game',
    id: 'mem-5',

    width: 5,
    height: 6,
    colors: [
      '#ff3333',
      '#ff8833',
      '#ffbe33',
      '#fff833',
      '#adff33',
      '#33ff5c',
      '#33f8ff',
      '#33a7ff',
      '#3355ff',
      '#7733ff',
      '#b833ff',
      '#ff38c8',
      '#000000',
      '#686868',
      '#dcdcdc',
    ],
  },
  {
    type: 'flood-game',
    id: 'flood-5',

    width: 14,
    height: 18,
    colors: ['#f02913', '#33cb00', '#2544cf', '#e55aff', '#ffff00', '#89e4ff'],
  },
  {
    type: 'hue-game',
    id: 'hue-6',

    width: 6,
    height: 8,
    corners: [
      new HslColor(300, 80, 40),
      new HslColor(240, 100, 55),
      new HslColor(60, 80, 50),
      new HslColor(120, 100, 35),
    ],
    given: [0, 1, 2, 3, 4, 5, 6, 7, 40, 41, 42, 43, 44, 45, 46, 47],
  },
  {
    type: 'memory-game',
    id: 'mem-6',

    width: 4,
    height: 8,
    colors: [
      '#ff3333',
      '#ff8833',
      '#ffbe33',
      '#fff833',
      '#adff33',
      '#33ff5c',
      '#33f8ff',
      '#33a7ff',
      '#3355ff',
      '#7733ff',
      '#b833ff',
      '#ff38c8',
      '#000000',
      '#575757',
      '#d1d1d1',
      '#ffffff',
    ],
  },
  {
    type: 'flood-game',
    id: 'flood-6',

    width: 15,
    height: 20,
    colors: ['#f02913', '#33cb00', '#2544cf', '#e55aff', '#ffff00', '#89e4ff'],
  },

  // Difficulty: Impossible
  // {
  //   type: 'hue-game',
  //   id: 'hue-5',
  //   width: 6,
  //   height: 8,
  //   corners: [
  //     new HslColor(300, 80, 30),
  //     new HslColor(240, 80, 60),
  //     new HslColor( 60, 80, 60),
  //     new HslColor(  0, 80, 60),
  //   ],
  //   given: [0, 7, 9, 14, 18, 21, 26, 29, 33, 38, 40, 47],
  // },
]

levels.forEach((l) => {
  const v = localStorage[`${l.id}_high`]
  if (v != null) l.highScore = +v
})

/**
 * Returns whether this is a high-score.
 * Note that `false` is returned if this is the first try
 */
export function setHighScore(lvl: number, moves: number): boolean {
  const l = levels[lvl]
  const high = l.highScore
  if (high == null || moves < high) {
    l.highScore = moves
    localStorage[`${l.id}_high`] = moves
    return high != null
  }
  return false
}
