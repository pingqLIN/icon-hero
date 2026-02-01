export type IconFormat = 'png' | 'ico' | 'icns'

export interface ConversionResult {
  url: string
  format: IconFormat
  blob: Blob
}

async function isRemoteUrl(url: string): Promise<boolean> {
  return url.startsWith('http://') || url.startsWith('https://')
}

async function parseImageFromUrl(url: string): Promise<string> {
  if (!await isRemoteUrl(url)) {
    return url
  }

  try {
    const response = await fetch(url)
    const contentType = response.headers.get('content-type')
    
    if (contentType && contentType.startsWith('image/')) {
      const blob = await response.blob()
      return URL.createObjectURL(blob)
    }
    
    const html = await response.text()
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
        let iconUrl = element.getAttribute('href') || element.getAttribute('content')
        if (iconUrl) {
          if (iconUrl.startsWith('//')) {
            iconUrl = 'https:' + iconUrl
          } else if (iconUrl.startsWith('/')) {
            const urlObj = new URL(url)
            iconUrl = urlObj.origin + iconUrl
          } else if (!iconUrl.startsWith('http')) {
            const urlObj = new URL(url)
            iconUrl = urlObj.origin + '/' + iconUrl
          }
          
          const iconResponse = await fetch(iconUrl)
          const iconBlob = await iconResponse.blob()
          return URL.createObjectURL(iconBlob)
        }
      }
    }
    
    const defaultFaviconUrl = new URL('/favicon.ico', url).href
    const faviconResponse = await fetch(defaultFaviconUrl)
    if (faviconResponse.ok) {
      const faviconBlob = await faviconResponse.blob()
      return URL.createObjectURL(faviconBlob)
    }
    
    throw new Error('無法從 URL 中找到圖示')
  } catch (error) {
    throw new Error(`解析 URL 失敗: ${error instanceof Error ? error.message : '未知錯誤'}`)
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
