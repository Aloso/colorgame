import { ReactNode } from 'react'

import { FullscreenButton } from './FullscreenButton'

interface GameHeaderProsp {
  levelIdx: number
  children: ReactNode
}

export function GameHeader({ levelIdx, children }: GameHeaderProsp) {
  return (
    <div>
      <span className="lvl">Level {levelIdx + 1}</span>
      {children}
      <FullscreenButton fsText="⛶" normalText="⛶" className="heading-fs-button white-bg" />
    </div>
  )
}
