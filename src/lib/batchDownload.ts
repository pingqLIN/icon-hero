import JSZip from 'jszip'
import { WorkspaceItem } from '@/types/workspace'

export async function batchDownloadAll(items: WorkspaceItem[]): Promise<void> {
  const completedItems = items.filter(item => item.status === 'completed' && item.convertedBlobs)
  
  if (completedItems.length === 0) {
    throw new Error('沒有可下載的檔案')
  }

  const zip = new JSZip()
  
  for (const item of completedItems) {
    const folder = zip.folder(item.name) || zip
    
    if (item.convertedBlobs) {
      if (item.convertedBlobs.png) {
        folder.file(`${item.name}.png`, item.convertedBlobs.png)
      }
      if (item.convertedBlobs.ico) {
        folder.file(`${item.name}.ico`, item.convertedBlobs.ico)
      }
      if (item.convertedBlobs.icns) {
        folder.file(`${item.name}.icns`, item.convertedBlobs.icns)
      }
    }
  }

  const blob = await zip.generateAsync({ type: 'blob' })
  
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `icon-changer-export-${Date.now()}.zip`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export async function batchDownloadByFormat(
  items: WorkspaceItem[], 
  format: 'png' | 'ico' | 'icns'
): Promise<void> {
  const completedItems = items.filter(
    item => item.status === 'completed' && item.convertedBlobs?.[format]
  )
  
  if (completedItems.length === 0) {
    throw new Error(`沒有可下載的 ${format.toUpperCase()} 格式檔案`)
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
  a.download = `icon-changer-${format}-${Date.now()}.zip`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
