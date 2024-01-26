import { useEffect, useState } from 'react'

import { Color } from '../app/color/color'
import { GameConfig } from '../app/game/levels'
import { GameHeader } from '../components/GameHeader'

type Corners = [Color<any>, Color<any>, Color<any>, Color<any>]

interface Field {
  color: string
  num: number
  x: number
  y: number
  given: boolean
}

export interface HueGameConfig {
  config: GameConfig & { corners: Corners; given: number[] }
  levelIdx: number
  on_victory(moves: number): void
}

export function HueGame({ config, levelIdx, on_victory }: HueGameConfig) {
  const [fields, setFields] = useState(() =>
    generateFields(config.width, config.height, config.corners, config.given),
  )
  const [moves, setMoves] = useState(0)
  const [gameRunning, setGameRunning] = useState(false)
  const [clicked, setClicked] = useState<Field | null>(null)

  let movable: Field[]

  function clickField(el: Field) {
    if (!gameRunning) return

    if (clicked != null && clicked !== el) {
      setClicked(null)
      toggle(clicked, el)
      setMoves((prev) => prev + 1)

      if (isSorted(movable)) {
        setGameRunning(false)
        setTimeout(() => on_victory(moves), 1200)
      }
    } else if (clicked != null) {
      setClicked(null)
    } else {
      setClicked(el)
    }
  }

  useEffect(() => {
    setTimeout(() => {
      movable = shuffle(fields)
      setGameRunning(true)
    }, 2000)
  }, [])

  const w = 1 / config.width
  const h = 0.9 / config.height

  return (
    <div className="widget game-widget">
      <GameHeader levelIdx={levelIdx}>
        <div className="moves">{moves === 0 ? '' : moves === 1 ? '1 Zug' : `${moves} Züge`}</div>
      </GameHeader>
      <div>
        {fields.map((field, i) => (
          <button
            key={i}
            className={`game-field hue ${clicked?.num === i ? 'active' : ''} ${
              config.given.includes(i) ? 'given' : ''
            }`}
            style={{
              background: field.color,
              width: `${w * 100 + 1e-5}vw`,
              height: `${h * 100 + 1e-5}vh`,
              left: `${field.x * w * 100}vw`,
              top: `${field.y * h * 100 + 10}vh`,
            }}
            onClick={() => {
              if (!config.given.includes(i)) clickField(field)
            }}
          />
        ))}
      </div>
    </div>
  )
}

function toggle(a: Field, b: Field): Promise<void> {
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

    const i1 = a.num
    const i2 = b.num
    a.setAttribute('data-i', i2)
    b.setAttribute('data-i', i1)

    setTimeout(() => {
      a.style.zIndex = b.style.zIndex = ''
      resolve()
    }, 300)
  })
}

function shuffle(array: Field[]): Field[] {
  const fields = array.filter((field) => !field.given)

  for (let i = fields.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    toggle(fields[i], fields[j]).then()
  }
  return fields
}

function isSorted(array: Field[]): boolean {
  for (let i = 0, len = array.length - 1; i < len; i++) {
    if (array[i].num > array[i + 1].num) return false
  }
  return true
}

function generateFields(width: number, height: number, corners: Corners, given: number[]): Field[] {
  const c1 = corners[0].rgb
  const c2 = corners[1].rgb
  const c3 = corners[2].rgb
  const c4 = corners[3].rgb

  const steps = width - 1

  const row1 = new Array(width).fill(0).map((_, i) => c1.middleBetween(c2, i / steps))
  const row2 = new Array(width).fill(0).map((_, i) => c3.middleBetween(c4, i / steps))

  const result: Field[] = []
  for (let x = 0; x < width; ++x) {
    for (let y = 0; y < height; ++y) {
      const color = row1[x].middleBetween(row2[x], y / (height - 1)).hex
      const num = x + y * width
      result.push({
        color,
        num,
        x,
        y,
        given: given.includes(num),
      })
    }
  }
  return result
}
