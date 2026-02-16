# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Icon Hero** - 專業的圖示轉換與自動化工具，支援多種格式轉換（PNG/ICO/ICNS）及跨平台腳本生成。

**Tech Stack**: React 19 + TypeScript + Vite + Tailwind CSS 4 + Shadcn UI + Framer Motion

## Development Commands

```bash
# 啟動開發伺服器 (http://localhost:5173)
npm run dev

# 建置專案 (輸出至 dist/)
npm run build

# 執行 ESLint 檢查
npm run lint

# 預覽建置結果
npm run preview

# 清除並重新優化依賴項
npm run optimize
```

## Architecture

### Core Flow
1. **上傳/URL 輸入** → 2. **分析檔案** (`workspaceAnalyzer.ts`) → 3. **轉換格式** (`iconConverter.ts`) → 4. **顯示於工作區**

### Key Modules

#### State Management (App.tsx)
- 集中式狀態管理：`workspaceItems[]` 追蹤所有轉換項目
- 每個項目包含：原始檔案、轉換狀態（pending/analyzing/converting/completed/error）、三種格式的 URL 與 Blob
- 使用 `useCallback` 與 `useEffect` 處理拖曳事件與全域清理

#### Icon Conversion Pipeline (src/lib/)
- **workspaceAnalyzer.ts**: 分析上傳檔案或 URL，解析 favicon、Open Graph 圖片
- **iconConverter.ts**: 使用 Canvas API 轉換圖示為 PNG/ICO/ICNS
- **scriptGenerator.ts**: 生成跨平台腳本（對話框模式，支援 inline/file 兩種模式）
- **iconApplyPackager.ts**: 打包圖示+腳本為 ZIP（一鍵下載模式，包含路徑正規化與模糊搜尋）

#### Component Architecture
- **WorkspaceDropZone**: 拖放區域 + Mascot 動畫（bot/hero 雙主題）
- **WorkspaceQueue**: 處理佇列容器，包含 "Clear Completed" 功能
- **WorkspaceQueueItem**: 單一轉換項目，支援預覽/下載/自動化/拖曳
- **AutomationDialog**: 舊版腳本生成器（複製/下載分離，手動輸入路徑）
- **ApplyIconDialog**: 新版一鍵打包器（拖曳路徑輸入，ZIP 下載）
- **DragTrackingOverlay**: 全域拖曳軌跡動畫（Canvas 繪製）

### Dual Theme System
- **Neon Forge (暗色)**: 紫藍漸層 + 機器人 Mascot
- **Creative Studio (亮色)**: 橙紅漸層 + 英雄 Mascot
- 主題切換同時影響 Mascot 類型與色彩變數

### Drag & Drop System
- **全域拖曳清理**: 監聽 `dragend`, `mouseup`, `blur` 事件重置 pointer-events
- **自訂拖曳預覽**: 透過 `setDragImage` 顯示檔名 + 格式資訊
- **檔案系統整合**: 使用 `DataTransfer.setData('DownloadURL')` 支援直接拖曳至檔案總管

### Script Generation Features
兩種腳本系統並存：

1. **AutomationDialog** (scriptGenerator.ts):
   - 支援 PowerShell / AppleScript / Bash
   - `isInlineMode` 參數控制是否包含暫停指令（複製貼上版 vs 檔案執行版）
   - 腳本功能：路徑正規化、環境變數展開、模糊搜尋

2. **ApplyIconDialog** (iconApplyPackager.ts):
   - 整合圖示 + 腳本 + README 為 ZIP
   - FolderPathInput 元件支援拖曳資料夾取得路徑
   - 自動依平台選擇推薦格式（Windows=ICO, macOS=ICNS, Linux=PNG）

## Important Patterns

### File Processing Pipeline
```typescript
// 所有圖示都經過完整轉換流程
for (const targetFormat of ['png', 'ico', 'icns']) {
  const result = await convertIcon(analyzed.url, targetFormat)
  // 儲存 URL 與 Blob（用於拖曳與下載）
}
```

### Status Progression
`pending` → `analyzing` → `converting` (per format) → `completed` / `error`

### Drag Event Lifecycle
1. `handleFileDragStart(fileName)` - 設定全域狀態
2. DragTrackingOverlay 顯示軌跡動畫
3. `handleFileDragEnd()` - 清理狀態
4. 全域事件監聽器確保狀態重置

## UI Component Library

使用 **Shadcn UI v4** (Radix UI primitives)：
- Dialog, Button, Input, Progress 等元件位於 `src/components/ui/`
- 透過 `cn()` utility (tailwind-merge) 合併 className
- 使用 Tailwind CSS 4 變數系統 (不再需要 @apply)

## File Naming Conventions

- 元件檔案：PascalCase (e.g., `WorkspaceDropZone.tsx`)
- Utility 模組：camelCase (e.g., `scriptGenerator.ts`)
- 類型定義：通常內嵌於檔案頂部或 `src/types/`

## Platform-Specific Notes

### Windows (PowerShell)
- 使用 `desktop.ini` + `IconResource` 屬性
- 需設定隱藏/系統屬性：`attrib +h +s`
- 執行政策可能需要 `Set-ExecutionPolicy RemoteSigned`

### macOS (Bash/AppleScript)
- 優先使用 `fileicon` CLI，fallback 至 `osascript` + AppKit framework
- `.command` 副檔名可雙擊執行
- 需 `chmod +x` 賦予執行權限

### Linux (Bash)
- 使用 `gio set metadata::custom-icon`
- 需安裝 `gvfs` 套件
- `.sh` 腳本需手動執行

## Path Normalization Strategy (iconApplyPackager.ts)

所有平台腳本都包含：
1. **環境變數展開**: `%USERPROFILE%` (Windows) / `~` (Unix)
2. **斜線正規化**: `/` → `\` (Windows)
3. **模糊搜尋**: 路徑不存在時，在上層目錄不區分大小寫搜尋
4. **錯誤預判**: 區分「不是資料夾」與「路徑不存在」

## Known Limitations

- ICO 轉換限制為 256x256（瀏覽器 Canvas API 限制）
- ICNS 格式實際為 PNG 包裝（需依賴 macOS 系統自動處理）
- 拖曳至檔案總管功能依賴瀏覽器支援 `DownloadURL` 格式（Chromium-based 較佳）
