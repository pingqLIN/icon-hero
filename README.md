<p align="center">
  <img src="src/assets/ICONHERO.png" width="120" alt="Icon Hero Logo">
</p>

<h1 align="center">ICON HERO</h1>

<p align="center">
  <b>Browser-based icon conversion &amp; automation toolkit</b><br>
  Convert any image to PNG · ICO · ICNS and automate icon replacement across platforms
</p>

<p align="center">
  <b>💡 100% client-side — your files never leave your browser.</b>
</p>

<p align="center">
  <a href="https://github.com/pingqLIN/icon-hero/actions/workflows/deploy.yml">
    <img src="https://github.com/pingqLIN/icon-hero/actions/workflows/deploy.yml/badge.svg" alt="Deploy">
  </a>
  <img src="https://img.shields.io/badge/React-19-61dafb?logo=react" alt="React 19">
  <img src="https://img.shields.io/badge/TypeScript-5.7-3178c6?logo=typescript" alt="TypeScript">
  <img src="https://img.shields.io/badge/Tailwind-4-06b6d4?logo=tailwindcss" alt="Tailwind CSS">
  <a href="LICENSE"><img src="https://img.shields.io/badge/License-MIT-green" alt="MIT License"></a>
</p>

<p align="center">
  <a href="https://github.colorgeek.co/icon-hero/">🌐 Live Demo</a> •
  <a href="#-features">Features</a> •
  <a href="#-how-to-use">How to Use</a> •
  <a href="#-architecture">Architecture</a> •
  <a href="#-platform-support">Platform Support</a> •
  <a href="README.zh-TW.md">中文版</a>
</p>

---

## ✨ Demo

<p align="center">
  <img src="docs/images/demo.gif" width="800" alt="Icon Hero Demo — upload, convert, download">
</p>

> Drag & drop any image, enter a URL, or paste from clipboard — ICON HERO automatically converts it to all three icon formats and generates ready-to-run automation scripts.

---

## ⚡ Features

- **Format Conversion** — Convert PNG, JPG, ICO, ICNS input → outputs all three formats (PNG + ICO + ICNS) simultaneously
- **Smart Input** — Upload files, drag & drop, paste from clipboard, or enter any website URL
- **URL Parsing** — Automatically extracts favicon and Open Graph images from any URL (best-effort; CORS/CSP may limit some sites)
- **Visual Drag & Drop** — Real-time trail animation as you drag converted icons to folders (Chromium-based browsers recommended)
- **Automation Scripts** — Generate PowerShell, Bash, and osascript scripts for bulk icon replacement
- **One-Click Packaging** — Bundle icon + script + README into a ZIP file
- **Batch Processing** — Handle multiple icons simultaneously in the workspace queue
- **Dual Theme** — Neon Forge (dark) and Creative Studio (light) with animated mascots

---

## 🎨 Dual Theme

<table>
  <tr>
    <td align="center" width="50%">
      <img src="docs/images/screenshot-light.png" alt="Creative Studio — Light Theme" width="420">
      <br><b>Creative Studio</b> — Light theme with Hero mascot
    </td>
    <td align="center" width="50%">
      <img src="docs/images/screenshot-dark.png" alt="Neon Forge — Dark Theme" width="420">
      <br><b>Neon Forge</b> — Dark theme with Robot mascot
    </td>
  </tr>
</table>

- **Neon Forge (dark)**: Purple-blue gradients + Robot mascot
- **Creative Studio (light)**: Orange-red gradients + Hero mascot
- Theme toggle simultaneously switches mascot type and color variables

---

## 🌍 Top 10 Icon Resources

<p align="center">
  <img src="docs/images/screenshot-icon-resources.png" width="900" alt="Top 10 icon resource cards in Icon Hero">
</p>

The workspace now includes a curated "Top 10 Icon Resources" section (right above the footer) for quick discovery and style comparison.

| Website | Icon Count | License | Highlight |
|---------|------------|---------|-----------|
| Flaticon | 22M+ | Free + Paid | Largest icon library |
| Icons8 | 1.5M+ | Free + Paid | Wide style coverage |
| The Noun Project | 5M+ | Free + Paid | Minimal design system |
| Iconfinder | 6M+ | Free + Paid | Premium-quality sets |
| Font Awesome | 30k+ | Free + Paid | Frontend classic |
| Phosphor Icons | 9k+ | Free | Used by this project |
| Heroicons | 300+ | Free | Official Tailwind icons |
| Lucide | 1.5k+ | Free | Active open-source community |
| Feather Icons | 287 | Free | Minimal open-source set |
| Material Icons | 2500+ | Free | Official Google set |

---

## 🗺️ How to Use

<p align="center">
  <img src="docs/images/workflow-diagram.svg" width="800" alt="4-step workflow: Upload → Analyze → Convert → Apply">
</p>

### Step-by-Step

**1. Input your icon**

```
Option A: Click "Select File" (選擇圖檔) to pick a local file
Option B: Click "Load from URL" (從 URL 載入) and paste any website URL
Option C: Drag & drop a file directly onto the workspace
Option D: Paste an image with ⌘/Ctrl + V
```

**2. Wait for auto-conversion** — the queue shows real-time progress

<p align="center">
  <img src="docs/images/screenshot-result.png" width="700" alt="Conversion result in queue with PNG/ICO/ICNS download buttons">
</p>

Status progression: `pending` → `analyzing` → `converting` (per format) → `completed` / `error`

**3. Download your icon**

| Action | How |
|--------|-----|
| Download single format | Click **PNG**, **ICO**, or **ICNS** button |
| Drag to folder | Long-press a format button and drag to any folder (Chromium only) |
| Batch download (ZIP) | Click **Batch Download** (批次下載) in the queue header |

**4. Generate automation script** — click the `</>` button on any queue item

<p align="center">
  <img src="docs/images/screenshot-automation.png" width="700" alt="Automation Script Generator dialog — Windows/macOS/Linux tabs">
</p>

```
① Select platform: Windows / macOS / Linux
② Enter target folder paths (supports drag & drop)
③ Click "Generate Script" (生成腳本) to preview
④ Copy and paste the script, or download as a file to run directly
```

> The generated scripts run **outside the browser** on your local machine. No server involved.

---

## 🏗️ Architecture

### Core Flow

```
1. Upload / URL Input
        ↓
2. workspaceAnalyzer.ts    ← Analyze files, extract favicon & Open Graph images
        ↓
3. iconConverter.ts        ← Canvas API → PNG / ICO / ICNS
        ↓
4. WorkspaceQueue          ← Real-time status display
        ↓
5. scriptGenerator.ts      ← PowerShell / Bash / osascript
   iconApplyPackager.ts    ← ZIP bundle (icon + script + README)
```

### State Management (App.tsx)

- Centralized state: `workspaceItems[]` tracks all conversion items
- Each item contains: original file, conversion status, URLs and Blobs for all three formats
- Uses `useCallback` and `useEffect` for drag events and global cleanup

### Icon Conversion Pipeline (`src/lib/`)

| Module | Responsibility |
|--------|---------------|
| **workspaceAnalyzer.ts** | Analyze uploaded files or URLs; parse favicon and Open Graph images |
| **iconConverter.ts** | Convert icons to PNG/ICO/ICNS via Canvas API |
| **scriptGenerator.ts** | Generate cross-platform scripts (dialog mode, inline/file variants) |
| **iconApplyPackager.ts** | Bundle icon + script into ZIP (one-click download with path normalization & fuzzy search) |

### Component Architecture

| Component | Role |
|-----------|------|
| **WorkspaceDropZone** | Drop zone + mascot animation (bot/hero dual themes) |
| **WorkspaceQueue** | Queue container with "Clear Completed" action |
| **WorkspaceQueueItem** | Single conversion item — preview, download, automation, drag |
| **AutomationDialog** | Legacy script generator (copy/download split, manual path input) |
| **ApplyIconDialog** | New one-click packager (drag-to-input paths, ZIP download) |
| **DragTrackingOverlay** | Global drag trail animation (Canvas-rendered) |

### Drag & Drop System

- **Global drag cleanup**: Listens to `dragend`, `mouseup`, `blur` events to reset pointer-events
- **Custom drag preview**: Uses `setDragImage` to show filename + format info
- **File system integration**: `DataTransfer.setData('DownloadURL')` enables dragging directly to file explorer

### Script Generation — Two Systems

Two script systems coexist:

1. **AutomationDialog** (`scriptGenerator.ts`):
   - Supports PowerShell / AppleScript / Bash
   - `isInlineMode` parameter controls pause instructions (copy-paste vs. file execution)
   - Features: path normalization, environment variable expansion, fuzzy search

2. **ApplyIconDialog** (`iconApplyPackager.ts`):
   - Bundles icon + script + README into a ZIP
   - FolderPathInput component supports drag-to-get folder path
   - Auto-selects recommended format per platform (Windows=ICO, macOS=ICNS, Linux=PNG)

### File Processing Pipeline

```typescript
// Every icon goes through the full conversion pipeline
for (const targetFormat of ['png', 'ico', 'icns']) {
  const result = await convertIcon(analyzed.url, targetFormat)
  // Store URL and Blob (for drag & download)
}
```

### Path Normalization Strategy (`iconApplyPackager.ts`)

All platform scripts include:
1. **Environment variable expansion**: `%USERPROFILE%` (Windows) / `~` (Unix)
2. **Slash normalization**: `/` → `\` (Windows)
3. **Fuzzy search**: When path doesn't exist, case-insensitive search in parent directory
4. **Error anticipation**: Distinguishes "not a folder" from "path doesn't exist"

---

## 🖥️ Platform Support

| Platform | Format | Script | Method |
|----------|--------|--------|--------|
| **Windows** | ICO | PowerShell | `desktop.ini` + `IconResource` |
| **macOS** | ICNS | Bash + osascript | `fileicon` CLI or `osascript` fallback |
| **Linux** | PNG | Bash | `gio set metadata::custom-icon` (GNOME/Nautilus) |

### Platform Notes

- **Windows**: Uses `desktop.ini` + `IconResource`. Requires hidden/system attributes (`attrib +h +s`). PowerShell execution policy must allow scripts (`Set-ExecutionPolicy RemoteSigned`).
- **macOS**: Tries `fileicon` CLI first (`brew install fileicon`); falls back to `osascript` + AppKit framework. `.command` extension allows double-click execution. Requires `chmod +x`.
- **Linux**: Uses `gio set metadata::custom-icon`. Requires `gvfs` package. `.sh` scripts must be run manually.

### Script Features

- **Path normalization** — Handles `%USERPROFILE%`, `~`, mixed slashes
- **Fuzzy search** — Locates folders even with minor path mismatches
- **Batch apply** — Set multiple target paths at once
- **Two modes** — Copy-paste version (with pause) vs. downloadable file version (runs directly)

### Browser Compatibility

| Feature | Chrome/Edge | Firefox | Safari |
|---------|-------------|---------|--------|
| Format conversion | ✅ | ✅ | ✅ |
| URL favicon fetch | ✅ | ✅ | ✅ |
| Drag-to-folder download | ✅ | ❌ | ❌ |
| Clipboard paste | ✅ | ✅ | ✅ |

---

## 🛠️ Tech Stack

| Category | Technology |
|----------|-----------|
| Framework | React 19 + TypeScript |
| Build | Vite 7 |
| UI Components | Shadcn UI v4 (Radix UI primitives) |
| Styling | Tailwind CSS 4 (CSS variable system) |
| Animation | Framer Motion |
| ZIP Packaging | JSZip |
| Icons | Phosphor Icons + Lucide React |

UI components are located in `src/components/ui/`, using `cn()` utility (tailwind-merge) for className merging.

---

## ⚠️ Known Limitations

- ICO conversion is limited to 256×256 (browser Canvas API constraint)
- ICNS format is actually a PNG wrapper (relies on macOS system for native handling)
- Drag-to-file-explorer depends on browser support for the `DownloadURL` format (Chromium-based browsers work best)

---

## 🚀 Local Development

**Requirements:** Node.js 18+

```bash
# Install dependencies
npm install

# Start dev server (http://localhost:5173)
npm run dev

# Build for production (output to dist/)
npm run build

# Run ESLint
npm run lint

# Preview production build
npm run preview

# Clear and re-optimize dependencies
npm run optimize
```

### File Naming Conventions

- Components: PascalCase (e.g., `WorkspaceDropZone.tsx`)
- Utility modules: camelCase (e.g., `scriptGenerator.ts`)
- Type definitions: typically inline at file top or in `src/types/`

---

## 🤝 Contributing

Issues and pull requests are welcome. Please open an issue first to discuss major changes.

---

## 🤖 AI-Assisted Development

This project was developed with AI assistance (code generation and documentation).

**AI Models/Services Used:** Claude Sonnet 4.6 (Anthropic), Gemini 2.5 Pro (Google)

> ⚠️ **Disclaimer:** While the author has made every effort to review and validate the AI-generated code, no guarantee can be made regarding its correctness, security, or fitness for any particular purpose. Use at your own risk.

---

## 📜 License

[MIT License](LICENSE) — Spark Template resources © GitHub, Inc.
