import { motion } from "framer-motion";
import { Folder, Info } from "@phosphor-icons/react";
import { Card } from "@/components/ui/card";
import { MascotDisplay } from "./MascotDisplay";

interface DragInstructionsProps {
  mascotType?: 'bot' | 'hero' | 'abstract'
}

export function DragInstructions({ mascotType = 'bot' }: DragInstructionsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-3 relative"
    >


      <Card className="bg-primary/5 border-primary/20 p-4">
        <div className="flex items-start gap-3">
          <Folder
            size={20}
            weight="fill"
            className="text-primary flex-shrink-0 mt-0.5"
          />
          <div className="flex-1 min-w-0 space-y-2">
            <h3 className="text-sm font-semibold text-foreground">
              Windows 資料夾圖示替換步驟：
            </h3>
            <ol className="text-xs text-muted-foreground space-y-1.5 list-decimal list-inside">
              <li className="leading-relaxed">
                <span className="font-medium text-foreground">
                  拖曳 ICO 檔案
                </span>
                ：長按 ICO 按鈕並拖曳至目標資料夾中
              </li>
              <li className="leading-relaxed">
                <span className="font-medium text-foreground">
                  開啟資料夾屬性
                </span>
                ：在資料夾上按右鍵 → 選擇「內容」
              </li>
              <li className="leading-relaxed">
                <span className="font-medium text-foreground">自訂圖示</span>
                ：點選「自訂」標籤 → 點擊「變更圖示」
              </li>
              <li className="leading-relaxed">
                <span className="font-medium text-foreground">
                  選擇圖示檔案
                </span>
                ：點擊「瀏覽」→ 選擇剛拖入的 .ico 檔案 → 確定
              </li>
            </ol>
            <div className="flex items-start gap-2 mt-3 pt-3 border-t border-border/50">
              <Info
                size={14}
                weight="fill"
                className="text-accent flex-shrink-0 mt-0.5"
              />
              <p className="text-xs text-muted-foreground leading-relaxed">
                <span className="font-medium text-accent-foreground">
                  提示：
                </span>
                ICO 格式最適合 Windows 系統，PNG 格式適用於大部分應用程式，ICNS
                格式專為 macOS 設計
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* MASCOT DISPLAY - Overlapping Effect */}
      <div className="absolute -bottom-8 -right-8 z-20 pointer-events-none scale-75 sm:scale-100">
        <MascotDisplay
          type={mascotType}
          state="idle"
          className="drop-shadow-2xl"
        />
      </div>
    </motion.div >
  );
}
