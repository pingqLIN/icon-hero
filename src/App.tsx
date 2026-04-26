import { useState, useRef, useCallback, useEffect, lazy, Suspense } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { UploadSimple, Link as LinkIcon, Sun, Moon, ArrowRight } from '@phosphor-icons/react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Toaster } from '@/components/ui/sonner'
import { WorkspaceDropZone } from '@/components/WorkspaceDropZone'
import { LogoDisplay } from '@/components/LogoDisplay'
// import { DragInstructions } from '@/components/DragInstructions'
import { DragTrackingOverlay } from '@/components/DragTrackingOverlay'
import { LanguageSwitcher } from '@/components/LanguageSwitcher'
import { VisitorCounter } from '@/components/VisitorCounter'
import { InteractionHelp } from '@/components/InteractionHelp'
import { WorkspaceItem } from '@/types/workspace'
import { analyzeDroppedItem } from '@/lib/workspaceAnalyzer'
import { convertIcon, getIconConversionErrorMessage, type IconConversionErrorCode } from '@/lib/iconConverter'
import { toast } from 'sonner'

const PreviewDialog = lazy(() => import('@/components/PreviewDialog').then(module => ({ default: module.PreviewDialog })))
const AutomationDialog = lazy(() => import('@/components/AutomationDialog').then(module => ({ default: module.AutomationDialog })))
const ApplyIconDialog = lazy(() => import('@/components/ApplyIconDialog').then(module => ({ default: module.ApplyIconDialog })))
const WorkspaceQueue = lazy(() => import('@/components/WorkspaceQueue').then(module => ({ default: module.WorkspaceQueue })))
const IconResourcesSection = lazy(() => import('@/components/IconResourcesSection').then(module => ({ default: module.IconResourcesSection })))


function App() {
  const { t } = useTranslation()

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
  const isProcessingRef = useRef(false)

  const getInputSignature = (item: File | string) => {
    if (typeof item === 'string') {
      return `url:${item.trim()}`
    }

    return `file:${item.name}:${item.size}:${item.lastModified}:${item.type}`
  }

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  const handleUrlSubmit = async () => {
    const trimmedUrl = urlInput.trim()

    if (!trimmedUrl) {
      toast.error(t('urlRequired'))
      return
    }

    if (!trimmedUrl.startsWith('https://')) {
      toast.error(t('urlRequired'), {
        description: t('urlInvalidPrefix')
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
    if (items.length === 0 || isProcessingRef.current) {
      return
    }

    const fileItems = items.filter((item): item is File => item instanceof File)
    const normalizedItems = (fileItems.length > 0 ? fileItems : items).filter((item, index, source) => {
      const signature = getInputSignature(item)
      return source.findIndex(candidate => getInputSignature(candidate) === signature) === index
    })

    if (normalizedItems.length === 0) {
      return
    }

    isProcessingRef.current = true
    setIsProcessing(true)

    const newItems: WorkspaceItem[] = normalizedItems.map((item, index) => ({
      id: `${Date.now()}-${index}-${Math.random().toString(36).substr(2, 9)}`,
      name: typeof item === 'string' ? new URL(item).hostname : item.name,
      type: 'unknown',
      originalUrl: typeof item === 'string' ? item : '',
      status: 'pending',
      addedAt: Date.now()
    }))

    setWorkspaceItems(prev => [...prev, ...newItems])

    try {
      for (let i = 0; i < normalizedItems.length; i++) {
        const item = normalizedItems[i]
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

          toast.success(t('toastConvertSuccess'), {
            description: t('toastConvertSuccessDesc', { name: analyzed.name })
          })
        } catch (error) {
          const conversionErrorMessages: Record<IconConversionErrorCode, string> = {
            https_only: t('conversionErrorHttpsOnly'),
            network: t('conversionErrorNetwork'),
            too_large: t('conversionErrorTooLarge'),
            unsupported_content_type: t('conversionErrorUnsupportedContentType'),
            html_too_large: t('conversionErrorHtmlTooLarge'),
            icon_not_found: t('conversionErrorIconNotFound'),
            icon_not_image: t('conversionErrorIconNotImage'),
            image_load_failed: t('conversionErrorImageLoadFailed'),
            canvas_unavailable: t('conversionErrorCanvasUnavailable'),
            canvas_export_failed: t('conversionErrorCanvasExportFailed'),
            unsupported_format: t('conversionErrorUnsupportedFormat'),
            unknown: t('conversionErrorUnknown'),
          }
          const errorMessage = getIconConversionErrorMessage(error, conversionErrorMessages)

          setWorkspaceItems(prev => prev.map(wi =>
            wi.id === workspaceItem.id
              ? {
                ...wi,
                status: 'error',
                error: errorMessage
              }
              : wi
          ))

          toast.error(t('toastConvertError'), {
            description: errorMessage
          })
        }
      }
    } finally {
      isProcessingRef.current = false
      setIsProcessing(false)
    }
  }, [t])

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

    toast.success(t('toastDownloadStart'), {
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
  const workflowSteps = [t('step1'), t('step2'), t('step3')]

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
      <InteractionHelp />
      <DragTrackingOverlay isActive={isDraggingFile} fileName={draggedFileName} />
      <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
        <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
              <div className="flex items-center gap-4">
                <LogoDisplay />
              </div>
              <div className="flex items-center gap-4">
                <VisitorCounter />
                <LanguageSwitcher />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={toggleTheme}
                  data-help={t('helpThemeToggle')}
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
              data-help={t('helpSelectFile')}
            >
              <UploadSimple size={20} />
              {isProcessing ? t('processing') : t('selectFile')}
            </Button>
            <Button
              onClick={() => setShowUrlInput(!showUrlInput)}
              size="lg"
              variant={showUrlInput ? "default" : "outline"}
              className="gap-2 whitespace-nowrap"
              disabled={isProcessing}
              data-help={t('helpLoadFromUrl')}
            >
              <LinkIcon size={20} />
              {t('loadFromUrl')}
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
                      placeholder={t('urlPlaceholder')}
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
                      data-help={t('helpUrlInput')}
                    />
                    <Button
                      onClick={handleUrlSubmit}
                      disabled={isProcessing || !urlInput.trim()}
                      className="gap-2 whitespace-nowrap"
                      data-help={t('helpUrlSubmit')}
                    >
                      <LinkIcon size={18} />
                      {t('load')}
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    {t('urlHint')}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="grid gap-8">
            <div>
              <h2 className="text-xl font-bold mb-4">{t('workspaceTitle')}</h2>
              <WorkspaceDropZone
                onDrop={handleWorkspaceDrop}
                isProcessing={isProcessing}
                mascotType={theme === 'dark' ? 'bot' : 'hero'}
                hasCompletedItems={hasCompletedItems}
                helpText={t('helpDropZone')}
              />
              <div className="mt-6 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-center">
                {workflowSteps.map((step, index) => (
                  <div key={step} className="contents">
                    <p className="text-base font-extrabold tracking-tight text-foreground md:text-lg">
                      {step}
                    </p>
                    {index < workflowSteps.length - 1 && (
                      <ArrowRight
                        size={22}
                        weight="bold"
                        className="text-primary/70"
                        aria-hidden="true"
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {workspaceItems.length > 0 && (
              <div className="pt-6 md:pt-8">
                <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 mb-4">
                  <h2 className="text-xl font-bold">{t('queueTitle')}</h2>
                  <span className="text-xs text-muted-foreground">
                    {t('queueDragHint')}
                  </span>
                </div>
                {/* DragInstructions removed as mascot is moved to Completed area */}
                <Suspense fallback={null}>
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
                </Suspense>
              </div>
            )}
          </div>

          {/* Top 10 Icon Resource Websites */}
          <Suspense fallback={null}>
            <IconResourcesSection />
          </Suspense>
        </main>

        <footer className="border-t border-border/70">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex flex-col gap-2 text-xs text-muted-foreground">
              <p>
                {t('githubLabel')}
                <a
                  href="https://github.com/pingqLIN/icon-hero"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline underline-offset-2 hover:text-foreground transition-colors"
                  data-help={t('helpGithubLink')}
                >
                  https://github.com/pingqLIN/icon-hero
                </a>
              </p>
              <p>
                {t('disclaimer')}
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
          aria-label={t('uploadAriaLabel')}
        />

        <Suspense fallback={null}>
          {previewItem && (
            <PreviewDialog
              item={previewItem}
              open={showPreview}
              onOpenChange={setShowPreview}
            />
          )}

          {automationItem && (
            <AutomationDialog
              item={automationItem}
              open={showAutomation}
              onOpenChange={setShowAutomation}
            />
          )}

          {applyItem && (
            <ApplyIconDialog
              item={applyItem}
              open={showApply}
              onOpenChange={setShowApply}
            />
          )}
        </Suspense>
      </div>
    </>
  );
}

export default App
