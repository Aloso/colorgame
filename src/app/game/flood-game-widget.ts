import { GameConfig } from './levels'
import { EventEmitter } from '../util/event-emitter'
import { Widget } from '../dom/widgets'
import { div } from '../dom/dom-helper'
import { gameHeader } from './game-util'

export interface FloodGameConfig extends GameConfig {
  type: 'flood-game',
  colors: string[],
}

export class FloodGameWidget implements Widget {
  readonly name = 'game widget'
  readonly node: HTMLElement

  readonly victory = new EventEmitter<number>()

  constructor(num: number, config: FloodGameConfig) {
    const moves = 0
    const movesElem = div('', { class: 'moves' })

    const fields = makeFields(config)

    this.node = div([
      gameHeader(num, config, movesElem),
      div(fields, { class: 'flood-bg' }),
    ], { class: 'widget game-widget' })
  }
}


function makeFields(config: FloodGameConfig): HTMLDivElement[] {
  const res: HTMLDivElement[] = []

  const fields = config.width * config.height
  const minColorFreq = (fields / config.colors.length) | 0

  const colorFreq = config.colors.map(() => minColorFreq)
  const colors = config.colors.slice()

  const remain = fields - minColorFreq * config.colors.length
  for (let i = 0; i < remain; ++i) colorFreq[i]++

  if (colorFreq.reduce((a, b) => a + b) !== fields) throw new Error('Invalid color count')

  const makeField = makeField2(config.width, config.height)

  for (let x = 0; x < config.width; x++) {
    for (let y = 0; y < config.height; y++) {
      const ix = (Math.random() * colorFreq.length) | 0
      const color = colors[ix]
      colorFreq[ix]--
      if (colorFreq[ix] === 0) {
        colorFreq.splice(ix, 1)
        colors.splice(ix, 1)
      }

      res.push(makeField(x, y, color))
    }
  }

  res[0].classList.add('given')

  return res
}

function makeField2(width: number, height: number) {
  const w = Math.ceil(1 / width * 100_000_000) / 100_000_000
  const h = Math.ceil(0.7 / height * 100_000_000) / 100_000_000

  return (x: number, y: number, color: string) => {
    const elem = div(null, {
      class: 'game-field flood',
      style: `width: ${w * 100}vw; height: ${h * 100}vh; background-color: ${color};
              left: ${x * w * 100}vw; top: ${y * h * 100 + 10}vh`,
    })
    elem.setAttribute('data-color', color)
    return elem
  }
}
