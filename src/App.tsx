import { useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { UploadSimple, Link as LinkIcon } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Toaster } from '@/components/ui/sonner'
import { WorkspaceDropZone } from '@/components/WorkspaceDropZone'
import { WorkspaceQueue } from '@/components/WorkspaceQueue'
import { PreviewDialog } from '@/components/PreviewDialog'
import { WorkspaceItem } from '@/types/workspace'
import { analyzeDroppedItem } from '@/lib/workspaceAnalyzer'
import { convertIcon } from '@/lib/iconConverter'
import { toast } from 'sonner'

function App() {
  const [isProcessing, setIsProcessing] = useState(false)
  const [urlInput, setUrlInput] = useState('')
  const [showUrlInput, setShowUrlInput] = useState(false)
  const [workspaceItems, setWorkspaceItems] = useState<WorkspaceItem[]>([])
  const [previewItem, setPreviewItem] = useState<WorkspaceItem | null>(null)
  const [showPreview, setShowPreview] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  const handleUrlSubmit = async () => {
    const trimmedUrl = urlInput.trim()
    
    if (!trimmedUrl) {
      toast.error('請輸入有效的 URL')
      return
    }

    if (!trimmedUrl.startsWith('http://') && !trimmedUrl.startsWith('https://')) {
      toast.error('請輸入有效的 URL', {
        description: 'URL 必須以 http:// 或 https:// 開頭'
      })
      return
    }

    setUrlInput('')
    setShowUrlInput(false)
    await handleWorkspaceDrop([trimmedUrl])
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    const fileArray = Array.from(files)
    await handleWorkspaceDrop(fileArray)

    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleWorkspaceDrop = useCallback(async (items: (File | string)[]) => {
    const newItems: WorkspaceItem[] = items.map((item, index) => ({
      id: `${Date.now()}-${index}-${Math.random().toString(36).substr(2, 9)}`,
      name: typeof item === 'string' ? new URL(item).hostname : item.name,
      type: 'unknown',
      originalUrl: typeof item === 'string' ? item : '',
      status: 'pending',
      addedAt: Date.now()
    }))

    setWorkspaceItems(prev => [...prev, ...newItems])

    for (let i = 0; i < items.length; i++) {
      const item = items[i]
      const workspaceItem = newItems[i]

      try {
        setWorkspaceItems(prev => prev.map(wi =>
          wi.id === workspaceItem.id ? { ...wi, status: 'analyzing' } : wi
        ))

        const analyzed = await analyzeDroppedItem(item)

        setWorkspaceItems(prev => prev.map(wi =>
          wi.id === workspaceItem.id
            ? { ...wi, name: analyzed.name, type: analyzed.type, originalUrl: analyzed.url, format: analyzed.format }
            : wi
        ))

        const formats = ['png', 'ico', 'icns'] as const

        for (const targetFormat of formats) {
          setWorkspaceItems(prev => prev.map(wi =>
            wi.id === workspaceItem.id
              ? { ...wi, status: 'converting', convertedFormat: targetFormat }
              : wi
          ))

          const result = await convertIcon(analyzed.url, targetFormat)

          setWorkspaceItems(prev => prev.map(wi => {
            if (wi.id === workspaceItem.id) {
              const existingUrls = wi.convertedUrls || {}
              const existingBlobs = wi.convertedBlobs || {}
              
              return {
                ...wi,
                status: 'completed',
                convertedUrls: {
                  ...existingUrls,
                  [targetFormat]: result.url
                },
                convertedBlobs: {
                  ...existingBlobs,
                  [targetFormat]: result.blob
                },
                completedAt: Date.now()
              }
            }
            return wi
          }))
        }

        toast.success('轉換完成', {
          description: `${analyzed.name} 已成功轉換為所有格式`
        })
      } catch (error) {
        setWorkspaceItems(prev => prev.map(wi =>
          wi.id === workspaceItem.id
            ? {
                ...wi,
                status: 'error',
                error: error instanceof Error ? error.message : '轉換失敗'
              }
            : wi
        ))

        toast.error('轉換失敗', {
          description: `處理 ${workspaceItem.name} 時發生錯誤`
        })
      }
    }
  }, [])

  const handlePreview = (item: WorkspaceItem) => {
    setPreviewItem(item)
    setShowPreview(true)
  }

  const handleDownload = (item: WorkspaceItem, format: 'png' | 'ico' | 'icns') => {
    const url = item.convertedUrls?.[format]
    if (!url) return

    const a = document.createElement('a')
    a.href = url
    a.download = `${item.name}.${format}`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)

    toast.success('下載已開始', {
      description: `${item.name}.${format}`
    })
  }

  const handleReorder = (reorderedItems: WorkspaceItem[]) => {
    setWorkspaceItems(reorderedItems)
  }

  const handleClearCompleted = () => {
    setWorkspaceItems(prev => prev.filter(item => item.status !== 'completed'))
  }

  return (
    <>
      <Toaster />
      <div className="min-h-screen bg-background">
        <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
              <div>
                <h1 className="text-3xl font-bold tracking-tight mb-1" style={{ letterSpacing: '-0.02em' }}>
                  Icon Changer
                </h1>
                <p className="text-sm text-muted-foreground" style={{ lineHeight: '1.6' }}>
                  拖曳圖檔或 URL 到工作區，自動轉換為 PNG、ICO、ICNS 格式並支援拖曳替換系統圖示
                </p>
              </div>
            </div>
          </div>
        </div>

        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-6">
            <Button
              onClick={handleUploadClick}
              size="lg"
              variant="default"
              className="gap-2 whitespace-nowrap"
              disabled={isProcessing}
            >
              <UploadSimple size={20} />
              {isProcessing ? '處理中...' : '選擇圖檔'}
            </Button>
            <Button
              onClick={() => setShowUrlInput(!showUrlInput)}
              size="lg"
              variant={showUrlInput ? "default" : "outline"}
              className="gap-2 whitespace-nowrap"
              disabled={isProcessing}
            >
              <LinkIcon size={20} />
              從 URL 載入
            </Button>
          </div>

          <AnimatePresence mode="wait">
            {showUrlInput && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-6"
              >
                <div className="max-w-2xl mx-auto">
                  <div className="flex gap-2">
                    <Input
                      type="url"
                      placeholder="輸入圖檔 URL 或網站 URL（例如：https://example.com/icon.png）"
                      value={urlInput}
                      onChange={(e) => setUrlInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !isProcessing) {
                          handleUrlSubmit()
                        }
                      }}
                      className="flex-1"
                      disabled={isProcessing}
                      id="url-input"
                    />
                    <Button
                      onClick={handleUrlSubmit}
                      disabled={isProcessing || !urlInput.trim()}
                      className="gap-2 whitespace-nowrap"
                    >
                      <LinkIcon size={18} />
                      載入
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    支援直接圖檔連結或網站 URL，系統將自動解析網頁中的圖示
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="grid gap-8">
            <div>
              <h2 className="text-xl font-bold mb-4">工作區拖放區</h2>
              <WorkspaceDropZone
                onDrop={handleWorkspaceDrop}
                isProcessing={isProcessing}
              />
            </div>

            {workspaceItems.length > 0 && (
              <div>
                <h2 className="text-xl font-bold mb-4">處理佇列</h2>
                <WorkspaceQueue
                  items={workspaceItems}
                  onPreview={handlePreview}
                  onDownload={handleDownload}
                  onReorder={handleReorder}
                  onClearCompleted={handleClearCompleted}
                />
              </div>
            )}
          </div>
        </main>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileChange}
          className="hidden"
          id="icon-upload"
        />

        <PreviewDialog
          item={previewItem}
          open={showPreview}
          onOpenChange={setShowPreview}
        />
      </div>
    </>
  )
}

export default App
