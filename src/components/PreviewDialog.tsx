import { motion, AnimatePresence } from 'framer-motion'
import { X } from '@phosphor-icons/react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { WorkspaceItem } from '@/types/workspace'
import { Badge } from '@/components/ui/badge'

interface PreviewDialogProps {
  item: WorkspaceItem | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function PreviewDialog({ item, open, onOpenChange }: PreviewDialogProps) {
  if (!item) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>預覽: {item.name}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="flex items-center gap-2 flex-wrap">
            {item.format && (
              <Badge variant="secondary" className="text-xs">
                原始格式: {item.format.toUpperCase()}
              </Badge>
            )}
            {item.convertedFormat && (
              <Badge variant="default" className="text-xs">
                轉換格式: {item.convertedFormat.toUpperCase()}
              </Badge>
            )}
          </div>

          <div className="relative rounded-xl border-2 border-border bg-secondary/20 p-8">
            <AnimatePresence mode="wait">
              {item.convertedUrl && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="flex items-center justify-center"
                >
                  <img
                    src={item.convertedUrl}
                    alt={item.name}
                    className="max-w-full max-h-[400px] object-contain"
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="text-sm text-muted-foreground space-y-1">
            <p>類型: {item.type === 'image' ? '圖檔' : item.type === 'url' ? 'URL' : '未知'}</p>
            <p>狀態: {item.status === 'completed' ? '已完成' : item.status}</p>
            {item.completedAt && (
              <p>完成時間: {new Date(item.completedAt).toLocaleString('zh-TW')}</p>
            )}
          </div>

          <div className="flex justify-end">
            <Button onClick={() => onOpenChange(false)} variant="outline" className="gap-2">
              <X size={16} />
              關閉
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
