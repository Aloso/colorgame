import { button } from '../dom/dom-helper'

export function enterFullscreen(elem: HTMLElement | any) {
  if (elem.requestFullscreen) {
    elem.requestFullscreen().then()
  } else if (elem.mozRequestFullScreen) { /* Firefox */
    elem.mozRequestFullScreen()
  } else if (elem.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
    elem.webkitRequestFullscreen()
  } else if (elem.msRequestFullscreen) { /* IE/Edge */
    elem.msRequestFullscreen()
  }
}

export function supportsFullscreen(elem: HTMLElement | any): boolean {
  return (elem.requestFullscreen ||
    elem.mozRequestFullScreen ||
    elem.webkitRequestFullscreen ||
    elem.msRequestFullscreen) != null
}

export function exitFullscreen() {
  document.exitFullscreen().then()
}

const enterListeners: Array<() => void> = []
const exitListeners: Array<() => void> = []

document.addEventListener('fullscreenchange', () => {
  const listeners = document.fullscreenElement == null ? exitListeners : enterListeners
  listeners.forEach(l => l())
})

export function onFullscreenEntered(f: () => void) {
  enterListeners.push(f)
}

export function onFullscreenExited(f: () => void) {
  exitListeners.push(f)
}

export function fullscreenButton(normalText: string, fsText: string, clazz: string): HTMLButtonElement | null {
  if (!supportsFullscreen(document.documentElement)) return null

  let fs = document.fullscreenElement != null

  const btn = button(fs ? fsText : normalText, { class: clazz }, () => {
    fs = !fs
    if (fs) enterFullscreen(document.documentElement)
    else exitFullscreen()
  })

  onFullscreenEntered(() => btn.innerHTML = fsText)
  onFullscreenExited(() => btn.innerHTML = normalText)

  return btn
}
