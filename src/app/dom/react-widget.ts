import { ReactElement } from 'react'
import { createRoot } from 'react-dom/client'

import { Widget } from './widgets'

export class ReactWidget implements Widget {
  public readonly name = 'react widget'
  public readonly node: HTMLElement

  constructor(content: ReactElement) {
    this.node = document.createElement('div')
    this.node.className = 'widget text-widget screen-center'
    const root = createRoot(this.node)
    root.render(content)
  }
}
