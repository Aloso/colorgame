export type SuggestionId = 'browser' | 'luminance' | 'save' | 'repeat'

export type GameId = 'flood' | 'hue' | 'mem'

export type Highscore = number | undefined

export interface AppState {
  shown_hints: SuggestionId[]
  highscores: Highscore[]
  completed_levels: number

  tutorials_shown: Readonly<Record<GameId, boolean>>
  lvl0_message_shown: boolean
  end_shown: boolean
}

export function loadAppState(): Readonly<AppState> {
  const local = localStorage.getItem('appState')
  if (local != null) {
    return JSON.parse(local)
  } else {
    return {
      shown_hints: [],
      highscores: [],
      completed_levels: 0,

      tutorials_shown: {
        flood: false,
        hue: false,
        mem: false,
      },
      lvl0_message_shown: false,
      end_shown: false,
    }
  }
}

export function storeAppState(state: Readonly<AppState>) {
  localStorage.setItem('appState', JSON.stringify(state))
}
