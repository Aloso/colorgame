import { Suggestion as SuggestionData } from '../app/game/suggestions'
import { BigButton } from './big'
import { TextWidget } from './TextWidget'

interface SuggestionProps {
  suggestion: SuggestionData
  accept(): void
}

export function CSuggestion({ suggestion, accept }: SuggestionProps) {
  return (
    <TextWidget>
      <h1>{suggestion.title}</h1>
      <div>{suggestion.text}</div>
      <BigButton onClick={accept}>Weiter</BigButton>
    </TextWidget>
  )
}
