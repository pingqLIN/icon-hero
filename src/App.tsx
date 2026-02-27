import { useState, useRef, useCallback, useEffect, lazy, Suspense } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { UploadSimple, Link as LinkIcon, Sun, Moon } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Toaster } from '@/components/ui/sonner'
import { WorkspaceDropZone } from '@/components/WorkspaceDropZone'
import { LogoDisplay } from '@/components/LogoDisplay'
import { WorkspaceQueue } from '@/components/WorkspaceQueue'
import { IconResourcesSection } from '@/components/IconResourcesSection'
// import { DragInstructions } from '@/components/DragInstructions'
import { DragTrackingOverlay } from '@/components/DragTrackingOverlay'
import { WorkspaceItem } from '@/types/workspace'
import { analyzeDroppedItem } from '@/lib/workspaceAnalyzer'
import { convertIcon } from '@/lib/iconConverter'
import { toast } from 'sonner'

const PreviewDialog = lazy(() => import('@/components/PreviewDialog').then(module => ({ default: module.PreviewDialog })))
const AutomationDialog = lazy(() => import('@/components/AutomationDialog').then(module => ({ default: module.AutomationDialog })))
const ApplyIconDialog = lazy(() => import('@/components/ApplyIconDialog').then(module => ({ default: module.ApplyIconDialog })))


function App() {
  const wait = (ms: number) => new Promise<void>(resolve => {
    setTimeout(resolve, ms)
  })

  // Theme State — 預設明亮場景
  const [theme, setTheme] = useState<'light' | 'dark'>('light')

  useEffect(() => {
    const root = window.document.documentElement
    root.classList.remove('light', 'dark')
    root.classList.add(theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light')
  }

  // Original Logic
  const [isProcessing, setIsProcessing] = useState(false)
  const [urlInput, setUrlInput] = useState('')
  const [showUrlInput, setShowUrlInput] = useState(false)
  const [workspaceItems, setWorkspaceItems] = useState<WorkspaceItem[]>([])
  const [previewItem, setPreviewItem] = useState<WorkspaceItem | null>(null)
  const [showPreview, setShowPreview] = useState(false)
  const [automationItem, setAutomationItem] = useState<WorkspaceItem | null>(null)
  const [showAutomation, setShowAutomation] = useState(false)
  const [isDraggingFile, setIsDraggingFile] = useState(false)
  const [draggedFileName, setDraggedFileName] = useState<string>('')
  const [applyItem, setApplyItem] = useState<WorkspaceItem | null>(null)
  const [showApply, setShowApply] = useState(false)
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
    if (items.length === 0 || isProcessing) {
      return
    }

    setIsProcessing(true)

    const newItems: WorkspaceItem[] = items.map((item, index) => ({
      id: `${Date.now()}-${index}-${Math.random().toString(36).substr(2, 9)}`,
      name: typeof item === 'string' ? new URL(item).hostname : item.name,
      type: 'unknown',
      originalUrl: typeof item === 'string' ? item : '',
      status: 'pending',
      addedAt: Date.now()
    }))

    setWorkspaceItems(prev => [...prev, ...newItems])

    try {
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
              ? { ...wi, name: analyzed.name, type: analyzed.type, originalUrl: analyzed.url, format: analyzed.format, status: 'converting' }
              : wi
          ))

          const formats = ['png', 'ico', 'icns'] as const
          const convertedResults = await Promise.all(
            formats.map(async (targetFormat) => {
              const result = await convertIcon(analyzed.url, targetFormat)
              return { targetFormat, result }
            })
          )

          // 系統性緩衝：讓流程在進入可下載階段前保留 1.5 秒轉換體感
          await wait(1500)

          setWorkspaceItems(prev => prev.map(wi => {
            if (wi.id !== workspaceItem.id) {
              return wi
            }

            const convertedUrls = { ...(wi.convertedUrls || {}) }
            const convertedBlobs = { ...(wi.convertedBlobs || {}) }

            for (const { targetFormat, result } of convertedResults) {
              convertedUrls[targetFormat] = result.url
              convertedBlobs[targetFormat] = result.blob
            }

            return {
              ...wi,
              status: 'completed',
              convertedFormat: undefined,
              convertedUrls,
              convertedBlobs,
              completedAt: Date.now()
            }
          }))

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
    } finally {
      setIsProcessing(false)
    }
  }, [isProcessing])

  const handlePreview = (item: WorkspaceItem) => {
    setPreviewItem(item)
    setShowPreview(true)
  }

  const handleAutomation = (item: WorkspaceItem) => {
    setAutomationItem(item)
    setShowAutomation(true)
  }

  const handleApplyIcon = (item: WorkspaceItem) => {
    setApplyItem(item)
    setShowApply(true)
  }

  const handleFileDragStart = (fileName: string) => {
    setIsDraggingFile(true)
    setDraggedFileName(fileName)
  }

  const handleFileDragEnd = () => {
    setIsDraggingFile(false)
    setDraggedFileName('')
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

  const hasCompletedItems = workspaceItems.some(item => item.status === 'completed')

  useEffect(() => {
    const handleGlobalDragEnd = () => {
      document.querySelectorAll('[draggable="true"]').forEach(element => {
        const htmlElement = element as HTMLElement
        htmlElement.style.pointerEvents = ''
        htmlElement.style.cursor = ''
      })
    }

    const handleGlobalMouseUp = handleGlobalDragEnd
    const handleWindowBlur = handleGlobalDragEnd

    document.addEventListener('dragend', handleGlobalDragEnd, true)
    document.addEventListener('mouseup', handleGlobalMouseUp, true)
    window.addEventListener('blur', handleWindowBlur)

    return () => {
      document.removeEventListener('dragend', handleGlobalDragEnd, true)
      document.removeEventListener('mouseup', handleGlobalMouseUp, true)
      window.removeEventListener('blur', handleWindowBlur)
    }
  }, [])

  return (
    <>
      <Toaster />
      <DragTrackingOverlay isActive={isDraggingFile} fileName={draggedFileName} />
      <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
        <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
              <div className="flex items-center gap-4">
                <LogoDisplay />
              </div>
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={toggleTheme}
                >
                  {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                </Button>
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
                mascotType={theme === 'dark' ? 'bot' : 'hero'}
                hasCompletedItems={hasCompletedItems}
              />
              <div className="mt-4 grid gap-3 text-center md:grid-cols-3">
                <div className="rounded-lg border border-border bg-secondary/5 p-3 text-center">
                  <p className="text-sm font-medium">1. ICON 或網址拖拉進工作區</p>
                </div>
                <div className="rounded-lg border border-border bg-secondary/5 p-3 text-center">
                  <p className="text-sm font-medium">2. 系統自動偵測檔案類型並轉換</p>
                </div>
                <div className="rounded-lg border border-border bg-secondary/5 p-3 text-center">
                  <p className="text-sm font-medium">3. 提供 PNG / ICO / ICNS 等格式下載</p>
                </div>
              </div>
            </div>

            {workspaceItems.length > 0 && (
              <div>
                <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 mb-4">
                  <h2 className="text-xl font-bold">處理佇列</h2>
                  <span className="text-xs text-muted-foreground">
                    拖曳功能啟用：長按格式按鈕（PNG / ICO /
                    ICNS）並拖曳至系統檔案或資料夾，即可替換該目標
                  </span>
                </div>
                {/* DragInstructions removed as mascot is moved to Completed area */}
                <WorkspaceQueue
                  items={workspaceItems}
                  onPreview={handlePreview}
                  onDownload={handleDownload}
                  onAutomation={handleAutomation}
                  onApplyIcon={handleApplyIcon}
                  onReorder={handleReorder}
                  onClearCompleted={handleClearCompleted}
                  onFileDragStart={handleFileDragStart}
                  onFileDragEnd={handleFileDragEnd}
                  mascotType={theme === 'dark' ? 'bot' : 'hero'}
                />
              </div>
            )}
          </div>

          {/* Top 10 Icon Resource Websites */}
          <IconResourcesSection />
        </main>

        <footer className="border-t border-border/70">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex flex-col gap-2 text-xs text-muted-foreground">
              <p>
                GitHub：
                <a
                  href="https://github.com/pingqLIN/icon-hero"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline underline-offset-2 hover:text-foreground transition-colors"
                >
                  https://github.com/pingqLIN/icon-hero
                </a>
              </p>
              <p>
                免責聲明：本網站僅提供線上圖檔格式轉換服務，請留意素材版權並確認您擁有合法使用與轉換權利。
              </p>
            </div>
          </div>
        </footer>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileChange}
          className="hidden"
          id="icon-upload"
          aria-label="選擇圖檔上傳"
        />

        <Suspense fallback={null}>
          <PreviewDialog
            item={previewItem}
            open={showPreview}
            onOpenChange={setShowPreview}
          />

          <AutomationDialog
            item={automationItem}
            open={showAutomation}
            onOpenChange={setShowAutomation}
          />

          <ApplyIconDialog
            item={applyItem}
            open={showApply}
            onOpenChange={setShowApply}
          />
        </Suspense>
      </div>
    </>
  );
}

export default App
