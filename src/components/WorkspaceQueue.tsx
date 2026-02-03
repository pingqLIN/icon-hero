import { AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { WorkspaceItem } from '@/types/workspace'
import { WorkspaceQueueItem } from '@/components/WorkspaceQueueItem'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { Package, DownloadSimple, FileZip, Trash } from '@phosphor-icons/react'
import { downloadAllAsZip, downloadByFormat } from '@/lib/batchDownload'
import { toast } from 'sonner'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'

interface WorkspaceQueueProps {
  items: WorkspaceItem[]
  onPreview?: (item: WorkspaceItem) => void
  onDownload?: (item: WorkspaceItem, format: 'png' | 'ico' | 'icns') => void
  onReorder?: (reorderedItems: WorkspaceItem[]) => void
  onClearCompleted?: () => void
}

export function WorkspaceQueue({ items, onPreview, onDownload, onReorder, onClearCompleted }: WorkspaceQueueProps) {
  const [draggedItemId, setDraggedItemId] = useState<string | null>(null)
  const [dragOverItemId, setDragOverItemId] = useState<string | null>(null)
  const [isDownloading, setIsDownloading] = useState(false)

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4">
        <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
          <Package size={32} className="text-muted-foreground" />
        </div>
        <p className="text-sm text-muted-foreground">尚無處理項目</p>
      </div>
    )
  }

  const pendingItems = items.filter(item => item.status === 'pending' || item.status === 'analyzing' || item.status === 'converting')
  const completedItems = items.filter(item => item.status === 'completed')
  const errorItems = items.filter(item => item.status === 'error')

  const handleBatchDownload = async (format?: 'png' | 'ico' | 'icns') => {
    try {
      setIsDownloading(true)
      if (format) {
        await downloadByFormat(completedItems, format)
        toast.success('批次下載完成', {
          description: `已下載所有 ${format.toUpperCase()} 格式檔案`
        })
      } else {
        await downloadAllAsZip(completedItems)
        toast.success('批次下載完成', {
          description: '已下載所有轉換檔案'
        })
      }
    } catch (error) {
      toast.error('下載失敗', {
        description: error instanceof Error ? error.message : '批次下載時發生錯誤'
      })
      setIsDown
  }
  con
   

      document.removeEventListener('dragend', c
      document.removeEventLi
    
    document.addEventListen
    document.addEventListene
  }
  const handleDragEnd = () => {
    setDragOverItemId(null)

    e.preventDefault()
     
  }
  const handleDrop = (e: React.DragEvent, targetI
    
      setDraggedItemId(null)
      return


    if (draggedIndex === -1 || 
      setDragOverItemId(nu
    }
   

    onReorder(newItems)
    setDragOverItemId(

    if (onClearCompleted) {
     
   

  return (
      {completedItems.
    
            size="sm" 
            onClick={handleC
            <Trash size={16} 
          </
     

                className="gap-2"
              >

            </DropdownMenuTrigger>
              <DropdownMenuI
                下載全部格式
            
     

                <DownloadSimple
              </DropdownMenuItem>
                <DownloadSimple size={16} classN

          </DropdownMen
      )}
      {pendingItems.length 
   

                {pendingItems.map((ite
                    key={it
                    onPr
                    isDragging={
                    onDragStart={() => handleDragStart(ite
        
     
   

        </

        <>
          <div>
            <Scrol
                <AnimatePresen
                    <W
                      item={i
                      onDownload={onDownlo
           
                      onDragEnd
                 
                   
                </Animat
            </ScrollArea>
        </>

        <>
          <div>
            <div className="space-y-2">
               
                    key={item.id}
                    
                    isD
                    onDragStart={(
                    onDragOver={(e) => handle
                    enableReorder={onReorder !== undefined}
                ))}
            </div>
        </>
    </div>
}







































































































