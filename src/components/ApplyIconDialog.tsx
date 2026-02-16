import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FolderOpen,
  WindowsLogo,
  AppleLogo,
  LinuxLogo,
  Download,
  Package,
  Info
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
import {
  createApplyPackage,
  getRecommendedFormat,
  ApplyPlatform
} from '@/lib/iconApplyPackager'
import { toast } from 'sonner'

interface ApplyIconDialogProps {
  item: WorkspaceItem | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

/**
 * 「一鍵套用圖示到資料夾」對話框
 * 使用者選擇平台、輸入目標路徑，一鍵下載安裝包 ZIP
 */
export function ApplyIconDialog({ item, open, onOpenChange }: ApplyIconDialogProps) {
  const [platform, setPlatform] = useState<ApplyPlatform>('windows')
  const [targetPaths, setTargetPaths] = useState<string[]>([])
  const [isPackaging, setIsPackaging] = useState(false)

  // 自動偵測平台
  useEffect(() => {
    const ua = navigator.userAgent.toLowerCase()
    if (ua.includes('mac')) {
      setPlatform('macos')
    } else if (ua.includes('linux')) {
      setPlatform('linux')
    } else {
      setPlatform('windows')
    }
  }, [])

  // 開啟時重置
  useEffect(() => {
    if (open) {
      setTargetPaths([])
      setIsPackaging(false)
    }
  }, [open])

  if (!item || item.status !== 'completed') return null

  const recommendedFormat = getRecommendedFormat(platform)
  const hasIcon = item.convertedBlobs?.[recommendedFormat]

  const handleDownloadPackage = async () => {
    if (targetPaths.length === 0) {
      toast.error('請至少新增一個目標資料夾路徑')
      return
    }

    const iconBlob = item.convertedBlobs?.[recommendedFormat]
    if (!iconBlob) {
      toast.error(`找不到 ${recommendedFormat.toUpperCase()} 格式的圖示檔案`)
      return
    }

    setIsPackaging(true)

    try {
      await createApplyPackage({
        iconBlob,
        iconName: item.name,
        targetPaths,
        platform
      })

      toast.success('安裝包已下載！', {
        description: '解壓縮後執行腳本即可套用圖示'
      })

      onOpenChange(false)
    } catch (error) {
      toast.error('打包失敗', {
        description: error instanceof Error ? error.message : '未知錯誤'
      })
    } finally {
      setIsPackaging(false)
    }
  }

  // 各平台的使用說明（精簡版）
  const platformTips: Record<ApplyPlatform, { steps: string[]; script: string }> = {
    windows: {
      steps: [
        '解壓縮下載的 ZIP',
        '右鍵「apply-icon.ps1」→ 以 PowerShell 執行',
        '圖示會自動套用到所有目標資料夾'
      ],
      script: 'apply-icon.ps1'
    },
    macos: {
      steps: [
        '解壓縮下載的 ZIP',
        '雙擊「apply-icon.command」',
        '首次可能需在「系統偏好 → 安全性」允許'
      ],
      script: 'apply-icon.command'
    },
    linux: {
      steps: [
        '解壓縮下載的 ZIP',
        '終端機執行 chmod +x apply-icon.sh',
        '執行 ./apply-icon.sh'
      ],
      script: 'apply-icon.sh'
    }
  }

  const tips = platformTips[platform]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FolderOpen size={24} weight="fill" className="text-primary" />
            一鍵套用圖示到資料夾
          </DialogTitle>
          <DialogDescription>
            下載安裝包，解壓縮後執行腳本即可自動替換資料夾圖示
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5">
          {/* Step 1: 選擇平台 */}
          <div className="space-y-2">
            <Label className="text-sm font-semibold flex items-center gap-2">
              <Badge variant="secondary" className="text-[10px] px-1.5 py-0 font-mono">1</Badge>
              選擇作業系統
            </Label>
            <Tabs value={platform} onValueChange={(v) => setPlatform(v as ApplyPlatform)}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="windows" className="gap-2">
                  <WindowsLogo size={16} weight="fill" />
                  Windows
                </TabsTrigger>
                <TabsTrigger value="macos" className="gap-2">
                  <AppleLogo size={16} weight="fill" />
                  macOS
                </TabsTrigger>
                <TabsTrigger value="linux" className="gap-2">
                  <LinuxLogo size={16} weight="fill" />
                  Linux
                </TabsTrigger>
              </TabsList>
            </Tabs>

            {/* 圖示檔案資訊 */}
            <div className="flex items-center justify-between p-2.5 bg-secondary/20 rounded-lg border border-border">
              <span className="text-xs text-muted-foreground">圖示檔案</span>
              <span className="text-xs font-mono font-semibold">
                {item.name}.{recommendedFormat}
              </span>
              {!hasIcon && (
                <Badge variant="destructive" className="text-[10px] px-1.5 py-0">
                  格式不可用
                </Badge>
              )}
            </div>
          </div>

          {/* Step 2: 目標資料夾 */}
          <div className="space-y-2">
            <Label className="text-sm font-semibold flex items-center gap-2">
              <Badge variant="secondary" className="text-[10px] px-1.5 py-0 font-mono">2</Badge>
              新增目標資料夾路徑
            </Label>
            <FolderPathInput
              paths={targetPaths}
              onPathsChange={setTargetPaths}
              placeholder={
                platform === 'windows'
                  ? 'C:\\Users\\Username\\Desktop\\MyFolder'
                  : platform === 'macos'
                  ? '/Users/username/Desktop/MyFolder'
                  : '/home/username/Desktop/MyFolder'
              }
            />
          </div>

          {/* Step 3: 下載 */}
          <div className="space-y-3">
            <Label className="text-sm font-semibold flex items-center gap-2">
              <Badge variant="secondary" className="text-[10px] px-1.5 py-0 font-mono">3</Badge>
              下載安裝包
            </Label>

            <Button
              onClick={handleDownloadPackage}
              className="w-full gap-2 h-11"
              disabled={targetPaths.length === 0 || !hasIcon || isPackaging}
              size="lg"
            >
              {isPackaging ? (
                <>
                  <Package size={18} className="animate-spin" />
                  正在打包...
                </>
              ) : (
                <>
                  <Download size={18} weight="bold" />
                  下載安裝包（{recommendedFormat.toUpperCase()} + 腳本）
                </>
              )}
            </Button>

            {/* 使用說明 */}
            <div className="p-3 bg-accent/10 rounded-lg border border-accent/20">
              <p className="text-xs font-semibold text-accent-foreground mb-2 flex items-center gap-1">
                <Info size={14} />
                下載後的使用步驟：
              </p>
              <ol className="text-xs text-muted-foreground space-y-1 list-decimal list-inside">
                {tips.steps.map((step, i) => (
                  <li key={i}>{step}</li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
