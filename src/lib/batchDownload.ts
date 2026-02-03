import JSZip from 'jszip'
import type { WorkspaceItem } from '@/types/workspace'

  if (completedItems.length === 0) {
  }
  
  if (completedItems.length === 0) {
    throw new Error('沒有可下載的檔案')
   
  
          folder.file(`${
  
  }
  const blob = await zip.generateAsync({ type: 'blo
  const url = URL.createObjectURL(blob)
  a.
  document.body.a
  document.body.removeChild(a)
}
export async functi
  format: 'png' | 'ico' | 'icns'
  const c
  )
  if 
  }

  for (const item of completedItems) {
  
    }

  
  const a = document.createElement('a')
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
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
  a.download = `icons-${format}-${Date.now()}.zip`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
