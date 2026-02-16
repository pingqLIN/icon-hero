# move2.MD — 吉祥物動態遷移開發文檔（第二階段）

> **目標**：當使用者完成圖示轉換後，吉祥物從上方拖放區「消失」，改以新的「向下看」姿態出現在「已完成」區塊上方，視線引導使用者點擊下載按鈕。

---

## 📌 當前狀態 (Current State)

### 吉祥物位置

- **初始**：吉祥物位於 `WorkspaceDropZone`（拖放區），根據 `hasCompletedItems` 條件決定顯示/隱藏。
- **問題**：轉換成功後，吉祥物消失了，但**沒有**正確出現在「已完成」區塊上方。之前錯誤地放在 `DragInstructions` 元件中（已移除）。

### 現有圖檔（`src/assets/`）

| 檔案名稱               | 用途                 | 動作     |
| ---------------------- | -------------------- | -------- |
| `mascot_tech_rbot.png` | Neon Forge 主題      | 正面懸浮 |
| `mascot_hero_tool.png` | Creative Studio 主題 | 正面飛行 |
| `ICONHERO.png`         | 頁首 Logo            | —        |

### 缺少的圖檔（需生成）

| 檔案名稱                         | 用途                         | 動作描述                                                     |
| -------------------------------- | ---------------------------- | ------------------------------------------------------------ |
| `mascot_tech_rbot_look_down.png` | Neon Forge / 已完成狀態      | **同一角色**，身體前傾，視線朝下方看，像在觀察下方的按鈕區域 |
| `mascot_hero_tool_look_down.png` | Creative Studio / 已完成狀態 | **同一角色**，俯身向下看，一手指向下方，表情鼓勵使用者點擊   |

---

## 🎯 預期效果 (Expected Behavior)

### 流程

```
[使用者拖入檔案] → 吉祥物在拖放區（正面姿態）
         ↓
[轉換成功] → 拖放區吉祥物消失（顯示資料夾圖示）
         ↓
[已完成區塊頂部] → 吉祥物出現（「向下看」姿態）
                   視線朝下 → 指向下載按鈕
```

### 位置示意圖

```
┌──────────────────────────────────────────┐
│  處理佇列                                │
│  ┌────────────────────────────────────┐  │
│  │ 清除已完成  ┊  批次下載           │  │
│  └────────────────────────────────────┘  │
│                                          │
│  ┌── 已完成 ─────────────────────────┐  │
│  │                    ┌───────────┐   │  │
│  │                    │ 吉祥物     │   │  │  ← mascot_*_look_down.png
│  │                    │ (向下看↓)  │   │  │     absolute positioned
│  │  ┌─────────────────┤───────────┤─┐│  │     right: -16px, top: -40px
│  │  │ icon.png ✅     │ 👁 📂 💻 ↓PNG ↓ICO ↓ICNS │  │  │     z-index: 20
│  │  └─────────────────┴───────────┴─┘│  │
│  │                                    │  │
│  │  ┌───────────────────────────────┐│  │
│  │  │ logo.png ✅    👁 📂 💻 ↓PNG ↓ICO │  │
│  │  └───────────────────────────────┘│  │
│  └────────────────────────────────────┘  │
└──────────────────────────────────────────┘
```

> **關鍵**：吉祥物的身體從「已完成」區塊的邊框上方「穿透」進入卡片內，產生遮罩（overlap / mask）效果。  
> 半個身體在框外，半個在框內。`overflow: hidden` 負責裁切。

---

## 🔧 實作細節 (Implementation Details)

### 步驟 1：生成新圖檔

使用 `generate_image` 工具生成兩張新圖片，放入 `src/assets/`：

#### Tech-Bot Look Down

```
Prompt: Same small sphere robot (Tech-Bot) character with matte black body,
glowing cyan eye screen, and neon orange accents. The robot is tilted forward
at a 30° angle, LOOKING DOWNWARDS at the bottom of the frame. Its single
digital eye is angled down. It appears to be observing or presenting something
below it. Transparent/white background, high quality 3D render.
```

#### Tool Hero Look Down

```
Prompt: Same personified pencil tool character (Tool Hero) with a royal blue
cape and sunny yellow body. The character is hovering/flying, leaning forward
and LOOKING DOWN at the bottom of the frame. One hand reaches out pointing
downward in a presenting gesture. Expression is friendly and encouraging.
Transparent/white background, high quality 3D render.
```

生成後放入：

```
src/assets/mascot_tech_rbot_look_down.png
src/assets/mascot_hero_tool_look_down.png
```

---

### 步驟 2：修改 `MascotDisplay.tsx`

新增 `variant` prop 支援「向下看」圖片：

```diff
+ import techBotLookDownImage from '@/assets/mascot_tech_rbot_look_down.png'
+ import heroToolLookDownImage from '@/assets/mascot_hero_tool_look_down.png'

  type MascotType = 'bot' | 'hero' | 'abstract'
  type MascotState = 'idle' | 'processing' | 'success' | 'error'
+ type MascotVariant = 'default' | 'lookDown'

  interface MascotDisplayProps {
    type?: MascotType
    state?: MascotState
    className?: string
+   variant?: MascotVariant
  }

- export function MascotDisplay({ type = 'bot', state = 'idle', className = '' }: MascotDisplayProps) {
+ export function MascotDisplay({ type = 'bot', state = 'idle', className = '', variant = 'default' }: MascotDisplayProps) {

  // renderBot()
- src={techBotImage}
+ src={variant === 'lookDown' ? techBotLookDownImage : techBotImage}

  // renderHero()
- src="/src/assets/mascot_hero_tool.png"
+ src={variant === 'lookDown' ? heroToolLookDownImage : heroToolImage}
```

> **注意**：`renderHero()` 目前使用的是硬編碼路徑 `"/src/assets/mascot_hero_tool.png"`（第 52 行），應同時修正為 `import` 方式，與 `renderBot()` 一致。

---

### 步驟 3：修改 `WorkspaceQueue.tsx`

在「已完成」區塊 (L215-245) 加入吉祥物：

```diff
+ import { MascotDisplay } from './MascotDisplay'

  interface WorkspaceQueueProps {
    // ...existing props
+   mascotType?: 'bot' | 'hero' | 'abstract'
  }

  // 在 completedItems section (L215-245)，外層包一個 relative container:

  {completedItems.length > 0 && (
-   <>
-     <div>
+   <div className="relative">
+     {/* 吉祥物 - 向下看，遮罩穿透效果 */}
+     <div className="absolute -top-10 -right-4 z-20 pointer-events-none">
+       <MascotDisplay
+         type={mascotType}
+         state="success"
+         variant="lookDown"
+         className="drop-shadow-2xl w-32 h-32"
+       />
+     </div>
+
+     <div className="overflow-hidden rounded-xl border border-primary/20 p-4">
        <h3 className="text-sm font-semibold mb-3 text-muted-foreground">已完成</h3>
        <ScrollArea className="h-auto max-h-[600px]">
          {/* ...existing completed items... */}
        </ScrollArea>
+     </div>
-   </>
+   </div>
  )}
```

#### CSS 定位說明

| 屬性             | 值                   | 說明                       |
| ---------------- | -------------------- | -------------------------- |
| `position`       | `absolute`           | 脫離文件流，浮在卡片上方   |
| `top`            | `-10` (即 `-2.5rem`) | 讓吉祥物上半身突出卡片上方 |
| `right`          | `-4` (即 `-1rem`)    | 偏右，不擋住文字           |
| `z-index`        | `20`                 | 確保在卡片內容之上         |
| `pointer-events` | `none`               | 防止吉祥物攔截滑鼠事件     |

外層 `div.relative` 確保 `absolute` 定位相對於此容器。

---

### 步驟 4：更新 `App.tsx`

傳遞 `mascotType` 給 `WorkspaceQueue`：

```diff
  <WorkspaceQueue
    items={workspaceItems}
    onPreview={handlePreview}
    onDownload={handleDownload}
    onAutomation={handleAutomation}
    onApplyIcon={handleApplyIcon}
    onReorder={handleReorder}
    onClearCompleted={handleClearCompleted}
    onFileDragStart={handleFileDragStart}
    onFileDragEnd={handleFileDragEnd}
+   mascotType={theme === 'dark' ? 'bot' : 'hero'}
  />
```

---

### 步驟 5：驗證

```bash
npm run build   # 確認無編譯錯誤
npm run dev      # 開啟瀏覽器驗證
```

#### 驗證清單

- [ ] 初始畫面：吉祥物在拖放區（正面姿態）
- [ ] 拖入檔案後轉換完成：拖放區改顯示資料夾圖示
- [ ] 「已完成」區塊出現吉祥物（向下看姿態）
- [ ] 吉祥物身體上半部分突出卡片邊界（遮罩效果）
- [ ] 切換主題：吉祥物隨主題切換（科技寶 ↔ 工具英雄）
- [ ] 下載按鈕仍正常可點擊（`pointer-events: none` 在吉祥物上）

---

## 📁 受影響的檔案清單

| 檔案                                        | 動作     | 說明                                       |
| ------------------------------------------- | -------- | ------------------------------------------ |
| `src/assets/mascot_tech_rbot_look_down.png` | **新增** | Tech-Bot 向下看變體                        |
| `src/assets/mascot_hero_tool_look_down.png` | **新增** | Tool Hero 向下看變體                       |
| `src/components/MascotDisplay.tsx`          | **修改** | 新增 `variant` prop、修正 hero 圖片 import |
| `src/components/WorkspaceQueue.tsx`         | **修改** | 在完成區加入吉祥物、新增 `mascotType` prop |
| `src/App.tsx`                               | **修改** | 傳遞 `mascotType` 給 WorkspaceQueue        |

---

## ⚠️ 注意事項

1. **圖片一致性**：新生成的 look down 圖片必須保持與原角色相同的造型、配色和風格，只改變姿勢和視線方向。
2. **Import 修正**：`MascotDisplay.tsx` 第 52 行的 `renderHero()` 目前使用硬編碼路徑，需改為 `import heroToolImage` 的方式（已在步驟 2 中說明）。
3. **動畫調整**：look down 版本的動畫可以減弱懸浮幅度（例如 `y: [0, -5, 0]`），讓角色看起來更穩定、更專注於「指引」。
