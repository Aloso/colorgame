import { GameConfig } from './levels'
import { EventEmitter } from '../util/event-emitter'
import { Widget } from '../dom/widgets'
import { div } from '../dom/dom-helper'
import { gameHeader } from './game-util'

export interface FloodGameConfig extends GameConfig {
  type: 'flood-game',
  colors: string[],
}

export class FloodGameWidget implements Widget {
  readonly name = 'game widget'
  readonly node: HTMLElement

  readonly victory = new EventEmitter<number>()

  constructor(num: number, config: FloodGameConfig) {
    const moves = 0
    const movesElem = div('', { class: 'moves' })

    const fields: HTMLDivElement[] = []

    this.node = div([
      gameHeader(num, config, movesElem),
      div(fields),
    ], { class: 'widget game-widget' })
  }
}
