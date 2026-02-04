# 更新摘要 - 自動化腳本與拖曳追蹤功能

## 新增功能

### 1. 自動化腳本生成器
**檔案**: `src/lib/scriptGenerator.ts`, `src/components/AutomationDialog.tsx`

為已完成的圖示轉換項目生成平台專屬的自動化腳本：

- **Windows PowerShell** (.ps1): 自動設定 desktop.ini 並套用 ICO 圖示至多個資料夾
- **macOS AppleScript** (.scpt): 使用 Finder 批次設定 ICNS 圖示
- **Linux Bash** (.sh): 建立 .directory 檔案並設定 PNG 圖示

**特色**:
- 視覺化平台選擇（Windows/macOS/Linux 標誌）
- 支援拖放資料夾路徑至對話框
- 即時生成腳本預覽
- 一鍵複製或下載腳本
- 包含平台專屬的使用說明

### 2. 拖曳視覺追蹤系統
**檔案**: `src/components/DragTrackingOverlay.tsx`

在使用者拖曳圖示檔案時提供即時視覺回饋：

- **動畫軌跡**: 15 幀的半透明圓形軌跡追隨滑鼠移動
- **旋轉十字準心**: 持續旋轉的瞄準圖示
- **檔案名稱顯示**: 浮動顯示正在拖曳的檔案名稱
- **頂部提示**: 顯示「拖曳至目標位置以套用圖示」的提示

**互動流程**:
1. 使用者點擊並拖曳格式按鈕（PNG/ICO/ICNS）
2. 追蹤覆蓋層自動啟動
3. 顯示即時滑鼠軌跡與檔案資訊
4. 釋放滑鼠後自動關閉

### 3. 增強的拖曳功能整合
**更新檔案**: `src/App.tsx`, `src/components/WorkspaceQueue.tsx`, `src/components/WorkspaceQueueItem.tsx`

**變更**:
- 新增拖曳狀態管理（`isDraggingFile`, `draggedFileName`）
- 新增自動化對話框狀態（`automationItem`, `showAutomation`）
- 在每個完成項目新增「自動化腳本」按鈕（代碼圖示）
- 將拖曳事件回調傳遞至子元件
- 整合 DragTrackingOverlay 組件

## 使用者體驗改善

### 視覺設計
- 保持現有的紫藍色主題
- 自動化對話框使用分頁式平台選擇
- 拖曳覆蓋層使用青藍色調（accent color）以區別主要操作

### 互動流程
1. **標準下載**: 點擊格式按鈕直接下載檔案
2. **拖曳套用**: 按住格式按鈕並拖曳至系統資料夾（顯示追蹤動畫）
3. **批次自動化**: 點擊自動化按鈕→選擇平台→新增路徑→生成腳本→執行

### 技術整合
- 完全整合至現有的 Shadcn UI 元件生態系統
- 使用 Framer Motion 提供流暢動畫
- TypeScript 型別完整定義
- 回應式設計支援行動裝置

## 檔案結構

```
src/
├── lib/
│   └── scriptGenerator.ts          # 腳本生成邏輯（新增）
├── components/
│   ├── AutomationDialog.tsx        # 自動化對話框（新增）
│   ├── DragTrackingOverlay.tsx     # 拖曳追蹤覆蓋層（新增）
│   ├── WorkspaceQueue.tsx          # 更新：傳遞新回調
│   ├── WorkspaceQueueItem.tsx      # 更新：自動化按鈕與拖曳事件
│   └── ...
└── App.tsx                          # 更新：整合新功能

PRD.md                               # 更新：記錄新功能
README.md                            # 更新：完整功能說明
index.html                           # 更新：標題文字
```

## 測試建議

1. **腳本生成**:
   - 測試三種平台的腳本生成
   - 驗證路徑拖放功能
   - 確認腳本複製與下載

2. **拖曳追蹤**:
   - 測試拖曳時覆蓋層的顯示
   - 驗證軌跡動畫流暢度
   - 確認拖曳結束後正確關閉

3. **整體流程**:
   - 上傳圖示 → 轉換 → 點擊自動化 → 生成腳本
   - 上傳圖示 → 轉換 → 拖曳檔案（觀察追蹤效果）

## 相容性

- ✅ React 19
- ✅ TypeScript 5.7
- ✅ Tailwind CSS 4
- ✅ Shadcn UI v4
- ✅ Framer Motion 12
- ✅ 所有現代瀏覽器（Chrome, Firefox, Safari, Edge）

## 後續建議

1. 新增拖曳目標區域高亮顯示
2. 增強腳本生成選項（如遞迴處理子資料夾）
3. 在佇列項目中顯示圖示縮圖預覽
4. 支援更多作業系統（如 FreeBSD）
5. 提供腳本執行結果驗證功能
