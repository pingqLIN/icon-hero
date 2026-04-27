import { useEffect, useRef, useState } from 'react'
import { 
  Code, 
  WindowsLogo, 
  AppleLogo, 
  LinuxLogo, 
  Copy, 
  Download,
  Play,
  Link
} from '@phosphor-icons/react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { FolderPathInput } from '@/components/FolderPathInput'
import { WorkspaceItem } from '@/types/workspace'
import { type ApplyPlatform } from '@/lib/iconApplyPackager'
import { generateScript, getScriptInstructions, type ScriptType } from '@/lib/scriptGenerator'
import { motion } from 'framer-motion'

import { toast } from 'sonner'

interface AutomationDialogProps {
  item: WorkspaceItem | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

const detectScriptType = (): ScriptType => {
  const ua = navigator.userAgent.toLowerCase()
  if (ua.includes('win')) return 'powershell'
  if (ua.includes('mac')) return 'applescript'
  return 'bash'
}

const detectedType: ScriptType = detectScriptType()

const mapScriptTypeToPlatform = (type: ScriptType): ApplyPlatform => {
  if (type === 'powershell') return 'windows'
  if (type === 'applescript') return 'macos'
  return 'linux'
}

const terminalHint: Record<ScriptType, string> = {
  powershell: '請貼到 PowerShell 終端機中執行',
  applescript: '請貼到 Terminal（終端機）中執行',
  bash: '請貼到 Bash 終端機中執行',
}

const osVendorDocs: Record<ScriptType, { label: string; href: string }> = {
  powershell: {
    label: 'Windows 專用：變更資料夾圖示說明（Microsoft）',
    href: 'https://support.microsoft.com/zh-tw/windows',
  },
  applescript: {
    label: 'macOS 專用：Get Info / 圖示變更（Apple）',
    href: 'https://support.apple.com/zh-tw/guide/mac-help/welcome/mac',
  },
  bash: {
    label: 'Linux 專用：檔案管理與桌面圖示操作說明',
    href: 'https://help.gnome.org/users/nautilus/stable/',
  },
}

export function AutomationDialog({ item, open, onOpenChange }: AutomationDialogProps) {
  const [scriptType, setScriptType] = useState<ScriptType>(() => detectScriptType())
  const [targetPaths, setTargetPaths] = useState<string[]>([])
  const [generatedScript, setGeneratedScript] = useState('')
  const [isDownloadingPackage, setIsDownloadingPackage] = useState(false)
  const [scriptPreviewHeight, setScriptPreviewHeight] = useState(180)
  const scriptRef = useRef<HTMLPreElement>(null)

  // 開啟時重置狀態（包含恢復為偵測到的平台）
  useEffect(() => {
    if (open) {
      setScriptType(detectScriptType())
      setTargetPaths([])
      setGeneratedScript('')
      setIsDownloadingPackage(false)
    }
  }, [open])

  useEffect(() => {
    const preElement = scriptRef.current
    if (!preElement) {
      return
    }

    const measuredHeight = preElement.scrollHeight + 12
    setScriptPreviewHeight(Math.min(720, Math.max(180, measuredHeight)))
  }, [generatedScript])

  if (!item || item.status !== 'completed') return null

  const getRecommendedFormat = (type: ScriptType): 'png' | 'ico' | 'icns' => {
    switch (type) {
      case 'powershell':
        return 'ico'
      case 'applescript':
        return 'icns'
      case 'bash':
        return 'png'
    }
  }

  const handleGenerateScript = () => {
    if (targetPaths.length === 0) {
      toast.error('請至少新增一個目標路徑')
      return
    }

    const format = getRecommendedFormat(scriptType)
    const iconPath = `./${item.name}.${format}`
    const script = generateScript({
      targetPaths,
      format,
      iconPath,
      isInlineMode: true
    }, scriptType)

    setGeneratedScript(script)
    toast.success('腳本已生成')
  }

  const handleCopyScript = async () => {
    if (!generatedScript) return

    try {
      await navigator.clipboard.writeText(generatedScript)
      toast.success('已複製', {
        description: terminalHint[scriptType],
      })
    } catch (error) {
      toast.error('複製失敗', {
        description: error instanceof Error ? error.message : '請手動複製文字'
      })
    }
  }

  const handleDownloadPackage = async () => {
    if (targetPaths.length === 0) {
      toast.error('請至少新增一個目標路徑')
      return
    }

    const format = getRecommendedFormat(scriptType)
    const iconBlob = item.convertedBlobs?.[format]
    if (!iconBlob) {
      toast.error(`找不到 ${format.toUpperCase()} 圖示檔案`)
      return
    }

    setIsDownloadingPackage(true)
    try {
      const { createApplyPackage } = await import('@/lib/iconApplyPackager')
      await createApplyPackage({
        iconBlob,
        iconName: item.name,
        targetPaths,
        platform: mapScriptTypeToPlatform(scriptType),
      })

      toast.success('自動化安裝包已下載！', {
        description: '已包含自動化批次檔案與 ICON 檔案，執行前請先放在同一個目錄。'
      })
    } catch (error) {
      toast.error('下載失敗', {
        description: error instanceof Error ? error.message : '未知錯誤'
      })
    } finally {
      setIsDownloadingPackage(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[calc(48rem+200px)] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Code size={24} weight="bold" className="text-primary" />
            自動化腳本生成器
          </DialogTitle>
          <DialogDescription>
            生成自動化腳本以批次套用圖示至多個資料夾或檔案
          </DialogDescription>
        </DialogHeader>

        <Tabs value={scriptType} onValueChange={(v) => setScriptType(v as ScriptType)} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="powershell" className="gap-2">
              <WindowsLogo size={16} weight="fill" />
              Windows
            </TabsTrigger>
            <TabsTrigger value="applescript" className="gap-2">
              <AppleLogo size={16} weight="fill" />
              macOS
            </TabsTrigger>
            <TabsTrigger value="bash" className="gap-2">
              <LinuxLogo size={16} weight="fill" />
              Linux
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* 平台不符警告 */}
        {scriptType !== detectedType && (
          <div className="px-3 py-2 rounded-lg bg-yellow-500/10 border border-yellow-500/30 text-yellow-600 dark:text-yellow-400 text-xs flex items-center gap-2">
            <span>⚠️</span>
            <span>
              你目前使用的是 <strong>{detectedType === 'powershell' ? 'Windows' : detectedType === 'applescript' ? 'macOS' : 'Linux'}</strong>，
              但選擇了 <strong>{scriptType === 'powershell' ? 'Windows' : scriptType === 'applescript' ? 'macOS' : 'Linux'}</strong> 腳本。
              此腳本無法在你目前的系統上直接執行。
            </span>
          </div>
        )}

        {/* 表單內容 */}
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-semibold">圖示檔案</Label>
              <Badge variant="secondary" className="text-xs">
                建議: {getRecommendedFormat(scriptType).toUpperCase()}
              </Badge>
            </div>
            <div className="p-3 bg-secondary/20 rounded-lg border border-border">
              <p className="text-sm font-mono text-muted-foreground">
                {item.name}.{getRecommendedFormat(scriptType)}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-semibold">目標路徑</Label>
            <FolderPathInput
              paths={targetPaths}
              onPathsChange={setTargetPaths}
              placeholder={
                scriptType === 'powershell'
                  ? 'C:\\Users\\Username\\Documents\\Folder'
                  : scriptType === 'applescript'
                  ? '/Users/username/Documents/Folder'
                  : '/home/username/Documents/Folder'
              }
            />
          </div>

          <Button
            onClick={handleGenerateScript}
            className="w-full gap-2"
            disabled={targetPaths.length === 0}
            type="button"
          >
            <Play size={16} weight="fill" />
            生成腳本
          </Button>

          {generatedScript && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-2"
            >
              <Label className="text-sm font-semibold">生成的腳本</Label>
              <div
                className="w-full overflow-auto rounded-lg border border-border bg-muted/30"
                style={{ height: `${scriptPreviewHeight}px` }}
              >
                <pre
                  ref={scriptRef}
                  className="p-4 text-xs font-mono leading-5 whitespace-pre-wrap break-words min-h-0"
                >
                  <code>{generatedScript}</code>
                </pre>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={handleCopyScript}
                  variant="outline"
                  className="flex-1 gap-2"
                  type="button"
                >
                  <Copy size={16} />
                  一鍵複製
                </Button>
                <Button
                  onClick={handleDownloadPackage}
                  className="flex-1 gap-2"
                  disabled={isDownloadingPackage}
                  type="button"
                >
                  <Download size={16} />
                  {isDownloadingPackage ? '下載中...' : '下載自動化安裝包'}
                </Button>
              </div>

              <div className="p-3 bg-accent/10 rounded-lg border border-accent/20">
                <p className="text-xs font-semibold text-accent-foreground mb-1">使用說明:</p>
                <p className="text-xs text-muted-foreground whitespace-pre-line mb-2">
                  {getScriptInstructions(scriptType)}
                </p>
                <p className="text-xs text-muted-foreground mb-3">
                  請將圖示檔與自動化批次檔放在同一個目錄後再執行（例如 ZIP 解壓後直接執行腳本）。
                </p>
                <p className="text-xs font-semibold text-accent-foreground mb-1">系統官方參考:</p>
                <a
                  href={osVendorDocs[scriptType].href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-xs text-primary hover:underline"
                >
                  <Link size={12} weight="fill" />
                  <span className="ml-1">{osVendorDocs[scriptType].label}</span>
                </a>
              </div>
            </motion.div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
