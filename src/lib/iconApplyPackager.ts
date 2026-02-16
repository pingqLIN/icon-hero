import JSZip from 'jszip'

export type ApplyPlatform = 'windows' | 'macos' | 'linux'

export interface ApplyPackageConfig {
  iconBlob: Blob
  iconName: string
  targetPaths: string[]
  platform: ApplyPlatform
}

/**
 * 根據平台取得推薦的圖示格式
 */
export function getRecommendedFormat(platform: ApplyPlatform): 'ico' | 'icns' | 'png' {
  switch (platform) {
    case 'windows': return 'ico'
    case 'macos': return 'icns'
    case 'linux': return 'png'
  }
}

/**
 * 取得對應平台的腳本副檔名
 */
function getScriptFilename(platform: ApplyPlatform): string {
  switch (platform) {
    case 'windows': return 'apply-icon.ps1'
    case 'macos': return 'apply-icon.command'
    case 'linux': return 'apply-icon.sh'
  }
}

/**
 * 取得圖示在 ZIP 內的檔名
 */
function getIconFilename(iconName: string, platform: ApplyPlatform): string {
  const ext = getRecommendedFormat(platform)
  return `${iconName}.${ext}`
}

/**
 * 產生 Windows PowerShell 腳本
 * 功能：路徑正規化 + 環境變數展開 + 模糊搜尋 + 預判錯誤
 */
function generateWindowsScript(iconFilename: string, targetPaths: string[]): string {
  return `# ============================================
# Windows 資料夾圖示一鍵套用腳本
# 生成時間: ${new Date().toLocaleString('zh-TW')}
# ============================================
# 使用方式：右鍵此檔案 → 以 PowerShell 執行
# ============================================

# ---------- 工具函數 ----------

# 正規化路徑：展開環境變數、去尾斜線、正斜線轉反斜線
function Normalize-FolderPath {
    param([string]$RawPath)
    # 展開環境變數（如 %USERPROFILE%）
    $expanded = [System.Environment]::ExpandEnvironmentVariables($RawPath)
    # 正斜線轉反斜線
    $expanded = $expanded.Replace('/', '\\\\')
    # 去除結尾斜線（但保留根路徑如 C:\\）
    $expanded = $expanded.TrimEnd('\\\\')
    if ($expanded -match '^[A-Za-z]:$') { $expanded += '\\\\' }
    return $expanded
}

# 模糊搜尋：若路徑不存在，在上層目錄搜尋名稱相似的資料夾
function Find-SimilarFolder {
    param([string]$TargetPath)
    $parentDir = Split-Path -Parent $TargetPath
    $folderName = Split-Path -Leaf $TargetPath
    
    if (-not (Test-Path $parentDir)) { return $null }
    
    # 1. 不區分大小寫完全比對
    $exact = Get-ChildItem -Path $parentDir -Directory -ErrorAction SilentlyContinue |
        Where-Object { $_.Name -ieq $folderName } | Select-Object -First 1
    if ($exact) { return $exact.FullName }
    
    # 2. 包含關鍵字比對（如 "my-project" 可以找到 "My Project"）
    $keyword = $folderName -replace '[-_\\s]+', '*'
    $partial = Get-ChildItem -Path $parentDir -Directory -ErrorAction SilentlyContinue |
        Where-Object { $_.Name -ilike "*$keyword*" } | Select-Object -First 5
    if ($partial) { return $partial }
    
    return $null
}

# ---------- 主程式 ----------

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$iconPath = Join-Path $scriptDir "${iconFilename}"

if (-not (Test-Path $iconPath)) {
    Write-Host "錯誤：找不到圖示檔案 $iconPath" -ForegroundColor Red
    Write-Host "請確認圖示檔案與腳本在同一個資料夾中" -ForegroundColor Yellow
    Read-Host "按 Enter 鍵關閉"
    exit 1
}

$iconFullPath = (Resolve-Path $iconPath).Path

# 原始目標清單
$rawFolders = @(
${targetPaths.map(p => `    "${p.replace(/\\/g, '\\\\')}"`).join(',\n')}
)

Write-Host ""
Write-Host "====================================" -ForegroundColor Cyan
Write-Host "  資料夾圖示一鍵套用工具" -ForegroundColor Cyan
Write-Host "====================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "圖示檔案: $iconFullPath" -ForegroundColor Gray
Write-Host "目標資料夾數量: $($rawFolders.Count)" -ForegroundColor Gray
Write-Host ""

$successCount = 0
$failCount = 0
$skipCount = 0

foreach ($rawPath in $rawFolders) {
    # Step 1: 正規化路徑
    $folder = Normalize-FolderPath $rawPath
    
    if ($folder -ne $rawPath) {
        Write-Host "  [INFO] 路徑已正規化: $rawPath -> $folder" -ForegroundColor DarkGray
    }
    
    # Step 2: 檢查路徑是否存在
    if (Test-Path $folder) {
        # 確認是資料夾（不是檔案）
        if (-not (Test-Path $folder -PathType Container)) {
            Write-Host "  [SKIP] 不是資料夾（是檔案）: $folder" -ForegroundColor Yellow
            $skipCount++
            continue
        }
        
        try {
            $desktopIni = Join-Path $folder "desktop.ini"

            if (Test-Path $desktopIni) {
                attrib -h -s $desktopIni 2>$null
            }

            @"
[.ShellClassInfo]
IconResource=$iconFullPath,0
"@ | Set-Content -Path $desktopIni -Encoding Unicode

            attrib +h +s $desktopIni
            attrib +s $folder

            Write-Host "  [OK] $folder" -ForegroundColor Green
            $successCount++
        } catch {
            Write-Host "  [FAIL] $folder - $($_.Exception.Message)" -ForegroundColor Red
            $failCount++
        }
    } else {
        # Step 3: 路徑不存在 → 嘗試模糊搜尋
        Write-Host "  [WARN] 找不到: $folder" -ForegroundColor Yellow
        
        $similar = Find-SimilarFolder $folder
        if ($similar -is [System.IO.DirectoryInfo] -or $similar -is [string]) {
            $suggestedPath = if ($similar -is [string]) { $similar } else { $similar.FullName }
            Write-Host "          你是不是要找: $suggestedPath" -ForegroundColor DarkYellow
            Write-Host "          自動使用此路徑套用圖示..." -ForegroundColor DarkYellow
            
            try {
                $desktopIni = Join-Path $suggestedPath "desktop.ini"
                if (Test-Path $desktopIni) { attrib -h -s $desktopIni 2>$null }
                @"
[.ShellClassInfo]
IconResource=$iconFullPath,0
"@ | Set-Content -Path $desktopIni -Encoding Unicode
                attrib +h +s $desktopIni
                attrib +s $suggestedPath
                Write-Host "  [OK] $suggestedPath (模糊比對)" -ForegroundColor Green
                $successCount++
            } catch {
                Write-Host "  [FAIL] $suggestedPath - $($_.Exception.Message)" -ForegroundColor Red
                $failCount++
            }
        } elseif ($similar -is [System.Array] -and $similar.Count -gt 0) {
            Write-Host "          找到 $($similar.Count) 個類似資料夾：" -ForegroundColor DarkYellow
            foreach ($s in $similar) {
                Write-Host "            - $($s.FullName)" -ForegroundColor DarkYellow
            }
            Write-Host "          請修改腳本中的路徑後重新執行" -ForegroundColor DarkYellow
            $skipCount++
        } else {
            Write-Host "          上層目錄也不存在，請確認路徑是否正確" -ForegroundColor Red
            $failCount++
        }
    }
}

Write-Host ""
Write-Host "====================================" -ForegroundColor Cyan
Write-Host "  完成！成功: $successCount / 跳過: $skipCount / 失敗: $failCount" -ForegroundColor Cyan
Write-Host "====================================" -ForegroundColor Cyan
Write-Host ""

# 重新整理圖示快取
Write-Host "正在重新整理圖示快取..." -ForegroundColor Gray
ie4uinit.exe -show 2>$null
Write-Host "完成。如果圖示沒有立即更新，請重新啟動檔案總管或登出再登入。" -ForegroundColor Gray
Write-Host ""
Read-Host "按 Enter 鍵關閉"
`
}

/**
 * 產生 macOS 腳本
 * 功能：路徑正規化 + ~ 展開 + 模糊搜尋
 */
function generateMacScript(iconFilename: string, targetPaths: string[]): string {
  return `#!/bin/bash
# ============================================
# macOS 資料夾圖示一鍵套用腳本
# 生成時間: ${new Date().toLocaleString('zh-TW')}
# ============================================
# 使用方式：雙擊此檔案即可執行
# ============================================

# ---------- 工具函數 ----------

# 正規化路徑：展開 ~ 和環境變數、去除尾斜線
normalize_path() {
    local raw="$1"
    # 展開 ~ 為 $HOME
    if [[ "$raw" == ~* ]]; then
        raw="\${raw/#\\~/$HOME}"
    fi
    # 去除結尾斜線
    raw="\${raw%/}"
    echo "$raw"
}

# 模糊搜尋：路徑不存在時，在上層目錄不區分大小寫搜尋
find_similar() {
    local target="$1"
    local parent_dir
    local folder_name
    parent_dir="$(dirname "$target")"
    folder_name="$(basename "$target")"
    
    if [ ! -d "$parent_dir" ]; then
        return 1
    fi
    
    # 不區分大小寫搜尋同名資料夾
    local found
    found=$(find "$parent_dir" -maxdepth 1 -type d -iname "$folder_name" 2>/dev/null | head -1)
    if [ -n "$found" ]; then
        echo "$found"
        return 0
    fi
    
    # 部分比對（包含關鍵字）
    found=$(find "$parent_dir" -maxdepth 1 -type d -iname "*$folder_name*" 2>/dev/null | head -5)
    if [ -n "$found" ]; then
        echo "$found"
        return 2  # 回傳碼 2 表示多個候選
    fi
    
    return 1
}

# 套用圖示到資料夾
apply_icon() {
    local folder="$1"
    local icon="$2"
    if command -v fileicon &>/dev/null; then
        fileicon set "$folder" "$icon" 2>/dev/null
    else
        osascript -e "
            use framework \\"AppKit\\"
            set iconImage to current application's NSImage's alloc()'s initWithContentsOfFile:\\"$icon\\"
            current application's NSWorkspace's sharedWorkspace()'s setIcon:iconImage forFile:\\"$folder\\" options:0
        " 2>/dev/null
    fi
    return $?
}

# ---------- 主程式 ----------

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
ICON_PATH="$SCRIPT_DIR/${iconFilename}"

if [ ! -f "$ICON_PATH" ]; then
    echo "錯誤：找不到圖示檔案 $ICON_PATH"
    echo "請確認圖示檔案與腳本在同一個資料夾中"
    read -p "按 Enter 鍵關閉"
    exit 1
fi

echo ""
echo "===================================="
echo "  資料夾圖示一鍵套用工具 (macOS)"
echo "===================================="
echo ""

RAW_FOLDERS=(
${targetPaths.map(p => `    "${p.replace(/"/g, '\\"')}"`).join('\n')}
)

SUCCESS=0
FAIL=0
SKIP=0

for raw in "\${RAW_FOLDERS[@]}"; do
    folder=$(normalize_path "$raw")
    
    if [ "$folder" != "$raw" ]; then
        echo "  [INFO] 路徑已正規化: $raw -> $folder"
    fi
    
    if [ -d "$folder" ]; then
        apply_icon "$folder" "$ICON_PATH"
        if [ $? -eq 0 ]; then
            echo "  [OK] $folder"
            ((SUCCESS++))
        else
            echo "  [FAIL] $folder"
            ((FAIL++))
        fi
    else
        echo "  [WARN] 找不到: $folder"
        
        similar=$(find_similar "$folder")
        ret=$?
        
        if [ $ret -eq 0 ] && [ -n "$similar" ]; then
            echo "         自動比對到: $similar"
            apply_icon "$similar" "$ICON_PATH"
            if [ $? -eq 0 ]; then
                echo "  [OK] $similar (模糊比對)"
                ((SUCCESS++))
            else
                echo "  [FAIL] $similar"
                ((FAIL++))
            fi
        elif [ $ret -eq 2 ] && [ -n "$similar" ]; then
            echo "         找到類似的資料夾："
            echo "$similar" | while read -r line; do
                echo "           - $line"
            done
            echo "         請修改腳本中的路徑後重新執行"
            ((SKIP++))
        else
            echo "         上層目錄也不存在，請確認路徑是否正確"
            ((FAIL++))
        fi
    fi
done

echo ""
echo "===================================="
echo "  完成！成功: $SUCCESS / 跳過: $SKIP / 失敗: $FAIL"
echo "===================================="
echo ""
read -p "按 Enter 鍵關閉"
`
}

/**
 * 產生 Linux Bash 腳本
 * 功能：路徑正規化 + ~ 展開 + 模糊搜尋
 */
function generateLinuxScript(iconFilename: string, targetPaths: string[]): string {
  return `#!/bin/bash
# ============================================
# Linux 資料夾圖示一鍵套用腳本
# 生成時間: ${new Date().toLocaleString('zh-TW')}
# ============================================
# 使用方式：終端機執行 chmod +x apply-icon.sh && ./apply-icon.sh
# ============================================

# ---------- 工具函數 ----------

normalize_path() {
    local raw="$1"
    if [[ "$raw" == ~* ]]; then
        raw="\${raw/#\\~/$HOME}"
    fi
    raw="\${raw%/}"
    echo "$raw"
}

find_similar() {
    local target="$1"
    local parent_dir folder_name found
    parent_dir="$(dirname "$target")"
    folder_name="$(basename "$target")"
    
    if [ ! -d "$parent_dir" ]; then return 1; fi
    
    found=$(find "$parent_dir" -maxdepth 1 -type d -iname "$folder_name" 2>/dev/null | head -1)
    if [ -n "$found" ]; then echo "$found"; return 0; fi
    
    found=$(find "$parent_dir" -maxdepth 1 -type d -iname "*$folder_name*" 2>/dev/null | head -5)
    if [ -n "$found" ]; then echo "$found"; return 2; fi
    
    return 1
}

# ---------- 主程式 ----------

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
ICON_PATH="$SCRIPT_DIR/${iconFilename}"

if [ ! -f "$ICON_PATH" ]; then
    echo "錯誤：找不到圖示檔案 $ICON_PATH"
    echo "請確認圖示檔案與腳本在同一個資料夾中"
    read -p "按 Enter 鍵關閉"
    exit 1
fi

# 檢查 gio 是否可用
if ! command -v gio &>/dev/null; then
    echo "錯誤：找不到 gio 指令"
    echo "請安裝：sudo apt install gvfs (Debian/Ubuntu)"
    read -p "按 Enter 鍵關閉"
    exit 1
fi

echo ""
echo "===================================="
echo "  資料夾圖示一鍵套用工具 (Linux)"
echo "===================================="
echo ""

RAW_FOLDERS=(
${targetPaths.map(p => `    "${p.replace(/"/g, '\\"')}"`).join('\n')}
)

SUCCESS=0
FAIL=0
SKIP=0

for raw in "\${RAW_FOLDERS[@]}"; do
    folder=$(normalize_path "$raw")
    
    if [ "$folder" != "$raw" ]; then
        echo "  [INFO] 路徑已正規化: $raw -> $folder"
    fi
    
    if [ -d "$folder" ]; then
        gio set "$folder" metadata::custom-icon "file://$ICON_PATH" 2>/dev/null
        if [ $? -eq 0 ]; then
            echo "  [OK] $folder"
            ((SUCCESS++))
        else
            echo "  [FAIL] $folder"
            ((FAIL++))
        fi
    else
        echo "  [WARN] 找不到: $folder"
        
        similar=$(find_similar "$folder")
        ret=$?
        
        if [ $ret -eq 0 ] && [ -n "$similar" ]; then
            echo "         自動比對到: $similar"
            gio set "$similar" metadata::custom-icon "file://$ICON_PATH" 2>/dev/null
            if [ $? -eq 0 ]; then
                echo "  [OK] $similar (模糊比對)"
                ((SUCCESS++))
            else
                echo "  [FAIL] $similar"
                ((FAIL++))
            fi
        elif [ $ret -eq 2 ] && [ -n "$similar" ]; then
            echo "         找到類似的資料夾："
            echo "$similar" | while read -r line; do
                echo "           - $line"
            done
            echo "         請修改腳本中的路徑後重新執行"
            ((SKIP++))
        else
            echo "         上層目錄也不存在，請確認路徑是否正確"
            ((FAIL++))
        fi
    fi
done

echo ""
echo "===================================="
echo "  完成！成功: $SUCCESS / 跳過: $SKIP / 失敗: $FAIL"
echo "===================================="
echo ""
read -p "按 Enter 鍵關閉"
`
}

/**
 * 產生 README 說明檔
 */
function generateReadme(platform: ApplyPlatform, iconFilename: string): string {
  const platformInstructions: Record<ApplyPlatform, string> = {
    windows: `使用方式（Windows）：
1. 將此資料夾解壓縮到任意位置
2. 確認「${iconFilename}」和「apply-icon.ps1」在同一個資料夾中
3. 右鍵點擊「apply-icon.ps1」→ 選擇「以 PowerShell 執行」
4. 腳本會自動將圖示套用到所有目標資料夾

如果出現「執行原則」錯誤：
- 以管理員身分開啟 PowerShell
- 執行：Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
- 再次執行腳本

如果圖示沒有立即更新：
- 重新啟動檔案總管（工作管理員 → 重新啟動 explorer.exe）
- 或登出再登入`,

    macos: `使用方式（macOS）：
1. 將此資料夾解壓縮到任意位置
2. 確認「${iconFilename}」和「apply-icon.command」在同一個資料夾中
3. 雙擊「apply-icon.command」即可執行
4. 首次執行可能需要在「系統偏好設定 → 安全性」中允許

如果無法執行：
- 開啟終端機
- 執行：chmod +x apply-icon.command
- 再次雙擊執行`,

    linux: `使用方式（Linux）：
1. 將此資料夾解壓縮到任意位置
2. 確認「${iconFilename}」和「apply-icon.sh」在同一個資料夾中
3. 開啟終端機，切換到此資料夾
4. 執行：chmod +x apply-icon.sh
5. 執行：./apply-icon.sh

需要的套件：
- GNOME：通常已內建 gio
- 其他桌面環境：sudo apt install gvfs（Debian/Ubuntu）`
  }

  return `===================================
  資料夾圖示一鍵套用工具
  Icon Changer - Apply Package
===================================

${platformInstructions[platform]}

---
由 Icon Changer 自動生成
${new Date().toLocaleString('zh-TW')}
`
}

/**
 * 將圖示 + 腳本打包為 ZIP 並觸發下載
 */
export async function createApplyPackage(config: ApplyPackageConfig): Promise<void> {
  const { iconBlob, iconName, targetPaths, platform } = config

  const zip = new JSZip()
  const folderName = `${iconName}-icon-apply`
  const folder = zip.folder(folderName)

  if (!folder) {
    throw new Error('無法建立 ZIP 資料夾')
  }

  // 1. 加入圖示檔案
  const iconFilename = getIconFilename(iconName, platform)
  folder.file(iconFilename, iconBlob)

  // 2. 產生對應平台的腳本
  let scriptContent: string
  switch (platform) {
    case 'windows':
      scriptContent = generateWindowsScript(iconFilename, targetPaths)
      break
    case 'macos':
      scriptContent = generateMacScript(iconFilename, targetPaths)
      break
    case 'linux':
      scriptContent = generateLinuxScript(iconFilename, targetPaths)
      break
  }

  const scriptFilename = getScriptFilename(platform)
  folder.file(scriptFilename, scriptContent)

  // 3. 加入 README
  const readme = generateReadme(platform, iconFilename)
  folder.file('README.txt', readme)

  // 4. 產生 ZIP 並下載
  const zipBlob = await zip.generateAsync({ type: 'blob' })
  const url = URL.createObjectURL(zipBlob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${folderName}.zip`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
