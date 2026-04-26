import { cleanup, fireEvent, render } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { WorkspaceDropZone } from './WorkspaceDropZone'

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}))

vi.mock('./MascotDisplay', () => ({
  MascotDisplay: () => <div data-testid="mascot" />,
}))

const renderDropZone = (onDrop = vi.fn()) => {
  const { container } = render(<WorkspaceDropZone onDrop={onDrop} />)
  const dropZone = container.querySelector('[tabindex="0"]')

  if (!(dropZone instanceof HTMLElement)) {
    throw new Error('drop zone was not rendered')
  }

  return { dropZone, onDrop }
}

describe('WorkspaceDropZone', () => {
  afterEach(() => {
    cleanup()
  })

  it('drops local files into the workspace intake', () => {
    const { dropZone, onDrop } = renderDropZone()
    const file = new File(['icon'], 'icon.png', { type: 'image/png' })

    fireEvent.drop(dropZone, {
      dataTransfer: {
        files: [file],
        types: [],
        getData: vi.fn(),
      },
    })

    expect(onDrop).toHaveBeenCalledWith([file])
  })

  it('deduplicates HTTPS URLs from uri-list and plain text drops', () => {
    const { dropZone, onDrop } = renderDropZone()
    const url = 'https://example.com/icon.png'

    fireEvent.drop(dropZone, {
      dataTransfer: {
        files: [],
        types: ['text/uri-list', 'text/plain'],
        getData: (type: string) => {
          if (type === 'text/uri-list') {
            return `# ignored comment\n${url}\n`
          }

          return url
        },
      },
    })

    expect(onDrop).toHaveBeenCalledWith([url])
  })

  it('pastes files and HTTPS URLs into one intake batch', () => {
    const { dropZone, onDrop } = renderDropZone()
    const file = new File(['icon'], 'icon.svg', { type: 'image/svg+xml' })
    const url = 'https://example.com/favicon.svg'

    fireEvent.paste(dropZone, {
      clipboardData: {
        files: [file],
        getData: () => url,
      },
    })

    expect(onDrop).toHaveBeenCalledWith([file, url])
  })

  it('ignores insecure pasted URLs without blocking normal typing', () => {
    const { dropZone, onDrop } = renderDropZone()

    fireEvent.paste(dropZone, {
      clipboardData: {
        files: [],
        getData: () => 'http://example.com/favicon.ico',
      },
    })

    expect(onDrop).not.toHaveBeenCalled()
  })
})
