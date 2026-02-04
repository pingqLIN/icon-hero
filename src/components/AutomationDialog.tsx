import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Code, 
  WindowsLogo, 
  AppleLogo, 
  LinuxLogo, 
  Copy, 
  Download,
  Plus,
  X,
  FolderOpen,
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
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
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

export function AutomationDialog({ item, open, onOpenChange }: AutomationDialogProps) {
  const [scriptType, setScriptType] = useState<ScriptType>('powershell')
  const [targetPaths, setTargetPaths] = useState<string[]>([])
  const [newPath, setNewPath] = useState('')
  const [generatedScript, setGeneratedScript] = useState('')

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

  const handleAddPath = () => {
    if (newPath.trim() && !targetPaths.includes(newPath.trim())) {
      setTargetPaths([...targetPaths, newPath.trim()])
      setNewPath('')
    }
  }

  const handleRemovePath = (index: number) => {
    setTargetPaths(targetPaths.filter((_, i) => i !== index))
  }

  const handleGenerateScript = () => {
    if (targetPaths.length === 0) {
      toast.error('請至少新增一個目標路徑')
      return
    }

    const format = getRecommendedFormat(scriptType)
    const script = generateScript({
      type: scriptType,
      iconPath: `C:\\Icons\\${item.name}.${format}`,
      targetPaths,
      itemName: item.name,
      format
    })

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

  const handleDragPathDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const text = e.dataTransfer.getData('text/plain')
    if (text && text.trim() && !targetPaths.includes(text.trim())) {
      setTargetPaths([...targetPaths, text.trim()])
      toast.success('已新增路徑')
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh]">
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

          <TabsContent value={scriptType} className="space-y-4 mt-4">
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
              <div 
                className="space-y-2"
                onDrop={handleDragPathDrop}
                onDragOver={handleDragOver}
              >
                <div className="flex gap-2">
                  <Input
                    placeholder={
                      scriptType === 'powershell' 
                        ? 'C:\\Users\\Username\\Documents\\Folder'
                        : scriptType === 'applescript'
                        ? '/Users/username/Documents/Folder'
                        : '/home/username/Documents/Folder'
                    }
                    value={newPath}
                    onChange={(e) => setNewPath(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        handleAddPath()
                      }
                    }}
                    className="flex-1"
                  />
                  <Button onClick={handleAddPath} size="icon" variant="outline">
                    <Plus size={16} />
                  </Button>
                </div>
                <div className="text-xs text-muted-foreground flex items-center gap-1">
                  <FolderOpen size={14} />
                  提示: 可以從檔案總管拖曳資料夾至此處
                </div>

                {targetPaths.length > 0 && (
                  <ScrollArea className="h-32 w-full rounded-lg border border-border p-2 bg-secondary/10">
                    <div className="space-y-1">
                      {targetPaths.map((path, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 10 }}
                          className="flex items-center justify-between p-2 bg-background rounded border border-border group hover:border-primary transition-colors"
                        >
                          <span className="text-xs font-mono truncate flex-1">{path}</span>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => handleRemovePath(index)}
                          >
                            <X size={14} />
                          </Button>
                        </motion.div>
                      ))}
                    </div>
                  </ScrollArea>
                )}
              </div>
            </div>

            <Button 
              onClick={handleGenerateScript} 
              className="w-full gap-2"
              disabled={targetPaths.length === 0}
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
                  <Button onClick={handleCopyScript} variant="outline" className="flex-1 gap-2">
                    <Copy size={16} />
                    複製腳本
                  </Button>
                  <Button onClick={handleDownloadScript} className="flex-1 gap-2">
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
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
