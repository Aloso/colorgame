import { button } from '../dom/dom-helper'

export function enterFullscreen(elem: HTMLElement) {
  if (elem.requestFullscreen) {
    elem.requestFullscreen().then()
  } else if ((elem as any).mozRequestFullScreen) {
    // Firefox
    ;(elem as any).mozRequestFullScreen()
  } else if ((elem as any).webkitRequestFullscreen) {
    // Chrome, Safari and Opera
    ;(elem as any).webkitRequestFullscreen()
  } else if ((elem as any).msRequestFullscreen) {
    // IE/Edge
    ;(elem as any).msRequestFullscreen()
  }
}

export function supportsFullscreen(elem: HTMLElement): boolean {
  return (
    (elem.requestFullscreen ||
      (elem as any).mozRequestFullScreen ||
      (elem as any).webkitRequestFullscreen ||
      (elem as any).msRequestFullscreen) != null
  )
}

export function exitFullscreen() {
  document.exitFullscreen().then()
}

const enterListeners: Array<() => void> = []
const exitListeners: Array<() => void> = []

document.addEventListener('fullscreenchange', () => {
  const listeners = document.fullscreenElement == null ? exitListeners : enterListeners
  listeners.forEach((l) => l())
})

export function onFullscreenEntered(f: () => void) {
  enterListeners.push(f)
}

export function onFullscreenExited(f: () => void) {
  exitListeners.push(f)
}

export function usesWholeScreen() {
  return (
    document.fullscreenElement == null &&
    window.innerWidth === window.screen.width &&
    window.innerHeight === window.screen.height
  )
}

export function fullscreenButton(
  normalText: string,
  fsText: string,
  clazz: string,
): HTMLButtonElement | null {
  if (!supportsFullscreen(document.documentElement) || usesWholeScreen()) return null

  let fs = document.fullscreenElement != null

  const btn = button(fs ? fsText : normalText, { class: clazz }, () => {
    fs = !fs
    if (fs) enterFullscreen(document.documentElement)
    else exitFullscreen()
  })

  onFullscreenEntered(() => (btn.innerHTML = fsText))
  onFullscreenExited(() => (btn.innerHTML = normalText))

  return btn
}
