import JSZip from 'jszip'


  if (completedItems.length === 0) {
  }
  
  for (const item of completedItems)
    
   

      }

  for (const item of completedItems) {
    const folder = zip.folder(item.name) || zip
  a.
    const formats = ['png', 'ico', 'icns'] as const
    for (const format of formats) {
      const blob = item.convertedBlobs?.[format]
      if (blob) {
        folder.file(`${item.name}.${format}`, blob)
      }
    }
  f


    const blob = item.convertedBlobs?.[
      zip.file(`${item.name}.${format}`
  }
  const blob = await zip.g
  const a = document.createEle
  a.downloa
  a.click()
  URL.revokeObjectURL(url)
















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
