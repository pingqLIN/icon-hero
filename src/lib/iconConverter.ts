export type IconFormat = 'png' | 'ico' | 'icns'

export interface ConversionResult {
  url: string
  format: IconFormat
  blob: Blob
}

const FETCH_TIMEOUT_MS = 10_000
const MAX_HTML_BYTES = 512 * 1024
const MAX_IMAGE_BYTES = 10 * 1024 * 1024

async function isRemoteUrl(url: string): Promise<boolean> {
  try {
    const parsedUrl = new URL(url)
    return parsedUrl.protocol === 'https:'
  } catch {
    return false
  }
}

function createTimeoutSignal(timeoutMs: number): AbortSignal {
  const controller = new AbortController()
  window.setTimeout(() => controller.abort(), timeoutMs)
  return controller.signal
}

function ensureSafeRemoteUrl(url: string, baseUrl?: string): string {
  const parsedUrl = baseUrl ? new URL(url, baseUrl) : new URL(url)

  if (parsedUrl.protocol !== 'https:') {
    throw new Error('Only HTTPS URLs are supported for remote icons')
  }

  return parsedUrl.toString()
}

async function fetchBlobWithLimit(url: string, maxBytes: number): Promise<{ blob: Blob; contentType: string }> {
  const response = await fetch(url, {
    redirect: 'follow',
    signal: createTimeoutSignal(FETCH_TIMEOUT_MS),
  })

  if (!response.ok) {
    throw new Error(`Network error: ${response.status} ${response.statusText}`)
  }

  const contentLength = response.headers.get('content-length')
  if (contentLength && Number(contentLength) > maxBytes) {
    throw new Error(`Remote file is too large (>${maxBytes} bytes)`)
  }

  const blob = await response.blob()
  if (blob.size > maxBytes) {
    throw new Error(`Remote file is too large (>${maxBytes} bytes)`)
  }

  return {
    blob,
    contentType: response.headers.get('content-type')?.toLowerCase() ?? blob.type.toLowerCase(),
  }
}

async function parseImageFromUrl(url: string): Promise<string> {
  if (!await isRemoteUrl(url)) {
    return url
  }

  try {
    const safeUrl = ensureSafeRemoteUrl(url)
    const { blob, contentType } = await fetchBlobWithLimit(safeUrl, MAX_IMAGE_BYTES)
    
    if (contentType.startsWith('image/')) {
      return URL.createObjectURL(blob)
    }

    if (contentType && !contentType.includes('text/html') && !contentType.includes('application/xhtml+xml')) {
      throw new Error(`Unsupported content type: ${contentType}`)
    }

    if (blob.size > MAX_HTML_BYTES) {
      throw new Error(`Remote HTML is too large (>${MAX_HTML_BYTES} bytes)`)
    }
    
    const html = await blob.text()
    const parser = new DOMParser()
    const doc = parser.parseFromString(html, 'text/html')
    
    const possibleSelectors = [
      'link[rel="icon"]',
      'link[rel="shortcut icon"]',
      'link[rel="apple-touch-icon"]',
      'meta[property="og:image"]',
      'meta[name="twitter:image"]',
      'link[rel="apple-touch-icon-precomposed"]',
    ]
    
    for (const selector of possibleSelectors) {
      const element = doc.querySelector(selector)
      if (element) {
        const iconUrl = element.getAttribute('href') || element.getAttribute('content')
        if (iconUrl) {
          const safeIconUrl = ensureSafeRemoteUrl(iconUrl, safeUrl)
          const { blob: iconBlob, contentType: iconContentType } = await fetchBlobWithLimit(
            safeIconUrl,
            MAX_IMAGE_BYTES
          )

          if (!iconContentType.startsWith('image/')) {
            throw new Error(`Icon URL did not return an image: ${iconContentType}`)
          }

          return URL.createObjectURL(iconBlob)
        }
      }
    }
    
    const defaultFaviconUrl = ensureSafeRemoteUrl('/favicon.ico', safeUrl)
    try {
      const { blob: faviconBlob, contentType: faviconContentType } = await fetchBlobWithLimit(
        defaultFaviconUrl,
        MAX_IMAGE_BYTES
      )
      if (!faviconContentType.startsWith('image/')) {
        throw new Error(`Favicon URL did not return an image: ${faviconContentType}`)
      }

      return URL.createObjectURL(faviconBlob)
    } catch {
      // Fall through to the main error below when no supported icon can be resolved.
    }
    
    throw new Error('Could not find a supported icon at the provided URL')
  } catch (error) {
    throw new Error(`Failed to parse remote URL: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

async function loadImage(url: string): Promise<HTMLImageElement> {
  const imageUrl = await parseImageFromUrl(url)
  
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = reject
    img.crossOrigin = 'anonymous'
    img.src = imageUrl
  })
}

function createCanvas(width: number, height: number): { canvas: HTMLCanvasElement; ctx: CanvasRenderingContext2D } {
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Could not get canvas context')
  return { canvas, ctx }
}

async function imageToPNG(imageUrl: string, size: number = 512): Promise<ConversionResult> {
  const img = await loadImage(imageUrl)
  const { canvas, ctx } = createCanvas(size, size)
  
  ctx.imageSmoothingEnabled = true
  ctx.imageSmoothingQuality = 'high'
  ctx.drawImage(img, 0, 0, size, size)
  
  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((b) => {
      if (b) resolve(b)
      else reject(new Error('Failed to create PNG blob'))
    }, 'image/png')
  })
  
  return {
    url: URL.createObjectURL(blob),
    format: 'png',
    blob
  }
}

async function imageToICO(imageUrl: string): Promise<ConversionResult> {
  const sizes = [16, 32, 48, 256]
  const images = await Promise.all(
    sizes.map(async (size) => {
      const img = await loadImage(imageUrl)
      const { canvas, ctx } = createCanvas(size, size)
      
      ctx.imageSmoothingEnabled = true
      ctx.imageSmoothingQuality = 'high'
      ctx.drawImage(img, 0, 0, size, size)
      
      return canvas
    })
  )
  
  const icoData = createICOFile(images)
  const blob = new Blob([icoData], { type: 'image/x-icon' })
  
  return {
    url: URL.createObjectURL(blob),
    format: 'ico',
    blob
  }
}

function createICOFile(canvases: HTMLCanvasElement[]): ArrayBuffer {
  const images = canvases.map(canvas => {
    const ctx = canvas.getContext('2d')!
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    return {
      width: canvas.width,
      height: canvas.height,
      data: imageData.data
    }
  })
  
  const headerSize = 6
  const dirEntrySize = 16
  const totalDirSize = headerSize + (images.length * dirEntrySize)
  
  let totalSize = totalDirSize
  const imageSizes: number[] = []
  
  images.forEach(img => {
    const bitmapInfoHeaderSize = 40
    const imageDataSize = img.width * img.height * 4
    const size = bitmapInfoHeaderSize + imageDataSize
    imageSizes.push(size)
    totalSize += size
  })
  
  const buffer = new ArrayBuffer(totalSize)
  const view = new DataView(buffer)
  const uint8 = new Uint8Array(buffer)
  
  let offset = 0
  
  view.setUint16(offset, 0, true); offset += 2
  view.setUint16(offset, 1, true); offset += 2
  view.setUint16(offset, images.length, true); offset += 2
  
  let imageOffset = totalDirSize
  images.forEach((img, i) => {
    view.setUint8(offset, img.width === 256 ? 0 : img.width); offset += 1
    view.setUint8(offset, img.height === 256 ? 0 : img.height); offset += 1
    view.setUint8(offset, 0); offset += 1
    view.setUint8(offset, 0); offset += 1
    view.setUint16(offset, 1, true); offset += 2
    view.setUint16(offset, 32, true); offset += 2
    view.setUint32(offset, imageSizes[i], true); offset += 4
    view.setUint32(offset, imageOffset, true); offset += 4
    imageOffset += imageSizes[i]
  })
  
  images.forEach(img => {
    view.setUint32(offset, 40, true); offset += 4
    view.setInt32(offset, img.width, true); offset += 4
    view.setInt32(offset, img.height * 2, true); offset += 4
    view.setUint16(offset, 1, true); offset += 2
    view.setUint16(offset, 32, true); offset += 2
    view.setUint32(offset, 0, true); offset += 4
    view.setUint32(offset, img.width * img.height * 4, true); offset += 4
    view.setInt32(offset, 0, true); offset += 4
    view.setInt32(offset, 0, true); offset += 4
    view.setUint32(offset, 0, true); offset += 4
    view.setUint32(offset, 0, true); offset += 4
    
    for (let y = img.height - 1; y >= 0; y--) {
      for (let x = 0; x < img.width; x++) {
        const i = (y * img.width + x) * 4
        uint8[offset++] = img.data[i + 2]
        uint8[offset++] = img.data[i + 1]
        uint8[offset++] = img.data[i + 0]
        uint8[offset++] = img.data[i + 3]
      }
    }
  })
  
  return buffer
}

async function imageToICNS(imageUrl: string): Promise<ConversionResult> {
  const sizes = [
    { size: 16, type: 'icp4' },
    { size: 32, type: 'icp5' },
    { size: 64, type: 'icp6' },
    { size: 128, type: 'ic07' },
    { size: 256, type: 'ic08' },
    { size: 512, type: 'ic09' },
    { size: 1024, type: 'ic10' }
  ]
  
  const images = await Promise.all(
    sizes.map(async ({ size }) => {
      const img = await loadImage(imageUrl)
      const { canvas, ctx } = createCanvas(size, size)
      
      ctx.imageSmoothingEnabled = true
      ctx.imageSmoothingQuality = 'high'
      ctx.drawImage(img, 0, 0, size, size)
      
      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob((b) => {
          if (b) resolve(b)
          else reject(new Error('Failed to create blob'))
        }, 'image/png')
      })
      
      return {
        type: sizes.find(s => s.size === size)!.type,
        data: new Uint8Array(await blob.arrayBuffer())
      }
    })
  )
  
  const icnsData = createICNSFile(images)
  const blob = new Blob([icnsData], { type: 'image/icns' })
  
  return {
    url: URL.createObjectURL(blob),
    format: 'icns',
    blob
  }
}

function createICNSFile(images: { type: string; data: Uint8Array }[]): ArrayBuffer {
  const headerSize = 8
  let totalSize = headerSize
  
  images.forEach(img => {
    totalSize += 8 + img.data.length
  })
  
  const buffer = new ArrayBuffer(totalSize)
  const view = new DataView(buffer)
  const uint8 = new Uint8Array(buffer)
  
  let offset = 0
  
  uint8[offset++] = 'i'.charCodeAt(0)
  uint8[offset++] = 'c'.charCodeAt(0)
  uint8[offset++] = 'n'.charCodeAt(0)
  uint8[offset++] = 's'.charCodeAt(0)
  view.setUint32(offset, totalSize, false); offset += 4
  
  images.forEach(img => {
    for (let i = 0; i < 4; i++) {
      uint8[offset++] = img.type.charCodeAt(i)
    }
    view.setUint32(offset, 8 + img.data.length, false); offset += 4
    uint8.set(img.data, offset)
    offset += img.data.length
  })
  
  return buffer
}

export async function convertIcon(imageUrl: string, targetFormat: IconFormat): Promise<ConversionResult> {
  switch (targetFormat) {
    case 'png':
      return imageToPNG(imageUrl)
    case 'ico':
      return imageToICO(imageUrl)
    case 'icns':
      return imageToICNS(imageUrl)
    default:
      throw new Error(`Unsupported format: ${targetFormat}`)
  }
}

export function downloadConvertedIcon(result: ConversionResult, originalName: string) {
  const a = document.createElement('a')
  a.href = result.url
  a.download = `${originalName}.${result.format}`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
}
