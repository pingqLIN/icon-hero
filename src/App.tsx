import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Hand, UploadSimple, Warning, ArrowsDownUp, Link as LinkIcon } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { IconCard } from '@/components/IconCard'
import { EmptyState } from '@/components/EmptyState'
import { IconItem } from '@/types/icon'
import { toast } from 'sonner'

function App() {
  const [currentIcon, setCurrentIcon] = useState<IconItem | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [urlInput, setUrlInput] = useState('')
  const [showUrlInput, setShowUrlInput] = useState(false)
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

    setIsProcessing(true)

    try {
      const response = await fetch(trimmedUrl)
      const contentType = response.headers.get('content-type')
      
      if (contentType && contentType.startsWith('image/')) {
        const blob = await response.blob()
        const reader = new FileReader()
        
        reader.onload = (event) => {
          const url = event.target?.result as string
          const format = contentType.split('/')[1]
          const fileName = trimmedUrl.split('/').pop() || 'downloaded-icon'
          
          const newIcon: IconItem = {
            id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            name: fileName.replace(/\.[^/.]+$/, ''),
            url,
            format,
            uploadedAt: Date.now()
          }

          setCurrentIcon(newIcon)
          setUrlInput('')
          setShowUrlInput(false)
          setIsProcessing(false)
          toast.success('圖檔已載入', {
            description: `${newIcon.name} 可立即拖曳或轉換格式`
          })
        }
        
        reader.readAsDataURL(blob)
      } else {
        const newIcon: IconItem = {
          id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          name: 'url-icon',
          url: trimmedUrl,
          format: 'url',
          uploadedAt: Date.now()
        }

        setCurrentIcon(newIcon)
        setUrlInput('')
        setShowUrlInput(false)
        setIsProcessing(false)
        toast.success('URL 已載入', {
          description: '將解析網頁中的圖示'
        })
      }
    } catch (error) {
      setIsProcessing(false)
      toast.error('載入失敗', {
        description: '無法從 URL 載入圖檔，請檢查網址是否正確'
      })
    }
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    const file = files[0]
    const maxSize = 5 * 1024 * 1024

    if (file.size > maxSize) {
      toast.error('檔案過大', {
        description: '請上傳小於 5MB 的圖檔'
      })
      return
    }

    if (!file.type.startsWith('image/')) {
      toast.error('無效的檔案類型', {
        description: '請上傳圖檔 (PNG, JPG, ICO 等)'
      })
      return
    }

    setIsProcessing(true)

    try {
      const reader = new FileReader()
      reader.onload = (event) => {
        const url = event.target?.result as string
        const format = file.type.split('/')[1]

        const newIcon: IconItem = {
          id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          name: file.name.replace(/\.[^/.]+$/, ''),
          url,
          format,
          uploadedAt: Date.now()
        }

        setCurrentIcon(newIcon)
        setIsProcessing(false)
        toast.success('圖檔已載入', {
          description: `${newIcon.name} 可立即拖曳或轉換格式`
        })
      }
      reader.readAsDataURL(file)
    } catch (error) {
      setIsProcessing(false)
      toast.error('載入失敗', {
        description: '處理圖檔時發生錯誤'
      })
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleReplaceIcon = () => {
    setCurrentIcon(null)
    handleUploadClick()
  }

  const handleConvertComplete = (newIcon: IconItem) => {
    setCurrentIcon(newIcon)
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight mb-1" style={{ letterSpacing: '-0.02em' }}>
                Icon Changer
              </h1>
              <p className="text-sm text-muted-foreground" style={{ lineHeight: '1.6' }}>
                上傳圖檔後即可拖曳到系統資料夾或應用程式來更換圖示
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              {currentIcon && (
                <Button
                  onClick={handleReplaceIcon}
                  size="lg"
                  variant="secondary"
                  className="gap-2 whitespace-nowrap"
                >
                  <UploadSimple size={20} />
                  更換圖檔
                </Button>
              )}
              {!currentIcon && (
                <>
                  <Button
                    onClick={handleUploadClick}
                    size="lg"
                    variant={showUrlInput ? "outline" : "default"}
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
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode="wait">
          {showUrlInput && !currentIcon && (
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

        <AnimatePresence mode="wait">
          {currentIcon && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6"
            >
              <Alert className="border-accent/50 bg-accent/5">
                <Hand size={18} weight="fill" className="text-accent" />
                <AlertDescription className="text-sm">
                  <strong>拖曳模式已啟用：</strong>點擊並按住圖示，拖曳到瀏覽器外的系統資料夾或應用程式上即可更換。需要其他格式？點擊
                  <ArrowsDownUp size={14} className="inline mx-1" weight="bold" />
                  轉換按鈕。
                </AlertDescription>
              </Alert>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {!currentIcon ? (
            <EmptyState onUploadClick={handleUploadClick} isProcessing={isProcessing} />
          ) : (
            <motion.div
              key={currentIcon.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex justify-center"
            >
              <div className="w-full max-w-md">
                <IconCard
                  icon={currentIcon}
                  onConvert={handleConvertComplete}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
        id="icon-upload"
      />
    </div>
  )
}

export default App