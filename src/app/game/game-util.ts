import { div, frag, span } from '../dom/dom-helper'
import { fullscreenButton } from '../util/fullscreen'
import { GameConfig } from './levels'

const fsButton = fullscreenButton('⛶', '⛶', 'heading-fs-button white-bg')

export function gameHeader(num: number, config: GameConfig, movesElem: HTMLElement) {
  return div(frag(
    span(`Level ${num + 1}`, { class: 'lvl' }),
    movesElem,
    fsButton,
  ), { class: 'game-header' })
}
