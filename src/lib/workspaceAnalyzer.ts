import { WorkspaceItem, ItemType } from '@/types/workspace'

export async function analyzeDroppedItem(file: File | string): Promise<{ type: ItemType; url: string; name: string; format?: string }> {
  if (typeof file === 'string') {
    if (file.startsWith('http://') || file.startsWith('https://')) {
      try {
        const response = await fetch(file, { method: 'HEAD' })
        const contentType = response.headers.get('content-type')
        
        if (contentType && contentType.startsWith('image/')) {
          const format = contentType.split('/')[1]
          const name = file.split('/').pop() || 'url-image'
          return {
            type: 'image',
            url: file,
            name: name.replace(/\.[^/.]+$/, ''),
            format
          }
        } else {
          return {
            type: 'url',
            url: file,
            name: new URL(file).hostname
          }
        }
      } catch {
        return {
          type: 'url',
          url: file,
          name: new URL(file).hostname
        }
      }
    }
    return {
      type: 'unknown',
      url: file,
      name: 'unknown'
    }
  } else {
    if (file.type.startsWith('image/')) {
      const url = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = (e) => resolve(e.target?.result as string)
        reader.onerror = reject
        reader.readAsDataURL(file)
      })
      
      return {
        type: 'image',
        url,
        name: file.name.replace(/\.[^/.]+$/, ''),
        format: file.type.split('/')[1]
      }
    }
    
    return {
      type: 'unknown',
      url: '',
      name: file.name
    }
  }
}

export function determineConversionStrategy(item: WorkspaceItem): 'png' | 'ico' | 'icns' | null {
  if (item.type === 'url') {
    return 'png'
  }
  
  if (item.type === 'image') {
    const format = item.format?.toLowerCase()
    
    if (format === 'png') {
      return 'ico'
    }
    if (format === 'ico' || format === 'x-icon') {
      return 'png'
    }
    if (format === 'icns') {
      return 'png'
    }
    
    return 'png'
  }
  
  return null
}
