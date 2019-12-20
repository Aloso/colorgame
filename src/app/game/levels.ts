import { HslColor } from '../color/hslColor'
import { HueGameConfig } from './hue-game-widget'
import { MemoryGameConfig } from './memory-game-widget'

export interface GameConfig {
  type: 'hue-game' | 'memory-game',
  id: string,

  width: number,
  height: number,

  before?: () => void,
  highScore?: number,
}

export const levels: (HueGameConfig | MemoryGameConfig)[] = [
  {
    type: 'hue-game',
    id: 'hue-1',

    width: 5,
    height: 7,
    corners: [
      new HslColor(  0, 100, 50),
      new HslColor( 60, 100, 60),
      new HslColor(240, 100, 60),
      new HslColor(120, 100, 40),
    ],
    given: [0, 1, 2, 3, 4, 5, 6, 7, 13, 14, 20, 21, 27, 28, 29, 30, 31, 32, 33, 34],
  },
  {
    type: 'memory-game',
    id: 'mem-1',

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
    type: 'hue-game',
    id: 'hue-2',

    width: 6,
    height: 7,
    corners: [
      new HslColor(240, 100, 60),
      new HslColor(120, 100, 40),
      new HslColor(  0, 100, 50),
      new HslColor( 60, 100, 60),
    ],
    given: [0, 1, 2, 3, 4, 5, 6, 7, 13, 14, 20, 21, 27, 28, 34, 35, 36, 37, 38, 39, 40, 41],
  },
]

levels.forEach(l => {
  const v = localStorage[`${l.id}_high`]
  if (v != null) l.highScore = +v
})

export function setHighScore(lvl: number, moves: number): boolean {
  const l = levels[lvl]
  if (moves < (l.highScore || 0)) {
    l.highScore = moves
    localStorage[`${l.id}_high`] = moves
    return true
  }
  return false
}
