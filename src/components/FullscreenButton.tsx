import { ButtonHTMLAttributes, useEffect, useState } from 'react'

interface FullscreenProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  normalText: string
  fsText: string
}

export function FullscreenButton({ normalText, fsText, ...rest }: FullscreenProps) {
  if (!supportsFullscreen(document.documentElement) || usesWholeScreen()) {
    return <></>
  }

  const [fs, setFs] = useState(isFullscreen)

  useEffect(() => {
    function fsListener() {
      setFs(isFullscreen())
    }
    document.addEventListener('fullscreenchange', fsListener)

    return () => {
      document.removeEventListener('fullscreenchange', fsListener)
    }
  }, [])

  return (
    <button
      {...rest}
      onClick={() => {
        setFs((previous) => {
          if (previous) enterFullscreen(document.documentElement)
          else exitFullscreen()
          return !previous
        })
      }}
    >
      {fs ? fsText : normalText}
    </button>
  )
}

function isFullscreen(): boolean {
  return document.fullscreenElement != null
}

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

export function exitFullscreen() {
  document.exitFullscreen().then()
}

export function supportsFullscreen(elem: HTMLElement): boolean {
  return (
    (elem.requestFullscreen ||
      (elem as any).mozRequestFullScreen ||
      (elem as any).webkitRequestFullscreen ||
      (elem as any).msRequestFullscreen) != null
  )
}

export function usesWholeScreen() {
  return (
    document.fullscreenElement == null &&
    window.innerWidth === window.screen.width &&
    window.innerHeight === window.screen.height
  )
}
