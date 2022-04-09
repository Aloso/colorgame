import { bigButton, div, h1 } from '../dom/dom-helper'
import { TextWidget } from '../dom/text-widget'
import { blurToWidget } from '../dom/widgets'

export interface Suggestion {
  id: string
  title: string
  text: string
}

const suggestions: Suggestion[] = [
  {
    id: 'browser',
    title: 'Tipp',
    text: `<p>Um die App off&shy;line zu nut&shy;zen, kannst du sie
      <b>zum Start&shy;bild&shy;schirm hinzu&shy;fügen/eine Sei&shy;ten&shy;ver&shy;knüp&shy;fung erstellen</b>.</p>
      <p>Dies funk&shy;tio&shy;niert am besten in Chrome.</p>`,
  },
  {
    id: 'luminance',
    title: 'Tipp',
    text: 'Stelle die Bild&shy;schirm&shy;hellig&shy;keit hoch genug, um die Farben gut unter&shy;scheiden zu können.',
  },
  {
    id: 'save',
    title: 'Tipp',
    text: 'Es wird auto&shy;ma&shy;tisch gespei&shy;chert, welche Level du bereits abge&shy;schlossen hast.',
  },
  {
    id: 'repeat',
    title: 'Tipp',
    text: 'Du kannst Level wieder&shy;holen, um deinen Rekord an Zügen zu ver&shy;bessern.',
  },
]

const suggestionsShown = suggestions.map((s) => localStorage[s.id + '_hint'] === 'shown')

export function showSuggestion(then: () => void) {
  const nextIndex = suggestionsShown.indexOf(false)
  if (nextIndex >= 0) {
    const s = suggestions[nextIndex]
    suggestionsShown[nextIndex] = true
    localStorage[s.id + '_hint'] = 'shown'

    blurToWidget(new TextWidget([h1(s.title), div(s.text), bigButton('Weiter', then)]))
  } else {
    then()
  }
}
