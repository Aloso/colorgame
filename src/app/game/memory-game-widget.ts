import { div } from '../dom/dom-helper'
import { Widget } from '../dom/widgets'
import { EventEmitter } from '../util/event-emitter'
import { gameHeader, shuffle } from './game-util'
import { GameConfig } from './levels'

export interface MemoryGameConfig extends GameConfig {
  type: 'memory-game',
  colors: string[]
}

export class MemoryGameWidget implements Widget {
  readonly name = 'game widget'
  readonly node: HTMLElement

  readonly victory = new EventEmitter<number>()

  constructor(num: number, config: MemoryGameConfig) {
    let clicked: HTMLDivElement | null = null
    let gameRunning = false
    let waiting = false

    let moves = 0
    const movesElem = div('', { class: 'moves' })

    const fields = makeFields(config, (el) => {
      if (!gameRunning || waiting) return

      if (clicked == null) {
        clicked = el
        rotate(clicked)
      } else if (clicked !== el) {
        const first = clicked
        clicked = null

        rotate(el)
        moves += 1
        movesElem.innerHTML = moves === 1 ? '1 Zug' : `${moves} Züge`
        waiting = true

        if (first.getAttribute('data-color') === el.getAttribute('data-color')) {
          setTimeout(() => {
            const parent = first.parentElement
            if (parent == null) throw new Error('First child is not attached to DOM')
            remove(first)
            remove(el)
            waiting = false

            setTimeout(() => {
              if (parent.childElementCount === 0) {
                gameRunning = false
                setTimeout(() => this.victory.emit(moves), 300)
              }
            }, 500)
          }, 900)
        } else {
          setTimeout(() => {
            rotate(first)
            rotate(el)
            waiting = false
          }, 1700)
        }
      }
    })

    this.node = div([
      gameHeader(num, config, movesElem),
      div(fields, { class: 'memory-bg' }),
    ], { class: 'widget game-widget' })

    gameRunning = true
  }
}

function rotate(field: HTMLDivElement) {
  field.classList.toggle('active')

  if (field.classList.contains('active')) {
    const color = field.getAttribute('data-color')
    field.style.backgroundColor = color || ''
  } else {
    field.style.backgroundColor = ''
  }
}

function remove(field: HTMLDivElement) {
  field.classList.add('removed')
  field.classList.remove('active')
  field.style.backgroundColor = ''

  setTimeout(() => field.remove(), 400)
}


function makeFields(config: MemoryGameConfig, onClick: (elem: HTMLDivElement) => void): HTMLDivElement[] {
  if (config.width * config.height !== config.colors.length * 2) {
    throw new Error('Odd number of fields')
  }

  const w = 1 / config.width * 10_000
  const h = 0.9 / config.height * 10_000

  const elems: HTMLDivElement[] = []
  config.colors.forEach(c => elems.push(
    makeField(w, h, c, onClick),
    makeField(w, h, c, onClick),
  ))

  shuffle(elems)

  for (let x = 0; x < config.width; ++x) {
    for (let y = 0; y < config.height; ++y) {
      const elem = elems[y * config.width + x]
      elem.style.left = (w * x * 100) + 'vw'
      elem.style.top = (h * y * 100 + 10) + 'vh'
    }
  }

  return elems
}

function makeField(w: number, h: number, color: string, onClick: (elem: HTMLDivElement) => void) {
  const elem = div(null, {
    class: 'game-field memory',
    style: `width: ${w * 100 + 1e-5}vw; height: ${h * 100 + 1e-5}vh`,
  })
  elem.setAttribute('data-color', color)
  elem.addEventListener('click', () => onClick(elem))
  return elem
}
