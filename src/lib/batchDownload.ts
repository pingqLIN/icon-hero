import JSZip from 'jszip'
import type { WorkspaceItem } from '@/types/workspace'

export async function batchDownloadAll(items: WorkspaceItem[]) {
  const completedItems = items.filter(item => item.status === 'completed')
  
  if (completedItems.length === 0) {
    return
  }

  const zip = new JSZip()

  for (const item of completedItems) {
    const folder = zip.folder(item.name) || zip
    
    const formats = ['png', 'ico', 'icns'] as const
    for (const format of formats) {
      const blob = item.convertedBlobs?.[format]
      if (blob) {
        folder.file(`${item.name}.${format}`, blob)
      }
    }
  }

  const blob = await zip.generateAsync({ type: 'blob' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'icons.zip'
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export async function batchDownloadByFormat(
  items: WorkspaceItem[],
  format: 'png' | 'ico' | 'icns'
) {
  const completedItems = items.filter(
    item => item.status === 'completed' && item.convertedBlobs?.[format]
  )
  
  if (completedItems.length === 0) {
    return
  }

  const zip = new JSZip()

  for (const item of completedItems) {
    const blob = item.convertedBlobs?.[format]
    if (blob) {
      zip.file(`${item.name}.${format}`, blob)
    }
  }

  const blob = await zip.generateAsync({ type: 'blob' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `icons-${format}.zip`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
