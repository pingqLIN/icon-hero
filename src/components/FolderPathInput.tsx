import { useState } from 'react'
import { FolderOpen, X } from '@phosphor-icons/react'
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
 * 提供兩種輸入方式：手動輸入（Enter 新增）與貼上/拖放自動新增
 */
export function FolderPathInput({
  paths,
  onPathsChange,
  placeholder = 'C:\\Users\\Username\\Documents\\Folder',
  showList = true,
  maxPaths = 50,
}: FolderPathInputProps) {
  const [inputValue, setInputValue] = useState('')

  const normalizePath = (rawPath: string) => {
    const trimmed = rawPath.trim()
    if (!trimmed || trimmed.startsWith('#')) {
      return ''
    }

    let value = trimmed
    try {
      value = decodeURIComponent(trimmed)
    } catch {
      value = trimmed
    }

    if (!value) return ''

    if (value.startsWith('file:///')) {
      return value.replace(/^file:\/\/\//, '')
    }
    if (value.startsWith('file://')) {
      return value.replace(/^file:\/\//, '')
    }

    return value
  }

  const parsePaths = (rawText: string): string[] => {
    const lines = rawText.split(/\r?\n/)
    const normalized = lines.map((line) => normalizePath(line)).filter(Boolean)
    return normalized.filter((path, index, list) => list.indexOf(path) === index)
  }

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

  const addPaths = (items: string[]) => {
    let added = false
    items.forEach((item) => {
      if (addPath(item)) {
        added = true
      }
    })
    return added
  }

  // 手動輸入的 Enter 動作
  const handleAddFromInput = () => {
    if (addPaths(parsePaths(inputValue))) {
      setInputValue('')
    }
  }

  // 移除路徑
  const handleRemovePath = (index: number) => {
    onPathsChange(paths.filter((_, i) => i !== index))
  }

  // 拖放處理
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()

    const uriText = e.dataTransfer.getData('text/uri-list')
    const uriPaths = parsePaths(uriText)
    if (uriPaths.length > 0) {
      if (addPaths(uriPaths)) {
        toast.success('已自動加入拖曳的路徑')
      }
      return
    }

    const text = e.dataTransfer.getData('text/plain')
    const textPaths = parsePaths(text)
    if (textPaths.length > 0) {
      if (addPaths(textPaths)) {
        toast.success('已自動加入拖曳的路徑')
      }
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
        if (addPaths(entries)) {
          toast.info('已自動加入資料夾名稱，建議補上完整路徑後使用')
        }
        return
      }
    }

    // 嘗試 files（最後 fallback）
    if (e.dataTransfer.files?.length) {
      const fileNames = Array.from(e.dataTransfer.files).map((file) => file.name)
      if (addPaths(fileNames)) {
        toast.info('已加入檔案名稱，建議補上完整路徑後使用')
      }
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const hasPaths = paths.length > 0

  return (
    <div className="space-y-2" onDrop={handleDrop} onDragOver={handleDragOver}>
      {/* 輸入列：文字框 + Enter 新增 */}
      <div className="flex gap-2">
        <Input
          placeholder={placeholder}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onPaste={(e) => {
            const text = e.clipboardData.getData('text')
            const pastedPaths = parsePaths(text)
            if (pastedPaths.length > 0) {
              e.preventDefault()
              if (addPaths(pastedPaths)) {
                setInputValue('')
              }
            }
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              handleAddFromInput()
            }
          }}
          className="flex-1"
        />
      </div>

      {/* 提示文字 */}
      <div className="text-xs text-muted-foreground flex items-center gap-1">
        <FolderOpen size={14} />
        手動輸入後按 Enter，或貼上 / 拖放資料夾或路徑至此處自動加入
      </div>

      {/* 路徑清單 */}
      {showList && hasPaths && (
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
                  <button
                    type="button"
                    className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-foreground"
                    onClick={() => handleRemovePath(index)}
                    aria-label="移除此路徑"
                    title="移除此路徑"
                  >
                    <X size={14} />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </ScrollArea>
      )}
    </div>
  )
}
