import { motion } from 'framer-motion'
import { Info, ArrowSquareOut } from '@phosphor-icons/react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { IconItem } from '@/types/icon'
import { ConversionDialog } from '@/components/ConversionDialog'
import { useState } from 'react'

interface IconCardProps {
  icon: IconItem
  onConvert: (newIcon: IconItem) => void
}

export function IconCard({ icon, onConvert }: IconCardProps) {
  const [isDragging, setIsDragging] = useState(false)

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    setIsDragging(true)
    
    const extension = icon.format.toLowerCase() === 'svg+xml' ? 'svg' : icon.format.toLowerCase()
    const filename = icon.name.includes('.') ? icon.name : `${icon.name}.${extension}`
    
    e.dataTransfer.effectAllowed = 'copy'
    e.dataTransfer.setData('DownloadURL', `image/${icon.format}:${filename}:${icon.url}`)
    
    try {
      e.dataTransfer.setData('text/uri-list', icon.url)
      e.dataTransfer.setData('text/plain', icon.url)
    } catch (err) {
      console.warn('Some drag data could not be set:', err)
    }
    
    const cleanup = () => {
      setIsDragging(false)
      document.removeEventListener('dragend', cleanup)
      document.removeEventListener('drop', cleanup)
      document.removeEventListener('mouseup', cleanup)
    }
    
    document.addEventListener('dragend', cleanup)
    document.addEventListener('drop', cleanup)
    document.addEventListener('mouseup', cleanup)
  }

  const handleDragEnd = () => {
    setIsDragging(false)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <Card
        className={`group relative overflow-hidden transition-all cursor-grab active:cursor-grabbing ${
          isDragging ? 'opacity-50' : 'opacity-100'
        }`}
        draggable={true}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="aspect-square relative bg-secondary/30 flex items-center justify-center p-8">
          <img
            src={icon.url}
            alt={icon.name}
            className="max-w-full max-h-full object-contain"
            draggable={false}
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute inset-0 pointer-events-none flex items-center justify-center bg-accent/10 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <div className="flex flex-col items-center gap-2">
              <ArrowSquareOut size={40} weight="bold" className="text-accent" />
              <span className="text-sm font-semibold text-accent">拖曳到系統</span>
            </div>
          </motion.div>
          
          <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <ConversionDialog icon={icon} onConvert={onConvert} />
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="icon"
                    variant="secondary"
                    className="h-8 w-8"
                    onClick={(e) => {
                      e.stopPropagation()
                    }}
                  >
                    <Info size={16} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <div className="text-xs space-y-1">
                    <p className="font-semibold">{icon.name}</p>
                    <p className="text-muted-foreground">格式: {icon.format.toUpperCase()}</p>
                    <p className="text-muted-foreground">
                      載入時間: {new Date(icon.uploadedAt).toLocaleString('zh-TW')}
                    </p>
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          <Badge variant="secondary" className="absolute bottom-3 left-3 text-xs px-2 py-1">
            {icon.format.toUpperCase()}
          </Badge>
        </div>

        <div className="p-4 bg-card border-t border-border">
          <p className="text-base font-medium truncate text-center">{icon.name}</p>
          <p className="text-xs text-muted-foreground text-center mt-1">
            點擊並拖曳圖示到系統檔案或資料夾
          </p>
        </div>
      </Card>
    </motion.div>
  )
}
