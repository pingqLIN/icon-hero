import { beforeEach, describe, expect, it, vi } from 'vitest'
import {
  IconConversionError,
  getIconConversionErrorMessage,
  resolveIconImageUrl,
} from './iconConverter'

const createResponse = (body: BodyInit, init?: ResponseInit) => new Response(body, init)

describe('resolveIconImageUrl', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn())
    vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:resolved-icon')
  })

  it('rejects http remote URLs with a classified HTTPS-only error', async () => {
    await expect(resolveIconImageUrl('http://example.com/icon.png')).rejects.toMatchObject({
      code: 'https_only',
    })
  })

  it('returns local or data URLs without remote fetch', async () => {
    await expect(resolveIconImageUrl('data:image/png;base64,abc')).resolves.toBe('data:image/png;base64,abc')
    expect(fetch).not.toHaveBeenCalled()
  })

  it('resolves direct remote image URLs to an object URL', async () => {
    vi.mocked(fetch).mockResolvedValueOnce(
      createResponse(new Blob(['png'], { type: 'image/png' }), {
        status: 200,
        headers: { 'content-type': 'image/png' },
      })
    )

    await expect(resolveIconImageUrl('https://example.com/icon.png')).resolves.toBe('blob:resolved-icon')
  })

  it('resolves icon metadata from HTML pages', async () => {
    vi.mocked(fetch)
      .mockResolvedValueOnce(
        createResponse('<html><head><meta property="og:image" content="/og.png"></head></html>', {
          status: 200,
          headers: { 'content-type': 'text/html' },
        })
      )
      .mockResolvedValueOnce(
        createResponse(new Blob(['png'], { type: 'image/png' }), {
          status: 200,
          headers: { 'content-type': 'image/png' },
        })
      )

    await expect(resolveIconImageUrl('https://example.com/page')).resolves.toBe('blob:resolved-icon')
    expect(fetch).toHaveBeenLastCalledWith('https://example.com/og.png', expect.any(Object))
  })

  it('classifies unsupported non-image non-html content', async () => {
    vi.mocked(fetch).mockResolvedValueOnce(
      createResponse(new Blob(['{}'], { type: 'application/json' }), {
        status: 200,
        headers: { 'content-type': 'application/json' },
      })
    )

    await expect(resolveIconImageUrl('https://example.com/data')).rejects.toMatchObject({
      code: 'unsupported_content_type',
    })
  })

  it('classifies oversized remote content from content-length', async () => {
    vi.mocked(fetch).mockResolvedValueOnce(
      createResponse('', {
        status: 200,
        headers: {
          'content-length': String(11 * 1024 * 1024),
          'content-type': 'image/png',
        },
      })
    )

    await expect(resolveIconImageUrl('https://example.com/large.png')).rejects.toMatchObject({
      code: 'too_large',
    })
  })

  it('classifies HTML pages with no discoverable icon', async () => {
    vi.mocked(fetch)
      .mockResolvedValueOnce(
        createResponse('<html><head></head><body>No icon here</body></html>', {
          status: 200,
          headers: { 'content-type': 'text/html' },
        })
      )
      .mockResolvedValueOnce(createResponse('', { status: 404 }))

    await expect(resolveIconImageUrl('https://example.com/page')).rejects.toMatchObject({
      code: 'icon_not_found',
    })
  })
})

describe('getIconConversionErrorMessage', () => {
  it('maps classified errors to localized messages', () => {
    const messages = {
      https_only: 'HTTPS only',
      network: 'Network failed',
      too_large: 'Too large',
      unsupported_content_type: 'Unsupported content',
      html_too_large: 'HTML too large',
      icon_not_found: 'No icon',
      icon_not_image: 'Not image',
      image_load_failed: 'Image failed',
      canvas_unavailable: 'No canvas',
      canvas_export_failed: 'Export failed',
      unsupported_format: 'Bad format',
      unknown: 'Unknown',
    }

    expect(
      getIconConversionErrorMessage(
        new IconConversionError('icon_not_found', 'Could not find icon'),
        messages
      )
    ).toBe('No icon')
    expect(getIconConversionErrorMessage(new Error('plain'), messages)).toBe('Unknown')
  })
})
