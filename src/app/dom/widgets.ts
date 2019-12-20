import { byId, div, HtmlContent } from './dom-helper'

export interface IWidget {
  readonly name: string
  readonly node: HTMLElement

  onShow?(): void
  onHide?(): void
}

export interface IOverlay extends IWidget {
  isOverlay: true
}

export function isOverlay(widget: IWidget): widget is IOverlay {
  return 'isOverlay' in widget
}


let visibleWidgets: IWidget[] = []

const container = byId('app', HTMLElement)
const overlays = byId('overlays', HTMLElement)

export function showWidget(widget: IWidget) {
  visibleWidgets.forEach(v => v.onHide?.())

  container.innerHTML = ''
  overlays.innerHTML = ''
  container.append(widget.node)

  visibleWidgets = [widget]
  widget.onShow?.()
}

export function blurToWidget(widget: IWidget) {
  visibleWidgets.forEach(w => {
    w.node.classList.add('blurring-out')
  })
  setTimeout(() => {
    visibleWidgets.forEach(w => w.onHide?.())
    overlays.innerHTML = ''

    container.innerHTML = ''
    widget.node.style.opacity = '0'
    container.append(widget.node)
    widget.onShow?.()
    setTimeout(() => {
      widget.node.style.opacity = ''
    }, 10)
  }, 300)
}

export function overlayWidget(widget: IWidget) {
  visibleWidgets.push(widget)

  const overlay = document.createElement('div')
  overlay.className = 'overlay'
  overlay.append(widget.node)
  overlays.append(overlay)
}

export function closeOverlay(overlay: IOverlay) {
  const idx = visibleWidgets.indexOf(overlay)
  if (idx >= 0) {
    const oldWidgets = visibleWidgets
    visibleWidgets = visibleWidgets.slice(0, idx)

    for (let i = idx; i < oldWidgets.length; i++) {
      oldWidgets[i].onHide?.()
    }
  }
}
