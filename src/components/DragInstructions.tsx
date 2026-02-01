import { motion } from 'framer-motion'
import { HandGrabbing, ArrowRight, Desktop } from '@phosphor-icons/react'
import { Alert, AlertDescription } from '@/components/ui/alert'

export function DragInstructions() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
    >
      <Alert className="bg-accent/10 border-accent/20">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-accent-foreground">
            <HandGrabbing size={20} weight="fill" className="flex-shrink-0" />
            <ArrowRight size={16} weight="bold" className="flex-shrink-0" />
            <Desktop size={20} weight="fill" className="flex-shrink-0" />
          </div>
          <AlertDescription className="text-sm">
            <span className="font-semibold">拖曳功能啟用：</span>
            長按格式按鈕（PNG / ICO / ICNS）並拖曳至系統檔案或資料夾，即可替換該目標的圖示
          </AlertDescription>
        </div>
      </Alert>
    </motion.div>
  )
}
