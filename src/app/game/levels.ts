import { HslColor } from '../color/hslColor'
import { GameConfig } from './hue-game-widget'

export const levels: GameConfig[] = [
  {
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
  },
  {
    width: 6,
    height: 7,
    level: 2,
    corners: [
      new HslColor(240, 100, 60),
      new HslColor(120, 100, 40),
      new HslColor(  0, 100, 50),
      new HslColor( 60, 100, 60),
    ],
    given: [0, 1, 2, 3, 4, 5, 6, 7, 13, 14, 20, 21, 27, 28, 34, 35, 36, 37, 38, 39, 40, 41],
  },
]


