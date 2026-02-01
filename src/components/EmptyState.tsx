import { UploadSimple, Image, CircleNotch } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'

interface EmptyStateProps {
  onUploadClick: () => void
  isProcessing?: boolean
}

export function EmptyState({ onUploadClick, isProcessing = false }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-24 px-8">
      <div className="relative mb-6">
        <div className="w-24 h-24 rounded-full bg-secondary flex items-center justify-center">
          <Image size={48} className="text-muted-foreground" />
        </div>
        <div className="absolute -bottom-1 -right-1 w-10 h-10 rounded-full bg-accent flex items-center justify-center">
          {isProcessing ? (
            <CircleNotch size={20} weight="bold" className="text-accent-foreground animate-spin" />
          ) : (
            <UploadSimple size={20} weight="bold" className="text-accent-foreground" />
          )}
        </div>
      </div>
      
      <h3 className="text-xl font-bold mb-2">尚未載入圖檔</h3>
      <p className="text-muted-foreground text-center max-w-sm mb-6">
        上傳圖檔後即可立即拖曳到系統上進行圖示更換，或轉換為其他格式 (PNG, ICO, ICNS)。
      </p>
      
      <Button onClick={onUploadClick} size="lg" className="gap-2" disabled={isProcessing}>
        <UploadSimple size={20} />
        {isProcessing ? '處理中...' : '選擇圖檔'}
      </Button>
    </div>
  )
}
