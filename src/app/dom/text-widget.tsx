import { div, HtmlContent } from './dom-helper'
import { Widget } from './widgets'

export class TextWidget implements Widget {
  public readonly name = 'text widget'
  public readonly node: HTMLElement

  constructor(content: HtmlContent) {
    this.node = div(content, { class: 'widget text-widget screen-center' })
  }
}
