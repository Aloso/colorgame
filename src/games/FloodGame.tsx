import { useState } from 'react'

import { shuffle } from '../app/game/game-util'
import { GameConfig } from '../app/game/levels'
import { GameHeader } from '../components/GameHeader'

export interface FloodGameConfig {
  config: GameConfig & { colors: string[] }
  levelIdx: number
  on_victory(moves: number): void
}

export function FloodGame({
  config: { width, height, colors },
  levelIdx,
  on_victory,
}: FloodGameConfig) {
  const [fields, setFields] = useState(() => generateFields(width, height, colors))
  const [moves, setMoves] = useState(0)
  const [gameRunning, setGameRunning] = useState(true)
  const color = fields[0]

  const buttons = colors.map((background) => {
    return (
      <button
        key={background}
        className="flood-btn"
        style={{ background }}
        onClick={() => {
          if (!gameRunning) return
          if (background !== color) {
            setMoves(moves + 1)
            setFields(floodColor(fields, width, height, background))

            if (fields.every((f) => f === background)) {
              setGameRunning(false)
              setTimeout(() => on_victory(moves), 500)
            }
          }
        }}
      />
    )
  })

  return (
    <div className="widget game-widget">
      <GameHeader levelIdx={levelIdx}>
        <div className="moves">{moves === 0 ? '' : moves === 1 ? '1 Zug' : `${moves} Züge`}</div>
      </GameHeader>
      <div className="flood-bg" style={{ background: gameRunning ? undefined : color }}>
        {fields.map((color, i) => (
          <Field
            key={i}
            color={color}
            given={gameRunning && i === 0}
            width={width}
            height={height}
            x={i % width}
            y={(i / width) | 0}
          />
        ))}
      </div>
      {gameRunning && <div className="flood-controls">{buttons}</div>}
    </div>
  )
}

function floodColor(fields: string[], width: number, height: number, newColor: string): string[] {
  fields = fields.slice()
  const neighbors: [number, number][] = [[0, 0]]
  const prev = fields[0]

  let next: [number, number] | undefined
  while ((next = neighbors.pop()) != undefined) {
    const idx = getIndex(width, height, next)
    if (idx != null) {
      fields[idx] = newColor
    }

    const [nx, ny] = next
    const newNeighbors: [number, number][] = [
      [nx, ny + 1],
      [nx, ny - 1],
      [nx + 1, ny],
      [nx - 1, ny],
    ]

    neighbors.push(
      ...newNeighbors.filter((xy) => {
        const idx = getIndex(width, height, xy)
        return idx != null ? fields[idx] === prev : false
      }),
    )
  }

  return fields
}

function getIndex(width: number, height: number, [x, y]: [number, number]): number | null {
  return x >= 0 && y >= 0 && x < width && y < height ? y * width + x : null
}

function generateFields(width: number, height: number, colors: string[]): string[] {
  const fieldNumber = width * height
  const colorFreq = Math.ceil(fieldNumber / colors.length)

  const result: string[] = new Array(colorFreq * colors.length)
  for (let i = 0; i < colorFreq; i++) {
    result.push(...colors)
  }
  result.length = fieldNumber
  shuffle(result)
  return result
}

interface FieldProps {
  width: number
  height: number
  x: number
  y: number
  color: string
  given: boolean
}

function Field({ width, height, x, y, color, given }: FieldProps) {
  const w = 1 / width
  const h = 0.7 / height

  return (
    <div
      className={`game-field flood ${given ? 'given' : ''}`}
      style={{
        width: `${w * 100 + 1e-5}vw`,
        height: `${h * 100 + 1e-5}vh`,
        backgroundColor: color,
        left: `${x * w * 100}vw`,
        top: `${y * h * 100 + 10}vh`,
      }}
    />
  )
}
