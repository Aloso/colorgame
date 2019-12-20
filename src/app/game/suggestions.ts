import { bigButton, h1, p } from '../dom/dom-helper'
import { TextWidget } from '../dom/text-widget'
import { blurToWidget } from '../dom/widgets'

export interface Suggestion {
  id: string
  title: string
  text: string
}

const suggestions: Suggestion[] = [
  {
    id: 'luminance',
    title: 'Tipp',
    text: 'Stelle die Bildschirmhelligkeit hoch genug, um die Farben gut unterscheiden zu können.',
  },
  {
    id: 'surrounding',
    title: 'Tipp',
    text: '',
  },
]

const suggestionsShown = suggestions.map(s => localStorage[s.id] === 'shown')

export function showSuggestion(then: () => void) {
  const nextIndex = suggestionsShown.indexOf(true)
  if (nextIndex >= 0) {
    const s = suggestions[nextIndex]
    suggestionsShown[nextIndex] = false
    localStorage[s.id] = 'shown'

    blurToWidget(new TextWidget([
      h1(s.title),
      p(s.text),
      bigButton('Weiter', then),
    ]))
  } else {
    then()
  }
}
