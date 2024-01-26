import { ReactElement } from 'react'
import { byId } from './dom-helper'
import { ReactWidget } from './react-widget'

export interface Widget {
  readonly name: string
  readonly node: HTMLElement

  onShow?(): void
  onHide?(): void
}

export interface Overlay extends Widget {
  isOverlay: true
}

let visibleWidgets: Widget[] = []

const container = byId('app', HTMLElement)
const overlays = byId('overlays', HTMLElement)

export function showWidget(widget: Widget) {
  visibleWidgets.forEach((v) => v.onHide?.())

  container.innerHTML = ''
  overlays.innerHTML = ''
  container.append(widget.node)

  visibleWidgets = [widget]
  widget.onShow?.()
}

export function blurToWidget(widget: Widget) {
  visibleWidgets.forEach((w) => {
    w.node.classList.add('blurring-out')
  })
  setTimeout(() => {
    visibleWidgets.forEach((w) => w.onHide?.())
    overlays.innerHTML = ''

    container.innerHTML = ''
    widget.node.style.opacity = '0'
    container.append(widget.node)
    widget.onShow?.()
    setTimeout(() => {
      widget.node.style.opacity = ''
    }, 15)
  }, 300)
}

export function overlayWidget(widget: Widget) {
  visibleWidgets.push(widget)

  const overlay = document.createElement('div')
  overlay.className = 'overlay'
  overlay.append(widget.node)
  overlays.append(overlay)
}

export function closeOverlay(overlay: Overlay) {
  const idx = visibleWidgets.indexOf(overlay)
  if (idx >= 0) {
    const oldWidgets = visibleWidgets
    visibleWidgets = visibleWidgets.slice(0, idx)

    for (let i = idx; i < oldWidgets.length; i++) {
      oldWidgets[i].onHide?.()
    }
  }
}

export function showReactWidget(elem: ReactElement) {
  showWidget(new ReactWidget(elem))
}

export function blurToReactWidget(elem: ReactElement) {
  blurToWidget(new ReactWidget(elem))
}

export function overlayReactWidget(elem: ReactElement) {
  overlayWidget(new ReactWidget(elem))
}
