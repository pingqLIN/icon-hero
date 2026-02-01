import { motion } from 'framer-motion'
import { 
  CheckCircle, 
  Warning, 
  CircleNotch, 
  Eye, 
  ArrowsDownUp,
  Image as ImageIcon,
  Link as LinkIcon,
  Download,
  DotsSixVertical,
  HandGrabbing
} from '@phosphor-icons/react'
import { WorkspaceItem } from '@/types/workspace'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'

interface WorkspaceQueueItemProps {
  item: WorkspaceItem
  onPreview?: (item: WorkspaceItem) => void
  onDownload?: (item: WorkspaceItem, format: 'png' | 'ico' | 'icns') => void
  isDragging?: boolean
  isDragOver?: boolean
  onDragStart?: () => void
  onDragEnd?: () => void
  onDragOver?: (e: React.DragEvent) => void
  onDrop?: (e: React.DragEvent) => void
  enableReorder?: boolean
}

export function WorkspaceQueueItem({ 
  item, 
  onPreview, 
  onDownload,
  isDragging = false,
  isDragOver = false,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDrop,
  enableReorder = false
}: WorkspaceQueueItemProps) {
  const getStatusIcon = () => {
    switch (item.status) {
      case 'pending':
        return <CircleNotch size={20} className="text-muted-foreground animate-spin" />
      case 'analyzing':
        return <CircleNotch size={20} className="text-accent animate-spin" weight="bold" />
      case 'converting':
        return <ArrowsDownUp size={20} className="text-primary animate-pulse" weight="bold" />
      case 'completed':
        return <CheckCircle size={20} className="text-green-500" weight="fill" />
      case 'error':
        return <Warning size={20} className="text-destructive" weight="fill" />
    }
  }

  const getStatusText = () => {
    switch (item.status) {
      case 'pending':
        return '等待中'
      case 'analyzing':
        return '分析中'
      case 'converting':
        return `轉換為 ${item.convertedFormat?.toUpperCase()}`
      case 'completed':
        return '完成'
      case 'error':
        return '失敗'
    }
  }

  const getTypeIcon = () => {
    switch (item.type) {
      case 'image':
        return <ImageIcon size={16} className="text-primary" weight="fill" />
      case 'url':
        return <LinkIcon size={16} className="text-accent" weight="bold" />
      default:
        return <Warning size={16} className="text-muted-foreground" />
    }
  }

  const handleDragStart = async (e: React.DragEvent<HTMLDivElement>, format: 'png' | 'ico' | 'icns') => {
    if (item.status !== 'completed') {
      e.preventDefault()
      return
    }

    const url = item.convertedUrls?.[format]
    const blob = item.convertedBlobs?.[format]
    
    if (!url || !blob) {
      e.preventDefault()
      return
    }
    
    const filename = `${item.name}.${format}`
    
    e.dataTransfer.effectAllowed = 'copy'
    
    const mimeType = format === 'ico' ? 'image/x-icon' : 
                    format === 'icns' ? 'image/icns' : 
                    'image/png'
    
    e.dataTransfer.setData('DownloadURL', `${mimeType}:${filename}:${url}`)
    
    try {
      e.dataTransfer.setData('text/uri-list', url)
      e.dataTransfer.setData('text/plain', url)
      
      if ('items' in e.dataTransfer) {
        const file = new File([blob], filename, { type: mimeType })
        e.dataTransfer.items.add(file)
      }
    } catch (err) {
      console.warn('Some drag data could not be set:', err)
    }
    
    const dragImage = document.createElement('div')
    dragImage.style.cssText = `
      position: absolute;
      top: -1000px;
      left: -1000px;
      background: oklch(1 0 0);
      border: 2px solid oklch(0.35 0.15 290);
      border-radius: 0.5rem;
      padding: 0.75rem 1rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-family: 'Space Grotesk', system-ui, sans-serif;
      font-size: 0.875rem;
      font-weight: 600;
      color: oklch(0.25 0.02 290);
      box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1);
      pointer-events: none;
      z-index: 10000;
    `
    dragImage.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 256 256" fill="currentColor" style="flex-shrink: 0;">
        <path d="M213.66,82.34l-56-56A8,8,0,0,0,152,24H56A16,16,0,0,0,40,40V216a16,16,0,0,0,16,16H200a16,16,0,0,0,16-16V88A8,8,0,0,0,213.66,82.34ZM160,51.31,188.69,80H160ZM200,216H56V40h88V88a8,8,0,0,0,8,8h48V216Z"></path>
      </svg>
      <span>${filename}</span>
    `
    document.body.appendChild(dragImage)
    e.dataTransfer.setDragImage(dragImage, 0, 0)
    
    setTimeout(() => {
      if (document.body.contains(dragImage)) {
        document.body.removeChild(dragImage)
      }
    }, 0)
    
    const target = e.currentTarget as HTMLElement
    target.style.pointerEvents = 'auto'
    
    const cleanup = () => {
      target.style.pointerEvents = ''
      document.removeEventListener('dragend', cleanup)
      document.removeEventListener('drop', cleanup) 
      document.removeEventListener('mouseup', cleanup)
      window.removeEventListener('blur', cleanup)
    }
    
    document.addEventListener('dragend', cleanup)
    document.addEventListener('drop', cleanup)
    document.addEventListener('mouseup', cleanup)
    window.addEventListener('blur', cleanup)
  }

  const handleReorderDragStart = (e: React.DragEvent) => {
    e.stopPropagation()
    onDragStart?.()
  }

  return (
    <div
      draggable={enableReorder}
      onDragStart={handleReorderDragStart}
      onDragEnd={onDragEnd}
      onDragOver={onDragOver}
      onDrop={onDrop}
      className={cn(
        "transition-all",
        isDragging && "opacity-50",
        isDragOver && "scale-105"
      )}
    >
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 20 }}
        layout
      >
        <Card className={cn(
          "p-4 transition-all",
          enableReorder && "cursor-grab active:cursor-grabbing",
          isDragOver && "ring-2 ring-primary"
        )}>
          <div className="flex items-center gap-4">
            {enableReorder && (
              <div className="flex-shrink-0 cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground transition-colors">
                <DotsSixVertical size={20} weight="bold" />
              </div>
            )}
            
            <div className="flex-shrink-0">
              {getStatusIcon()}
            </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              {getTypeIcon()}
              <p className="text-sm font-semibold truncate">{item.name}</p>
            </div>
            
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                {getStatusText()}
              </Badge>
              
              {item.format && (
                <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                  原始: {item.format.toUpperCase()}
                </Badge>
              )}
              
              {item.convertedFormat && item.status === 'converting' && (
                <Badge variant="default" className="text-[10px] px-1.5 py-0 animate-pulse">
                  處理中: {item.convertedFormat.toUpperCase()}
                </Badge>
              )}
            </div>

            {item.error && (
              <p className="text-xs text-destructive mt-1">{item.error}</p>
            )}
          </div>

          {item.status === 'completed' && item.convertedUrls && (
            <div className="flex items-center gap-2 flex-shrink-0">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8"
                      onClick={() => onPreview?.(item)}
                    >
                      <Eye size={16} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>預覽</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              {(['png', 'ico', 'icns'] as const).map((format) => {
                const hasFormat = item.convertedUrls?.[format]
                if (!hasFormat) return null
                
                return (
                  <TooltipProvider key={format}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div
                          draggable={true}
                          onDragStart={(e) => handleDragStart(e, format)}
                          className="relative group"
                        >
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 px-2 gap-1.5 cursor-grab active:cursor-grabbing transition-all hover:border-primary hover:bg-primary/5"
                            onClick={() => onDownload?.(item, format)}
                          >
                            <HandGrabbing size={14} weight="fill" className="opacity-0 group-hover:opacity-100 transition-opacity absolute -left-1 -top-1 text-primary" />
                            <Download size={14} />
                            <span className="text-xs font-semibold">{format.toUpperCase()}</span>
                          </Button>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent side="bottom">
                        <p className="font-semibold">拖曳至系統檔案/資料夾替換圖示</p>
                        <p className="text-xs text-muted-foreground">或點擊下載 {format.toUpperCase()} 檔案</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )
              })}
            </div>
          )}
        </div>
      </Card>
      </motion.div>
    </div>
  )
}
