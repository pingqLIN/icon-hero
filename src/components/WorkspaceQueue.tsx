import { AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { WorkspaceItem } from '@/types/workspace'
import { WorkspaceQueueItem } from '@/components/WorkspaceQueueItem'
import { MascotDisplay } from '@/components/MascotDisplay'
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
  onAutomation?: (item: WorkspaceItem) => void
  onApplyIcon?: (item: WorkspaceItem) => void
  onReorder?: (reorderedItems: WorkspaceItem[]) => void
  onClearCompleted?: () => void
  onFileDragStart?: (fileName: string) => void
  onFileDragEnd?: () => void
  mascotType?: 'bot' | 'hero' | 'abstract'
}

export function WorkspaceQueue({
  items,
  onPreview,
  onDownload,
  onAutomation,
  onApplyIcon,
  onReorder,
  onClearCompleted,
  onFileDragStart,
  onFileDragEnd,
  mascotType = 'bot'
}: WorkspaceQueueProps) {
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
    } finally {
      setIsDownloading(false)
    }
  }

  const handleDragStart = (item: WorkspaceItem) => {
    setDraggedItemId(item.id)
  }

  const handleDragEnd = () => {
    setDraggedItemId(null)
    setDragOverItemId(null)
  }

  const handleDragOver = (e: React.DragEvent, targetItemId: string) => {
    e.preventDefault()
    if (draggedItemId && draggedItemId !== targetItemId) {
      setDragOverItemId(targetItemId)
    }
  }

  const handleDrop = (e: React.DragEvent, targetItemId: string) => {
    e.preventDefault()
    
    if (!draggedItemId || !onReorder) {
      setDraggedItemId(null)
      setDragOverItemId(null)
      return
    }

    const draggedIndex = completedItems.findIndex(item => item.id === draggedItemId)
    const targetIndex = completedItems.findIndex(item => item.id === targetItemId)

    if (draggedIndex === -1 || targetIndex === -1) {
      setDraggedItemId(null)
      setDragOverItemId(null)
      return
    }

    const newCompletedItems = [...completedItems]
    const [draggedItem] = newCompletedItems.splice(draggedIndex, 1)
    newCompletedItems.splice(targetIndex, 0, draggedItem)

    const newItems = [
      ...pendingItems,
      ...newCompletedItems,
      ...errorItems
    ]

    onReorder(newItems)
    setDraggedItemId(null)
    setDragOverItemId(null)
  }

  const handleClearCompleted = () => {
    if (onClearCompleted) {
      onClearCompleted()
    }
  }

  return (
    <div className="space-y-6">
      {completedItems.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleClearCompleted}
            className="gap-2"
          >
            <Trash size={16} />
            清除已完成
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="default" 
                size="sm"
                disabled={isDownloading || completedItems.length === 0}
                className="gap-2"
              >
                <FileZip size={16} />
                批次下載
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => handleBatchDownload()}>
                <FileZip size={16} className="mr-2" />
                下載全部格式
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleBatchDownload('png')}>
                <DownloadSimple size={16} className="mr-2" />
                下載所有 PNG
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleBatchDownload('ico')}>
                <DownloadSimple size={16} className="mr-2" />
                下載所有 ICO
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleBatchDownload('icns')}>
                <DownloadSimple size={16} className="mr-2" />
                下載所有 ICNS
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}

      {pendingItems.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold mb-3 text-muted-foreground">處理中</h3>
          <div className="space-y-2">
            <AnimatePresence>
              {pendingItems.map((item) => (
                <WorkspaceQueueItem
                  key={item.id}
                  item={item}
                  onPreview={onPreview}
                  onDownload={onDownload}
                  onAutomation={onAutomation}
                  onApplyIcon={onApplyIcon}
                  isDragging={false}
                  isDragOver={false}
                  enableReorder={false}
                  onFileDragStart={onFileDragStart}
                  onFileDragEnd={onFileDragEnd}
                />
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}

      {(pendingItems.length > 0 && completedItems.length > 0) && <Separator />}

      {completedItems.length > 0 && (
        <div className="relative">
          {/* 吉祥物 - 向下看，遮罩穿透效果 */}
          {/* Tool Hero (hero) → PNG 按鍵上方左側，放大110%，向上移動30px */}
          {/* Tech-Bot (bot) → ICO 按鍵上方，向上移動13px */}
          <div className={`absolute z-20 pointer-events-none ${
            mascotType === 'hero'
              ? 'right-[210px] -top-[70px]'  // PNG 按鍵上方，向上移動30px (原-40px → -70px)
              : 'right-[110px] -top-[53px]'  // ICO 按鍵上方，向上移動13px (原-40px → -53px)
          }`}>
            <MascotDisplay
              type={mascotType}
              state="success"
              variant="lookDown"
              className={`drop-shadow-2xl w-32 h-32 ${
                mascotType === 'hero' ? 'scale-110' : ''
              }`}
            />
          </div>

          <div className="overflow-hidden rounded-xl border border-primary/20 p-4">
            <div className="flex items-center gap-3 mb-3">
              {/* 顯示第一個完成項目的縮圖 */}
              {completedItems[0]?.convertedUrls?.png && (
                <div className="relative w-8 h-8 rounded-lg overflow-hidden border border-primary/30 bg-background/50 flex-shrink-0">
                  <img
                    src={completedItems[0].convertedUrls.png}
                    alt="completed icon"
                    className="w-full h-full object-contain"
                  />
                </div>
              )}
              <h3 className="text-sm font-semibold text-muted-foreground">已完成</h3>
            </div>
            <ScrollArea className="h-auto max-h-[600px]">
              <div className="space-y-2 pr-4">
                <AnimatePresence>
                  {completedItems.map((item) => (
                    <WorkspaceQueueItem
                      key={item.id}
                      item={item}
                      onPreview={onPreview}
                      onDownload={onDownload}
                      onAutomation={onAutomation}
                      onApplyIcon={onApplyIcon}
                      isDragging={draggedItemId === item.id}
                      isDragOver={dragOverItemId === item.id}
                      onDragStart={() => handleDragStart(item)}
                      onDragEnd={handleDragEnd}
                      onDragOver={(e) => handleDragOver(e, item.id)}
                      onDrop={(e) => handleDrop(e, item.id)}
                      enableReorder={onReorder !== undefined}
                      onFileDragStart={onFileDragStart}
                      onFileDragEnd={onFileDragEnd}
                    />
                  ))}
                </AnimatePresence>
              </div>
            </ScrollArea>
          </div>
        </div>
      )}

      {errorItems.length > 0 && (
        <>
          {(pendingItems.length > 0 || completedItems.length > 0) && <Separator />}
          <div>
            <h3 className="text-sm font-semibold mb-3 text-destructive">發生錯誤</h3>
            <div className="space-y-2">
              <AnimatePresence>
                {errorItems.map((item) => (
                  <WorkspaceQueueItem
                    key={item.id}
                    item={item}
                    onPreview={onPreview}
                    onDownload={onDownload}
                    onAutomation={onAutomation}
                  onApplyIcon={onApplyIcon}
                    isDragging={false}
                    isDragOver={false}
                    enableReorder={false}
                    onFileDragStart={onFileDragStart}
                    onFileDragEnd={onFileDragEnd}
                  />
                ))}
              </AnimatePresence>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
