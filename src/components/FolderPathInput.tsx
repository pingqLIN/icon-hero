import { useState, useRef } from 'react'
import { FolderOpen, Plus, X } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'

interface FolderPathInputProps {
  /** 目前已加入的路徑清單 */
  paths: string[]
  /** 路徑清單更新回呼 */
  onPathsChange: (paths: string[]) => void
  /** placeholder 文字（依平台而異） */
  placeholder?: string
  /** 是否顯示多路徑清單（預設 true） */
  showList?: boolean
  /** 最大路徑數 */
  maxPaths?: number
}

/**
 * 資料夾路徑輸入元件
 * 提供三種輸入方式：手動輸入、本機瀏覽、拖放
 */
export function FolderPathInput({
  paths,
  onPathsChange,
  placeholder = 'C:\\Users\\Username\\Documents\\Folder',
  showList = true,
  maxPaths = 50,
}: FolderPathInputProps) {
  const [inputValue, setInputValue] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  // 新增路徑（去重 + 去空白）
  const addPath = (rawPath: string) => {
    const trimmed = rawPath.trim()
    if (!trimmed) return false
    if (paths.includes(trimmed)) {
      toast.warning('此路徑已存在')
      return false
    }
    if (paths.length >= maxPaths) {
      toast.warning(`最多只能加入 ${maxPaths} 個路徑`)
      return false
    }
    onPathsChange([...paths, trimmed])
    return true
  }

  // 手動輸入的 + 按鈕
  const handleAddFromInput = () => {
    if (addPath(inputValue)) {
      setInputValue('')
    }
  }

  // 移除路徑
  const handleRemovePath = (index: number) => {
    onPathsChange(paths.filter((_, i) => i !== index))
  }

  /**
   * 使用 File System Access API 開啟資料夾選擇器
   * 若不支援則 fallback 到 file input
   */
  const handleBrowseFolder = async () => {
    // 優先使用 showDirectoryPicker（Chromium 86+）
    if ('showDirectoryPicker' in window) {
      try {
        // @ts-expect-error showDirectoryPicker 尚未在所有 TS 型別中定義
        const dirHandle = await window.showDirectoryPicker({ mode: 'read' })
        const folderName = dirHandle.name
        // 瀏覽器安全限制：只能拿到資料夾名稱，無法取得完整系統路徑
        // 先填入輸入框讓使用者補全完整路徑
        setInputValue(folderName)
        toast.info(
          '已選取資料夾名稱，請在輸入框中補全完整路徑後按 Enter',
          { duration: 5000 }
        )
      } catch (err: unknown) {
        // 使用者取消選擇不需要提示
        if (err instanceof DOMException && err.name === 'AbortError') return
        console.error('Folder picker error:', err)
      }
    } else {
      // Fallback：用隱藏的 file input 開啟資料夾選擇
      fileInputRef.current?.click()
    }
  }

  /**
   * Fallback file input 的 onChange
   * webkitdirectory 屬性讓使用者可以選擇資料夾
   */
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      // 從第一個檔案的 webkitRelativePath 取得資料夾名稱
      const firstPath = files[0].webkitRelativePath
      const folderName = firstPath ? firstPath.split('/')[0] : files[0].name
      setInputValue(folderName)
      toast.info(
        '已選取資料夾名稱，請在輸入框中補全完整路徑後按 Enter',
        { duration: 5000 }
      )
    }
    // 重置 input 以便重複選擇同一個資料夾
    e.target.value = ''
  }

  // 拖放處理
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()

    // 嘗試文字資料
    const text = e.dataTransfer.getData('text/plain')
    if (text?.trim()) {
      addPath(text.trim())
      return
    }

    // 嘗試 webkitGetAsEntry（可取得名稱）
    if (e.dataTransfer.items?.length) {
      const entries: string[] = []
      for (let i = 0; i < e.dataTransfer.items.length; i++) {
        const entry = e.dataTransfer.items[i].webkitGetAsEntry?.()
        if (entry?.isDirectory) {
          entries.push(entry.name)
        }
      }
      if (entries.length > 0) {
        entries.forEach(name => addPath(name))
        toast.info(
          '已加入資料夾名稱，建議手動補全為完整路徑',
          { duration: 5000 }
        )
        return
      }
    }

    // 嘗試 files
    if (e.dataTransfer.files?.length) {
      for (let i = 0; i < e.dataTransfer.files.length; i++) {
        addPath(e.dataTransfer.files[i].name)
      }
      toast.info('已加入檔案名稱，建議手動補全為完整路徑', { duration: 5000 })
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  return (
    <div className="space-y-2" onDrop={handleDrop} onDragOver={handleDragOver}>
      {/* 輸入列：文字框 + 瀏覽按鈕 + 新增按鈕 */}
      <div className="flex gap-2">
        <Input
          placeholder={placeholder}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              handleAddFromInput()
            }
          }}
          className="flex-1"
        />
        <Button
          onClick={handleBrowseFolder}
          size="icon"
          variant="outline"
          type="button"
          title="瀏覽本機資料夾"
          className="shrink-0"
        >
          <FolderOpen size={16} weight="fill" />
        </Button>
        <Button
          onClick={handleAddFromInput}
          size="icon"
          variant="outline"
          type="button"
          disabled={!inputValue.trim()}
          title="新增路徑"
          className="shrink-0"
        >
          <Plus size={16} />
        </Button>
      </div>

      {/* 提示文字 */}
      <div className="text-xs text-muted-foreground flex items-center gap-1">
        <FolderOpen size={14} />
        輸入路徑按 Enter、點擊 📁 瀏覽本機資料夾、或拖放資料夾至此處
      </div>

      {/* 隱藏的 file input（fallback 用） */}
      <input
        ref={fileInputRef}
        type="file"
        // @ts-expect-error webkitdirectory 非標準屬性
        webkitdirectory="true"
        className="hidden"
        onChange={handleFileInputChange}
        aria-label="選擇資料夾（fallback）"
      />

      {/* 路徑清單 */}
      {showList && paths.length > 0 && (
        <ScrollArea className="h-32 w-full rounded-lg border border-border p-2 bg-secondary/10">
          <div className="space-y-1">
            <AnimatePresence mode="popLayout">
              {paths.map((path, index) => (
                <motion.div
                  key={`${path}-${index}`}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="flex items-center justify-between p-2 bg-background rounded border border-border group hover:border-primary transition-colors"
                >
                  <span className="text-xs font-mono truncate flex-1">{path}</span>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                    onClick={() => handleRemovePath(index)}
                    type="button"
                    title="移除此路徑"
                  >
                    <X size={14} />
                  </Button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </ScrollArea>
      )}
    </div>
  )
}
