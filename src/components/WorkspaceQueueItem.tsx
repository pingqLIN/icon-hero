import { motion } from 'framer-motion'
import { 
  CheckCircle, 
  Warning, 
  CircleNotch, 
  Eye, 
  ArrowsDownUp,
  Image as ImageIcon,
  Link as LinkIcon,
  Download
} from '@phosphor-icons/react'
import { WorkspaceItem } from '@/types/workspace'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

interface WorkspaceQueueItemProps {
  item: WorkspaceItem
  onPreview?: (item: WorkspaceItem) => void
  onDownload?: (item: WorkspaceItem) => void
}

export function WorkspaceQueueItem({ item, onPreview, onDownload }: WorkspaceQueueItemProps) {
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

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    if (item.status !== 'completed' || !item.convertedUrl) {
      e.preventDefault()
      return
    }
    
    const extension = item.convertedFormat?.toLowerCase() || 'png'
    const filename = `${item.name}.${extension}`
    
    e.dataTransfer.effectAllowed = 'copy'
    e.dataTransfer.setData('DownloadURL', `image/${item.convertedFormat}:${filename}:${item.convertedUrl}`)
    
    try {
      e.dataTransfer.setData('text/uri-list', item.convertedUrl)
      e.dataTransfer.setData('text/plain', item.convertedUrl)
    } catch (err) {
      console.warn('Some drag data could not be set:', err)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      layout
    >
      <Card 
        className={`p-4 transition-all ${
          item.status === 'completed' 
            ? 'cursor-grab active:cursor-grabbing hover:shadow-md border-green-500/20 bg-green-500/5' 
            : 'cursor-default'
        }`}
        draggable={item.status === 'completed'}
        onDragStart={handleDragStart}
      >
        <div className="flex items-center gap-4">
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
              
              {item.convertedFormat && item.status === 'completed' && (
                <Badge variant="default" className="text-[10px] px-1.5 py-0">
                  轉換為: {item.convertedFormat.toUpperCase()}
                </Badge>
              )}
            </div>

            {item.error && (
              <p className="text-xs text-destructive mt-1">{item.error}</p>
            )}
          </div>

          {item.status === 'completed' && item.convertedUrl && (
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

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8"
                      onClick={() => onDownload?.(item)}
                    >
                      <Download size={16} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>下載</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  )
}
