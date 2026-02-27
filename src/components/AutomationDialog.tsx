import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Code, 
  WindowsLogo, 
  AppleLogo, 
  LinuxLogo, 
  Copy, 
  Download,
  Play
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
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { FolderPathInput } from '@/components/FolderPathInput'
import { WorkspaceItem } from '@/types/workspace'
import { 
  generateScript, 
  downloadScript, 
  getScriptExtension,
  getScriptInstructions,
  ScriptType 
} from '@/lib/scriptGenerator'
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

export function AutomationDialog({ item, open, onOpenChange }: AutomationDialogProps) {
  const [scriptType, setScriptType] = useState<ScriptType>(() => detectScriptType())
  const [scriptFormat, setScriptFormat] = useState<'file' | 'inline'>('file')  // 腳本格式：檔案執行 / 複製貼上
  const [targetPaths, setTargetPaths] = useState<string[]>([])
  const [generatedScript, setGeneratedScript] = useState('')

  // 開啟時重置狀態（包含恢復為偵測到的平台）
  useEffect(() => {
    if (open) {
      setScriptType(detectScriptType())
      setScriptFormat('file')  // 預設為檔案執行版
      setTargetPaths([])
      setGeneratedScript('')
    }
  }, [open])

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
    const iconPath = `/path/to/${item.name}.${format}`
    const script = generateScript({
      targetPaths,
      format,
      iconPath,
      isInlineMode: scriptFormat === 'inline'  // 傳入格式選項
    }, scriptType)

    setGeneratedScript(script)
    toast.success('腳本已生成')
  }

  const handleCopyScript = () => {
    if (generatedScript) {
      navigator.clipboard.writeText(generatedScript)
      toast.success('已複製到剪貼簿')
    }
  }

  const handleDownloadScript = () => {
    if (generatedScript) {
      const extension = getScriptExtension(scriptType)
      downloadScript(generatedScript, `${item.name}_automation.${extension}`)
      toast.success('腳本已下載')
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
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

        {/* 表單內容放在 Tabs 外面，避免 TabsContent 動態渲染問題 */}
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-semibold">圖示檔案</Label>
              <Badge variant="secondary" className="text-xs">
                推薦: {getRecommendedFormat(scriptType).toUpperCase()}
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

          {/* 腳本格式選擇（僅 PowerShell）*/}
          {scriptType === 'powershell' && (
            <div className="flex items-center justify-between p-2.5 bg-secondary/10 rounded-lg border border-border">
              <Label className="text-xs text-muted-foreground">腳本格式</Label>
              <Tabs value={scriptFormat} onValueChange={(v) => setScriptFormat(v as 'file' | 'inline')} className="h-auto">
                <TabsList className="h-8">
                  <TabsTrigger value="file" className="text-xs h-7">檔案執行</TabsTrigger>
                  <TabsTrigger value="inline" className="text-xs h-7">複製貼上</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          )}

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
              <ScrollArea className="h-64 w-full rounded-lg border border-border bg-muted/30">
                <pre className="p-4 text-xs font-mono">
                  <code>{generatedScript}</code>
                </pre>
              </ScrollArea>

              <div className="flex gap-2">
                <Button onClick={handleCopyScript} variant="outline" className="flex-1 gap-2" type="button">
                  <Copy size={16} />
                  複製腳本
                </Button>
                <Button onClick={handleDownloadScript} className="flex-1 gap-2" type="button">
                  <Download size={16} />
                  下載腳本
                </Button>
              </div>

              <div className="p-3 bg-accent/10 rounded-lg border border-accent/20">
                <p className="text-xs font-semibold text-accent-foreground mb-1">使用說明:</p>
                <p className="text-xs text-muted-foreground whitespace-pre-line">
                  {getScriptInstructions(scriptType)}
                </p>
              </div>
            </motion.div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
