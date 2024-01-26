import { useNavigate } from 'react-router-dom'

import { levels } from '../app/game/levels'
import { FullscreenButton } from '../components/FullscreenButton'
import { TextWidget } from '../components/TextWidget'

export function LevelOverview() {
  const navigate = useNavigate()

  return (
    <TextWidget>
      <h2 style={{ display: 'flex', width: '100%' }}>
        <span style={{ flexGrow: 1 }}>Alle Level</span>
        <FullscreenButton fsText="⛶" normalText="⛶" className="heading-fs-button" />
      </h2>
      <div className="lvls">
        {levels.map((l, i) => (
          <button className="lvl" onClick={() => navigate(`/lvl/${i + 1}`)} key={i}>
            <div className="lvl-id">{i + 1}</div>
            <div className="high-score">{l.highScore != null ? `${l.highScore} Züge` : ''}</div>
          </button>
        ))}
      </div>
    </TextWidget>
  )
}
