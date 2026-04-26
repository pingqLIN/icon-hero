import { useEffect, useRef, useState } from 'react'

interface HelpState {
  text: string
  x: number
  y: number
}

const HOVER_DELAY_MS = 1500
const CURSOR_OFFSET = 16

function getFallbackText(element: HTMLElement): string | null {
  const label = element.getAttribute('aria-label')?.trim()
  if (label) {
    return label
  }

  const title = element.getAttribute('title')?.trim()
  if (title) {
    return title
  }

  if (element.matches('button, a, input, [role="button"], [role="menuitem"]')) {
    const text = element.innerText?.trim().replace(/\s+/g, ' ')
    return text || null
  }

  return null
}

function getHelpText(target: EventTarget | null): string | null {
  if (!(target instanceof Element)) {
    return null
  }

  const helpElement = target.closest<HTMLElement>('[data-help]')
  if (helpElement?.dataset.help?.trim()) {
    return helpElement.dataset.help.trim()
  }

  const interactiveElement = target.closest<HTMLElement>('button, a, input, [role="button"], [role="menuitem"]')
  return interactiveElement ? getFallbackText(interactiveElement) : null
}

export function InteractionHelp() {
  const timerRef = useRef<number | null>(null)
  const latestHelpRef = useRef<HelpState | null>(null)
  const [help, setHelp] = useState<HelpState | null>(null)

  useEffect(() => {
    const clearTimer = () => {
      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current)
        timerRef.current = null
      }
    }

    const hideHelp = () => {
      clearTimer()
      latestHelpRef.current = null
      setHelp(null)
    }

    const scheduleHelp = (event: PointerEvent) => {
      const text = getHelpText(event.target)
      if (!text) {
        hideHelp()
        return
      }

      clearTimer()
      const nextHelp = {
        text,
        x: event.clientX,
        y: event.clientY,
      }
      latestHelpRef.current = nextHelp

      timerRef.current = window.setTimeout(() => {
        setHelp(latestHelpRef.current)
      }, HOVER_DELAY_MS)
    }

    const moveHelp = (event: PointerEvent) => {
      if (!latestHelpRef.current) {
        return
      }

      const text = getHelpText(event.target) ?? latestHelpRef.current.text
      const nextHelp = {
        text,
        x: event.clientX,
        y: event.clientY,
      }
      latestHelpRef.current = nextHelp
      setHelp(current => current ? nextHelp : current)
    }

    document.addEventListener('pointerover', scheduleHelp, true)
    document.addEventListener('pointermove', moveHelp, true)
    document.addEventListener('pointerout', hideHelp, true)
    document.addEventListener('pointerdown', hideHelp, true)
    window.addEventListener('blur', hideHelp)

    return () => {
      document.removeEventListener('pointerover', scheduleHelp, true)
      document.removeEventListener('pointermove', moveHelp, true)
      document.removeEventListener('pointerout', hideHelp, true)
      document.removeEventListener('pointerdown', hideHelp, true)
      window.removeEventListener('blur', hideHelp)
      clearTimer()
    }
  }, [])

  if (!help) {
    return null
  }

  return (
    <div
      className="pointer-events-none fixed z-[10000] max-w-[260px] rounded-md border border-foreground/15 bg-popover px-3 py-2 text-xs font-medium text-popover-foreground shadow-lg"
      style={{
        left: help.x + CURSOR_OFFSET,
        top: help.y + CURSOR_OFFSET,
      }}
      role="tooltip"
    >
      {help.text}
    </div>
  )
}
