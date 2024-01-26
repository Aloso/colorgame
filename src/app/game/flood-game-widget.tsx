import { button, div } from '../dom/dom-helper'
import { Widget } from '../dom/widgets'
import { EventEmitter } from '../util/event-emitter'
import { gameHeader } from './game-util'
import { GameConfig } from './levels'

export interface FloodGameConfig extends GameConfig {
  type: 'flood-game'
  colors: string[]
}

export class FloodGameWidget implements Widget {
  readonly name = 'game widget'
  readonly node: HTMLElement

  readonly victory = new EventEmitter<number>()

  constructor(num: number, config: FloodGameConfig) {
    let moves = 0
    const movesElem = div('', { class: 'moves' })

    const fields = makeFields(config)

    let color = fields[0].dataset.color!
    let gameRunning = true

    const buttons = config.colors.map((c) => {
      return button(null, { class: 'flood-btn', style: `background: ${c}` }, () => {
        if (!gameRunning) return
        if (c !== color) {
          moves++
          movesElem.innerHTML = moves === 1 ? '1 Zug' : `${moves} Züge`

          floodColor(fields, config.width, config.height, color, c)

          color = c
          if (fields.every((f) => f.getAttribute('data-color') === c)) {
            gameRunning = false
            fields[0].classList.remove('given')
            buttonDiv.remove()
            contentDiv.style.background = c
            setTimeout(() => this.victory.emit(moves), 500)
          }
        }
      })
    })

    const contentDiv = div(fields, { class: 'flood-bg' })
    const buttonDiv = div(buttons, { class: 'flood-controls' })

    this.node = div([gameHeader(num, config, movesElem), contentDiv, buttonDiv], {
      class: 'widget game-widget',
    })
  }
}

function floodColor(
  fields: HTMLDivElement[],
  width: number,
  height: number,
  prev: string,
  newColor: string,
) {
  const getItem = getItem2(fields, width, height)

  const neighbors: [number, number][] = [[0, 0]]
  while (neighbors.length > 0) {
    const next = neighbors.pop()!
    const el = getItem(next)
    if (el != null) {
      el.style.background = newColor
      el.setAttribute('data-color', newColor)
    }

    const newNeighbors: [number, number][] = [
      [next[0], next[1] + 1],
      [next[0], next[1] - 1],
      [next[0] + 1, next[1]],
      [next[0] - 1, next[1]],
    ]
    neighbors.push(
      ...newNeighbors.filter((xy) => {
        return getItem(xy)?.getAttribute('data-color') === prev
      }),
    )
  }
}

function getItem2<T>(
  fields: T[],
  width: number,
  height: number,
): (xy: [number, number]) => T | null {
  return (xy: [number, number]) =>
    xy[0] >= 0 && xy[1] >= 0 && xy[0] < width && xy[1] < height
      ? fields[xy[1] * width + xy[0]] || null
      : null
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

  for (let y = 0; y < config.height; y++) {
    for (let x = 0; x < config.width; x++) {
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
  const w = 1 / width
  const h = 0.7 / height

  return (x: number, y: number, color: string) => {
    const elem = div(null, {
      class: 'game-field flood',
      style: `width: ${w * 100 + 1e-5}vw; height: ${h * 100 + 1e-5}vh; background-color: ${color};
              left: ${x * w * 100}vw; top: ${y * h * 100 + 10}vh`,
    })
    elem.setAttribute('data-color', color)
    return elem
  }
}
