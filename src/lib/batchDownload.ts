import type { WorkspaceItem } from '@/types/workspace'

export async function batchDownloadAll(items: WorkspaceItem[]): Promise<void> {
  const completedItems = items.filter(item => item.status === 'completed' && item.convertedBlobs)
  
  if (completedItems.length === 0) {
    throw new Error('沒有可下載的檔案')
  }

  for (const item of completedItems) {
    if (item.convertedBlobs) {
      const formats: Array<'png' | 'ico' | 'icns'> = ['png', 'ico', 'icns']
      
      for (const format of formats) {
        const blob = item.convertedBlobs[format]
        if (blob && item.convertedUrls?.[format]) {
          await new Promise(resolve => setTimeout(resolve, 100))
          
          const a = document.createElement('a')
          a.href = item.convertedUrls[format]
          a.download = `${item.name}.${format}`
          document.body.appendChild(a)
          a.click()
          document.body.removeChild(a)
        }
      }
    }
  }
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

  for (const item of completedItems) {
    const blob = item.convertedBlobs?.[format]
    const url = item.convertedUrls?.[format]
    
    if (blob && url) {
      await new Promise(resolve => setTimeout(resolve, 100))
      
      const a = document.createElement('a')
      a.href = url
      a.download = `${item.name}.${format}`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
    }
  }
}
