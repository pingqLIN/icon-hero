import { motion } from 'framer-motion'
import { Trash, Info } from '@phosphor-icons/react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { IconItem } from '@/types/icon'
import { useState } from 'react'

interface IconCardProps {
  icon: IconItem
  dragEnabled: boolean
  onDelete: (id: string) => void
}

export function IconCard({ icon, dragEnabled, onDelete }: IconCardProps) {
  const [isDragging, setIsDragging] = useState(false)

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    if (!dragEnabled) {
      e.preventDefault()
      return
    }

    setIsDragging(true)
    
    fetch(icon.url)
      .then(res => res.blob())
      .then(blob => {
        const file = new File([blob], icon.name, { type: blob.type })
        e.dataTransfer.effectAllowed = 'copy'
        e.dataTransfer.setData('DownloadURL', `${blob.type}:${icon.name}:${icon.url}`)
      })
  }

  const handleDragEnd = () => {
    setIsDragging(false)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8 }}
      whileHover={dragEnabled ? { y: -4 } : {}}
      transition={{ duration: 0.2 }}
    >
      <Card
        className={`group relative overflow-hidden transition-all ${
          dragEnabled ? 'cursor-grab active:cursor-grabbing' : 'cursor-default'
        } ${isDragging ? 'opacity-50' : 'opacity-100'}`}
        draggable={dragEnabled}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="aspect-square relative bg-secondary/30 flex items-center justify-center p-4">
          <img
            src={icon.url}
            alt={icon.name}
            className="max-w-full max-h-full object-contain"
            draggable={false}
          />
          
          <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="icon"
                    variant="secondary"
                    className="h-7 w-7"
                    onClick={(e) => {
                      e.stopPropagation()
                    }}
                  >
                    <Info size={14} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <div className="text-xs space-y-1">
                    <p className="font-semibold">{icon.name}</p>
                    <p className="text-muted-foreground">Format: {icon.format}</p>
                    <p className="text-muted-foreground">
                      Added: {new Date(icon.uploadedAt).toLocaleDateString()}
                    </p>
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <Button
              size="icon"
              variant="destructive"
              className="h-7 w-7"
              onClick={(e) => {
                e.stopPropagation()
                onDelete(icon.id)
              }}
            >
              <Trash size={14} />
            </Button>
          </div>

          <Badge variant="secondary" className="absolute bottom-2 left-2 text-[10px] px-1.5 py-0.5">
            {icon.format.toUpperCase()}
          </Badge>
        </div>

        <div className="p-3 bg-card">
          <p className="text-sm font-medium truncate">{icon.name}</p>
        </div>
      </Card>
    </motion.div>
  )
}
