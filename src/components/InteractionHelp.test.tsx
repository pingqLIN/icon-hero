import { act, cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { InteractionHelp } from './InteractionHelp'

describe('InteractionHelp', () => {
  afterEach(() => {
    cleanup()
    vi.useRealTimers()
  })

  it('shows data-help text after a 1.5 second pointer hover', () => {
    vi.useFakeTimers()
    render(
      <>
        <InteractionHelp />
        <button data-help="Upload a local image">Upload</button>
      </>
    )

    fireEvent.pointerOver(screen.getByRole('button', { name: 'Upload' }), {
      clientX: 12,
      clientY: 24,
    })

    act(() => {
      vi.advanceTimersByTime(1499)
    })
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument()

    act(() => {
      vi.advanceTimersByTime(1)
    })
    expect(screen.getByRole('tooltip')).toHaveTextContent('Upload a local image')
  })

  it('falls back to aria-label and hides on pointer out', () => {
    vi.useFakeTimers()
    render(
      <>
        <InteractionHelp />
        <button aria-label="Switch language" />
      </>
    )

    const button = screen.getByRole('button', { name: 'Switch language' })
    fireEvent.pointerOver(button, { clientX: 12, clientY: 24 })
    act(() => {
      vi.advanceTimersByTime(1500)
    })
    expect(screen.getByRole('tooltip')).toHaveTextContent('Switch language')

    fireEvent.pointerOut(button)
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument()
  })
})
