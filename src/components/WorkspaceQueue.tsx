import { AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { WorkspaceItem } from '@/types/workspace'
import { WorkspaceQueueItem } from '@/components/WorkspaceQueueItem'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Package } from '@phosphor-icons/react'

interface WorkspaceQueueProps {
  items: WorkspaceItem[]
  onPreview?: (item: WorkspaceItem) => void
  onDownload?: (item: WorkspaceItem, format: 'png' | 'ico' | 'icns') => void
  onReorder?: (reorderedItems: WorkspaceItem[]) => void
}

export function WorkspaceQueue({ items, onPreview, onDownload, onReorder }: WorkspaceQueueProps) {
  const [draggedItemId, setDraggedItemId] = useState<string | null>(null)
  const [dragOverItemId, setDragOverItemId] = useState<string | null>(null)

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

  const handleDragStart = (itemId: string) => {
    setDraggedItemId(itemId)
  }

  const handleDragEnd = () => {
    setDraggedItemId(null)
    setDragOverItemId(null)
  }

  const handleDragOver = (e: React.DragEvent, itemId: string) => {
    e.preventDefault()
    if (draggedItemId && draggedItemId !== itemId) {
      setDragOverItemId(itemId)
    }
  }

  const handleDrop = (e: React.DragEvent, targetItemId: string) => {
    e.preventDefault()
    
    if (!draggedItemId || draggedItemId === targetItemId || !onReorder) {
      setDraggedItemId(null)
      setDragOverItemId(null)
      return
    }

    const draggedIndex = items.findIndex(item => item.id === draggedItemId)
    const targetIndex = items.findIndex(item => item.id === targetItemId)

    if (draggedIndex === -1 || targetIndex === -1) {
      setDraggedItemId(null)
      setDragOverItemId(null)
      return
    }

    const newItems = [...items]
    const [draggedItem] = newItems.splice(draggedIndex, 1)
    newItems.splice(targetIndex, 0, draggedItem)

    onReorder(newItems)
    setDraggedItemId(null)
    setDragOverItemId(null)
  }

  return (
    <div className="space-y-4">
      {pendingItems.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold mb-3 text-muted-foreground">處理中 ({pendingItems.length})</h4>
          <ScrollArea className="max-h-[300px]">
            <div className="space-y-2 pr-4">
              <AnimatePresence mode="popLayout">
                {pendingItems.map((item) => (
                  <WorkspaceQueueItem
                    key={item.id}
                    item={item}
                    onPreview={onPreview}
                    onDownload={onDownload}
                    isDragging={draggedItemId === item.id}
                    isDragOver={dragOverItemId === item.id}
                    onDragStart={() => handleDragStart(item.id)}
                    onDragEnd={handleDragEnd}
                    onDragOver={(e) => handleDragOver(e, item.id)}
                    onDrop={(e) => handleDrop(e, item.id)}
                    enableReorder={onReorder !== undefined}
                  />
                ))}
              </AnimatePresence>
            </div>
          </ScrollArea>
        </div>
      )}

      {completedItems.length > 0 && (
        <>
          {pendingItems.length > 0 && <Separator className="my-6" />}
          <div>
            <h4 className="text-sm font-semibold mb-3 text-muted-foreground">已完成 ({completedItems.length})</h4>
            <ScrollArea className="max-h-[400px]">
              <div className="space-y-2 pr-4">
                <AnimatePresence mode="popLayout">
                  {completedItems.map((item) => (
                    <WorkspaceQueueItem
                      key={item.id}
                      item={item}
                      onPreview={onPreview}
                      onDownload={onDownload}
                      isDragging={draggedItemId === item.id}
                      isDragOver={dragOverItemId === item.id}
                      onDragStart={() => handleDragStart(item.id)}
                      onDragEnd={handleDragEnd}
                      onDragOver={(e) => handleDragOver(e, item.id)}
                      onDrop={(e) => handleDrop(e, item.id)}
                      enableReorder={onReorder !== undefined}
                    />
                  ))}
                </AnimatePresence>
              </div>
            </ScrollArea>
          </div>
        </>
      )}

      {errorItems.length > 0 && (
        <>
          {(pendingItems.length > 0 || completedItems.length > 0) && <Separator className="my-6" />}
          <div>
            <h4 className="text-sm font-semibold mb-3 text-destructive">錯誤 ({errorItems.length})</h4>
            <div className="space-y-2">
              <AnimatePresence mode="popLayout">
                {errorItems.map((item) => (
                  <WorkspaceQueueItem
                    key={item.id}
                    item={item}
                    onPreview={onPreview}
                    onDownload={onDownload}
                    isDragging={draggedItemId === item.id}
                    isDragOver={dragOverItemId === item.id}
                    onDragStart={() => handleDragStart(item.id)}
                    onDragEnd={handleDragEnd}
                    onDragOver={(e) => handleDragOver(e, item.id)}
                    onDrop={(e) => handleDrop(e, item.id)}
                    enableReorder={onReorder !== undefined}
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
