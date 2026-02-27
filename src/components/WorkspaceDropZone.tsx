import { useState } from 'react'
import { motion } from 'framer-motion'
import { Folder } from '@phosphor-icons/react'
import { MascotDisplay } from './MascotDisplay'

interface WorkspaceDropZoneProps {
  onDrop: (items: (File | string)[]) => void
  isProcessing?: boolean
  mascotType?: 'bot' | 'hero' | 'abstract'
  hasCompletedItems?: boolean
}

export function WorkspaceDropZone({ onDrop, isProcessing, mascotType = 'bot', hasCompletedItems = false }: WorkspaceDropZoneProps) {
  const [isDragActive, setIsDragActive] = useState(false)

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    if (!isDragActive) setIsDragActive(true)
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragActive(false)
  }

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragActive(false)

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
      className="relative group"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onPaste={handlePaste}
      tabIndex={0}
    >
      <div className={`relative border-2 border-dashed rounded-2xl p-12 transition-all duration-300 overflow-hidden ${
        isDragActive 
          ? 'border-primary bg-primary/10 shadow-[0_0_30px_rgba(var(--primary),0.2)]' 
          : 'border-border bg-secondary/5 hover:border-primary/50 hover:bg-secondary/10 hover:shadow-[0_0_30px_rgba(var(--primary),0.1)]'
      }`}>

        {/* Background Grid Pattern */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
        </div>

        <div className="flex flex-col items-center justify-center gap-6 relative z-10">

          {/* MASCOT DISPLAY vs FOLDER ICON */}
          {/* If NO completed items, show Mascot in DropZone. If completed, show simple Folder (Mascot moves to Instructions) */}
          {!hasCompletedItems ? (
            <div className="scale-125 transition-transform duration-300 group-hover:scale-[1.35]">
              <MascotDisplay
                type={mascotType}
                state={isProcessing ? 'processing' : isDragActive ? 'analyzing' : 'idle'}
              />
            </div>
          ) : (
            <div className="w-16 h-16 bg-muted rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-sm border border-border">
              <Folder
                size={32}
                weight="duotone"
                className={`transition-colors duration-300 ${isProcessing ? 'text-primary animate-pulse' : 'text-muted-foreground group-hover:text-primary'}`}
              />
            </div>
          )}

          <div className="text-center space-y-3">
            <h3 className="text-2xl font-bold bg-gradient-to-br from-foreground to-muted-foreground bg-clip-text text-transparent">
              {isProcessing ? '正在處理您的圖示...' : '拖曳檔案或連結到此處'}
            </h3>
            <p className="text-base text-muted-foreground max-w-md mx-auto leading-relaxed">
              支援 <span className="text-primary font-medium">PNG, JPG, ICO, ICNS</span> 和網站 URL<br />
              系統將自動啟動轉換引擎
            </p>

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 px-3 py-1 bg-background border border-border rounded-full text-xs text-muted-foreground shadow-sm mt-2"
            >
              <span className="w-4 h-4 flex items-center justify-center bg-muted rounded text-[10px]">⌘</span>
              <span>+</span>
              <span className="w-4 h-4 flex items-center justify-center bg-muted rounded text-[10px]">V</span>
              <span>貼上也可以</span>
            </motion.div>
          </div>
        </div>

        {/* Corner Decoration */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          className="absolute -top-10 -right-10 w-32 h-32 bg-primary/5 rounded-full blur-2xl pointer-events-none"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-10 -left-10 w-32 h-32 bg-secondary/5 rounded-full blur-2xl pointer-events-none"
        />
      </div>
    </motion.div>
  )
}
