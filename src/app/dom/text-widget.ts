import { div, HtmlContent } from './dom-helper'
import { IWidget } from './widgets'

export class TextWidget implements IWidget {
  public readonly name = 'text widget'
  public readonly node: HTMLElement

  constructor(content: HtmlContent) {
    this.node = div(content, { class: 'widget text-widget screen-center' })
  }
}
