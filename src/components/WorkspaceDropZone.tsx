import { useState } from 'react'
import { motion } from 'framer-motion'
import { Folder } from '@phosphor-icons/react'
import { useTranslation } from 'react-i18next'
import { MascotDisplay } from './MascotDisplay'

interface WorkspaceDropZoneProps {
  onDrop: (items: (File | string)[]) => void
  isProcessing?: boolean
  mascotType?: 'bot' | 'hero' | 'abstract'
  hasCompletedItems?: boolean
  helpText?: string
}

export function WorkspaceDropZone({ onDrop, isProcessing, mascotType = 'bot', hasCompletedItems = false, helpText }: WorkspaceDropZoneProps) {
  const [isDragActive, setIsDragActive] = useState(false)
  const { t } = useTranslation()

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

    // 收集 URL（text/uri-list 優先，避免與 text/plain 重複）
    const urlSet = new Set<string>()

    if (e.dataTransfer.types.includes('text/uri-list')) {
      const uris = e.dataTransfer.getData('text/uri-list').split('\n')
      uris.forEach(uri => {
        const trimmed = uri.trim()
        if (trimmed && !trimmed.startsWith('#') && trimmed.startsWith('https://')) {
          urlSet.add(trimmed)
        }
      })
    }

    if (e.dataTransfer.types.includes('text/plain')) {
      const text = e.dataTransfer.getData('text/plain').trim()
      if (text && text.startsWith('https://')) {
        urlSet.add(text)
      }
    }

    urlSet.forEach(url => items.push(url))

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
    if (text && text.startsWith('https://')) {
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
      data-help={helpText}
    >
      <div className={`relative overflow-hidden rounded-sm border-[3px] border-dashed p-7 transition-all duration-300 sm:p-9 md:p-12 ${
        isDragActive
          ? 'border-black bg-transparent shadow-[0_0_0_4px_rgba(0,0,0,0.08)] dark:border-white/75 dark:bg-primary/10 dark:shadow-[0_0_30px_rgba(var(--primary),0.16)]'
          : 'border-black bg-transparent hover:bg-transparent dark:border-white/45 dark:bg-secondary/5 dark:hover:border-primary/60 dark:hover:bg-secondary/10 dark:hover:shadow-[0_0_30px_rgba(var(--primary),0.08)]'
      }`}>

        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 opacity-0 dark:opacity-[0.03]"
            style={{ backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
          </div>
          <div className="absolute left-4 right-4 top-4 h-px bg-black/20 dark:bg-white/20" />
          <div className="absolute bottom-4 left-4 right-4 h-px bg-black/12 dark:bg-white/12" />
          <div className="absolute bottom-4 left-4 top-4 w-px bg-black/12 dark:bg-white/12" />
          <div className="absolute bottom-4 right-4 top-4 w-px bg-black/12 dark:bg-white/12" />
          <div className="absolute inset-x-4 top-1/2 h-px border-t border-dashed border-black/10 dark:border-white/10" />
        </div>

        <div className="relative z-10 flex flex-col items-center justify-center gap-5 sm:gap-6">

          {!hasCompletedItems ? (
            <div className={`transition-transform duration-300 relative z-20 ${
              mascotType === 'hero'
                ? 'scale-[1.16] group-hover:scale-[1.22] sm:scale-[1.34] sm:group-hover:scale-[1.42]'
                : 'scale-110 group-hover:scale-[1.18] sm:scale-125 sm:group-hover:scale-[1.32]'
            }`}>
              <MascotDisplay
                type={mascotType}
                state={isProcessing ? 'processing' : isDragActive ? 'analyzing' : 'idle'}
              />
            </div>
          ) : (
            <div className="mb-2 flex h-16 w-16 items-center justify-center rounded-sm border border-border bg-muted shadow-sm transition-transform duration-300 group-hover:scale-105">
              <Folder
                size={32}
                weight="duotone"
                className={`transition-colors duration-300 ${isProcessing ? 'text-primary animate-pulse' : 'text-muted-foreground group-hover:text-primary'}`}
              />
            </div>
          )}

          <div className="text-center space-y-3">
            <h3 className="text-xl font-bold text-foreground sm:text-2xl">
              {isProcessing ? t('workspaceDropProcessing') : t('workspaceDropIdle')}
            </h3>
            <p className="text-base text-muted-foreground max-w-md mx-auto leading-relaxed">
              {t('workspaceDropSupportsPrefix')} <span className="text-primary font-medium">PNG, JPG, ICO, ICNS</span> {t('workspaceDropSupportsSuffix')}<br />
              {t('workspaceDropAutoStart')}
            </p>

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="mt-2 inline-flex items-center gap-2 rounded-sm border border-border bg-background px-3 py-1 text-xs text-muted-foreground shadow-sm"
            >
              <span className="flex h-4 w-4 items-center justify-center rounded-sm bg-muted text-[10px]">⌘</span>
              <span>+</span>
              <span className="flex h-4 w-4 items-center justify-center rounded-sm bg-muted text-[10px]">V</span>
              <span>{t('workspaceDropPasteHint')}</span>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
