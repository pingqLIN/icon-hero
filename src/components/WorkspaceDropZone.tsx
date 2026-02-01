import { motion } from 'framer-motion'
import { UploadSimple, Files } from '@phosphor-icons/react'

interface WorkspaceDropZoneProps {
  onDrop: (items: (File | string)[]) => void
  isProcessing?: boolean
}

export function WorkspaceDropZone({ onDrop, isProcessing }: WorkspaceDropZoneProps) {
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()

    const items: (File | string)[] = []

    if (e.dataTransfer.files.length > 0) {
      Array.from(e.dataTransfer.files).forEach(file => {
        items.push(file)
      })
    }

    if (e.dataTransfer.types.includes('text/plain')) {
      const text = e.dataTransfer.getData('text/plain')
      if (text && (text.startsWith('http://') || text.startsWith('https://'))) {
        items.push(text)
      }
    }

    if (e.dataTransfer.types.includes('text/uri-list')) {
      const uris = e.dataTransfer.getData('text/uri-list').split('\n')
      uris.forEach(uri => {
        const trimmed = uri.trim()
        if (trimmed && (trimmed.startsWith('http://') || trimmed.startsWith('https://'))) {
          items.push(trimmed)
        }
      })
    }

    if (items.length > 0) {
      onDrop(items)
    }
  }

  const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    const items: (File | string)[] = []
    
    if (e.clipboardData.files.length > 0) {
      Array.from(e.clipboardData.files).forEach(file => {
        items.push(file)
      })
    }
    
    const text = e.clipboardData.getData('text')
    if (text && (text.startsWith('http://') || text.startsWith('https://'))) {
      items.push(text)
    }
    
    if (items.length > 0) {
      e.preventDefault()
      onDrop(items)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onPaste={handlePaste}
      tabIndex={0}
    >
      <div className="border-2 border-dashed border-border rounded-2xl bg-secondary/20 p-12 transition-all hover:border-primary/50 hover:bg-secondary/30">
        <div className="flex flex-col items-center justify-center gap-4">
          <div className="relative">
            <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center">
              <Files size={40} className="text-primary" weight="duotone" />
            </div>
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-2 -right-2"
            >
              <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center">
                <UploadSimple size={20} weight="bold" className="text-accent-foreground" />
              </div>
            </motion.div>
          </div>
          
          <div className="text-center space-y-2">
            <h3 className="text-xl font-bold">拖曳檔案或連結到此處</h3>
            <p className="text-sm text-muted-foreground max-w-md">
              支援圖檔 (PNG, JPG, ICO, ICNS) 和網站 URL，系統將自動分析並執行轉換
            </p>
            <p className="text-xs text-muted-foreground">
              也可以使用 Ctrl+V / Cmd+V 貼上
            </p>
          </div>

          {isProcessing && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-sm text-primary font-medium"
            >
              處理中...
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  )
}
