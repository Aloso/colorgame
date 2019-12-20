import { Color } from '../color/color'
import { div, frag, span } from '../dom/dom-helper'
import { IWidget } from '../dom/widgets'
import { EventEmitter } from '../util/event-emitter'
import { fullscreenButton } from '../util/fullscreen'

export interface HueGameConfig {
  width: number,
  height: number,
  level: number,
  corners: [Color<any>, Color<any>, Color<any>, Color<any>],
  given: number[],
  highScore?: number,
}

const fsButton = fullscreenButton('⛶', '⛶', 'heading-fs-button white-bg')

export class HueGameWidget implements IWidget {
  readonly name = 'game widget'
  readonly node: HTMLElement

  readonly victory = new EventEmitter<number>()

  constructor(config: HueGameConfig) {
    let clicked: HTMLDivElement | null = null
    let gameRunning = false

    let moves = 0
    const movesElem = div('', { class: 'moves' })

    let movable: HTMLDivElement[]
    const fields = makeFields(config, (el) => {
      if (!gameRunning) return

      if (clicked != null && clicked !== el) {
        clicked.classList.remove('active')
        toggle(clicked, el).then()
        moves += 1
        movesElem.innerHTML = moves === 1 ? '1 Zug' : `${moves} Züge`

        clicked = null
        if (isSorted(movable)) {
          gameRunning = false
          fields.forEach(f => f.classList.remove('given'))

          setTimeout(() => this.victory.emit(moves), 1200)
        }
      } else if (clicked != null) {
        clicked.classList.remove('active')
        clicked = null
      } else {
        clicked = el
        clicked.classList.add('active')
      }
    })

    const header = div(frag(
      span(`Level ${config.level}`, { class: 'lvl' }),
      movesElem,
      fsButton,
    ), { class: 'game-header' })

    this.node = div([header, div(fields)], { class: 'widget game-widget' })

    setTimeout(() => {
      movable = shuffle(fields)
      gameRunning = true
    }, 2000)
  }
}

function toggle(a: HTMLDivElement, b: HTMLDivElement): Promise<void> {
  return new Promise((resolve) => {
    a.style.zIndex = b.style.zIndex = '2'
    const x1 = a.style.left
    const y1 = a.style.top
    const x2 = b.style.left
    const y2 = b.style.top

    a.style.left = x2
    a.style.top = y2
    b.style.left = x1
    b.style.top = y1

    const i1 = a.getAttribute('data-i')!
    const i2 = b.getAttribute('data-i')!
    a.setAttribute('data-i', i2)
    b.setAttribute('data-i', i1)

    setTimeout(() => {
      a.style.zIndex = b.style.zIndex = ''
      resolve()
    }, 300)
  })
}

function shuffle(array: HTMLDivElement[]): HTMLDivElement[] {
  const fields = array.filter(div => !div.classList.contains('given'))

  fields.forEach((field, i) => {
    field.setAttribute('data-i', '' + i)
  })

  for (let i = fields.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    toggle(fields[i], fields[j]).then()
  }
  return fields
}

function isSorted(array: HTMLDivElement[]): boolean {
  const numbers = array.map(div => +div.getAttribute('data-i')!)

  for (let i = 0, len = numbers.length - 1; i < len; i++) {
    if (numbers[i] > numbers[i + 1]) return false
  }
  return true
}


function makeFields(config: HueGameConfig, onClick: (elem: HTMLDivElement) => void): HTMLDivElement[] {
  const c1 = config.corners[0].rgb
  const c2 = config.corners[1].rgb
  const c3 = config.corners[2].rgb
  const c4 = config.corners[3].rgb

  const steps = config.width - 1
  const w = Math.ceil(1 / config.width * 100_000_000) / 100_000_000
  const h = Math.ceil(0.9 / config.height * 100_000_000) / 100_000_000

  const row1 = new Array(config.width).fill(0).map((_, i) => c1.middleBetween(c2, i / steps))
  const row2 = new Array(config.width).fill(0).map((_, i) => c3.middleBetween(c4, i / steps))

  const res: HTMLDivElement[] = []
  for (let x = 0; x < config.width; ++x) {
    for (let y = 0; y < config.height; ++y) {
      const color = row1[x].middleBetween(row2[x], y / (config.height - 1))
      const elem = div([], {
        class: 'game-field',
        style: `background: ${color.hex}; width: ${w * 100}vw; height: ${h * 100}vh; left: ${x * w * 100}vw; top: ${y * h * 100 + 10}vh`,
      })
      elem.addEventListener('click', () => {
        if (!elem.classList.contains('given')) onClick(elem)
      })
      res.push(elem)
    }
  }
  config.given.forEach(n => res[n].classList.add('given'))
  return res
}

