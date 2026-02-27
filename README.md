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
  <a href="https://pingqlin.github.io/icon-hero/">🌐 Live Demo</a> •
  <a href="#-features">Features</a> •
  <a href="#-how-to-use">How to Use</a> •
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

## 🖥️ Platform Support

| Platform | Format | Script | Method |
|----------|--------|--------|--------|
| **Windows** | ICO | PowerShell | `desktop.ini` + `IconResource` |
| **macOS** | ICNS | Bash + osascript | `fileicon` CLI or `osascript` fallback |
| **Linux** | PNG | Bash | `gio set metadata::custom-icon` (GNOME/Nautilus) |

### Notes

- **macOS**: The script tries `fileicon` first. Install it with `brew install fileicon`, or it falls back to `osascript`.
- **Linux**: The `gio` method works on GNOME-based desktops (Ubuntu, Fedora, etc.). Other desktop environments may differ.
- **Windows**: Script sets folder icon via `desktop.ini`. PowerShell execution policy must allow scripts (`Set-ExecutionPolicy RemoteSigned`).

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
| UI Components | Shadcn UI (Radix UI primitives) |
| Styling | Tailwind CSS 4 |
| Animation | Framer Motion |
| ZIP Packaging | JSZip |
| Icons | Phosphor Icons + Lucide React |

### Architecture

```
Upload/URL Input
      ↓
workspaceAnalyzer.ts   ← Analyzes files, fetches favicons
      ↓
iconConverter.ts       ← Canvas API → PNG / ICO / ICNS
      ↓
WorkspaceQueue         ← Real-time status display
      ↓
scriptGenerator.ts     ← PowerShell / Bash / osascript
iconApplyPackager.ts   ← ZIP bundle with icon + script + README
```

---

## 🚀 Local Development

**Requirements:** Node.js 18+

```bash
# Install dependencies
npm install

# Start dev server (http://localhost:5173)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

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
