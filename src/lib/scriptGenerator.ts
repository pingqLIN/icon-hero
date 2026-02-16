export type ScriptType = 'powershell' | 'applescript' | 'bash'

export interface ScriptConfig {
  format: 'png' | 'ico' | 'icns'
  iconPath: string
  targetPaths: string[]
  isInlineMode?: boolean  // true = 複製貼上版（移除暫停指令），false/undefined = 檔案執行版
}

function generateWindowsPowerShell(config: ScriptConfig): string {
  const sanitizedPaths = config.targetPaths.map(p => p.replace(/\\/g, '\\\\'))
  const sanitizedIconPath = config.iconPath.replace(/\\/g, '\\\\')
  
  return `# Windows 圖示自動化腳本
# 生成時間: ${new Date().toLocaleString('zh-TW')}

# ---------- 工具函數 ----------

# 正規化路徑：展開環境變數、去尾斜線、正斜線轉反斜線
function Normalize-FolderPath {
    param([string]$RawPath)
    $expanded = [System.Environment]::ExpandEnvironmentVariables($RawPath)
    $expanded = $expanded.Replace('/', '\\\\')
    $expanded = $expanded.TrimEnd('\\\\')
    if ($expanded -match '^[A-Za-z]:$') { $expanded += '\\\\' }
    return $expanded
}

# 模糊搜尋
function Find-SimilarFolder {
    param([string]$TargetPath)
    $parentDir = Split-Path -Parent $TargetPath
    $folderName = Split-Path -Leaf $TargetPath
    if (-not (Test-Path $parentDir)) { return $null }
    
    $exact = Get-ChildItem -Path $parentDir -Directory -ErrorAction SilentlyContinue |
        Where-Object { $_.Name -ieq $folderName } | Select-Object -First 1
    if ($exact) { return $exact.FullName }
    
    $keyword = $folderName -replace '[-_\\s]+', '*'
    $partial = Get-ChildItem -Path $parentDir -Directory -ErrorAction SilentlyContinue |
        Where-Object { $_.Name -ilike "*$keyword*" } | Select-Object -First 5
    if ($partial) { return $partial }
    return $null
}

# ---------- 主程式 ----------

$iconPath = "${sanitizedIconPath}"
$rawFolders = @(
${sanitizedPaths.map(p => `    "${p}"`).join(',\n')}
)

Write-Host "開始套用圖示..."
Write-Host ""

$successCount = 0
$failCount = 0
$skipCount = 0

foreach ($rawPath in $rawFolders) {
    $folder = Normalize-FolderPath $rawPath
    if ($folder -ne $rawPath) {
        Write-Host "  [INFO] 路徑已正規化: $rawPath -> $folder" -ForegroundColor DarkGray
    }
    
    if (Test-Path $folder) {
        if (-not (Test-Path $folder -PathType Container)) {
            Write-Host "  [SKIP] 不是資料夾: $folder" -ForegroundColor Yellow
            $skipCount++
            continue
        }
        try {
            $desktopIni = Join-Path $folder "desktop.ini"
            if (Test-Path $desktopIni) { attrib -h -s $desktopIni 2>$null }
            @"
[.ShellClassInfo]
IconResource=$iconPath,0
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
        Write-Host "  [WARN] 找不到: $folder" -ForegroundColor Yellow
        $similar = Find-SimilarFolder $folder
        if ($similar -is [System.IO.DirectoryInfo] -or $similar -is [string]) {
            $suggestedPath = if ($similar -is [string]) { $similar } else { $similar.FullName }
            Write-Host "         你是不是要找: $suggestedPath" -ForegroundColor DarkYellow
            Write-Host "         自動使用此路徑..." -ForegroundColor DarkYellow
            try {
                $desktopIni = Join-Path $suggestedPath "desktop.ini"
                if (Test-Path $desktopIni) { attrib -h -s $desktopIni 2>$null }
                @"
[.ShellClassInfo]
IconResource=$iconPath,0
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
            Write-Host "         找到類似資料夾：" -ForegroundColor DarkYellow
            foreach ($s in $similar) { Write-Host "           - $($s.FullName)" -ForegroundColor DarkYellow }
            $skipCount++
        } else {
            Write-Host "         上層目錄也不存在" -ForegroundColor Red
            $failCount++
        }
    }
}

Write-Host ""
Write-Host "完成！成功: $successCount / 跳過: $skipCount / 失敗: $failCount"
${config.isInlineMode ? '' : 'Read-Host "按 Enter 鍵關閉"'}
`
}

function generateMacAppleScript(config: ScriptConfig): string {
  const sanitizedIconPath = config.iconPath.replace(/"/g, '\\"')
  const sanitizedPaths = config.targetPaths.map(p => p.replace(/"/g, '\\"'))
  
  return `#!/bin/bash
# macOS 圖示自動化腳本
# 生成時間: ${new Date().toLocaleString('zh-TW')}

normalize_path() {
    local raw="$1"
    if [[ "$raw" == ~* ]]; then raw="\${raw/#\\~/$HOME}"; fi
    raw="\${raw%/}"
    echo "$raw"
}

find_similar() {
    local target="$1" parent_dir folder_name found
    parent_dir="$(dirname "$target")"
    folder_name="$(basename "$target")"
    if [ ! -d "$parent_dir" ]; then return 1; fi
    found=$(find "$parent_dir" -maxdepth 1 -type d -iname "$folder_name" 2>/dev/null | head -1)
    if [ -n "$found" ]; then echo "$found"; return 0; fi
    found=$(find "$parent_dir" -maxdepth 1 -type d -iname "*$folder_name*" 2>/dev/null | head -5)
    if [ -n "$found" ]; then echo "$found"; return 2; fi
    return 1
}

apply_icon() {
    local folder="$1" icon="$2"
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

ICON_PATH="${sanitizedIconPath}"
RAW_FOLDERS=(
${sanitizedPaths.map(p => `    "${p}"`).join('\n')}
)

echo "開始套用圖示..."
echo ""
SUCCESS=0; FAIL=0; SKIP=0

for raw in "\${RAW_FOLDERS[@]}"; do
    folder=$(normalize_path "$raw")
    if [ "$folder" != "$raw" ]; then echo "  [INFO] 路徑已正規化: $raw -> $folder"; fi
    
    if [ -d "$folder" ]; then
        apply_icon "$folder" "$ICON_PATH"
        if [ $? -eq 0 ]; then echo "  [OK] $folder"; ((SUCCESS++))
        else echo "  [FAIL] $folder"; ((FAIL++)); fi
    else
        echo "  [WARN] 找不到: $folder"
        similar=$(find_similar "$folder"); ret=$?
        if [ $ret -eq 0 ] && [ -n "$similar" ]; then
            echo "         自動比對到: $similar"
            apply_icon "$similar" "$ICON_PATH"
            if [ $? -eq 0 ]; then echo "  [OK] $similar (模糊比對)"; ((SUCCESS++))
            else echo "  [FAIL] $similar"; ((FAIL++)); fi
        elif [ $ret -eq 2 ] && [ -n "$similar" ]; then
            echo "         找到類似資料夾："; echo "$similar" | while read -r l; do echo "           - $l"; done
            ((SKIP++))
        else echo "         上層目錄也不存在"; ((FAIL++)); fi
    fi
done

echo ""
echo "完成！成功: $SUCCESS / 跳過: $SKIP / 失敗: $FAIL"
read -p "按 Enter 鍵關閉"
`
}

function generateLinuxBash(config: ScriptConfig): string {
  const sanitizedPaths = config.targetPaths.map(p => p.replace(/"/g, '\\"'))
  const sanitizedIconPath = config.iconPath.replace(/"/g, '\\"')
  
  return `#!/bin/bash
# Linux 圖示自動化腳本
# 生成時間: ${new Date().toLocaleString('zh-TW')}

normalize_path() {
    local raw="$1"
    if [[ "$raw" == ~* ]]; then raw="\${raw/#\\~/$HOME}"; fi
    raw="\${raw%/}"
    echo "$raw"
}

find_similar() {
    local target="$1" parent_dir folder_name found
    parent_dir="$(dirname "$target")"
    folder_name="$(basename "$target")"
    if [ ! -d "$parent_dir" ]; then return 1; fi
    found=$(find "$parent_dir" -maxdepth 1 -type d -iname "$folder_name" 2>/dev/null | head -1)
    if [ -n "$found" ]; then echo "$found"; return 0; fi
    found=$(find "$parent_dir" -maxdepth 1 -type d -iname "*$folder_name*" 2>/dev/null | head -5)
    if [ -n "$found" ]; then echo "$found"; return 2; fi
    return 1
}

ICON_PATH="${sanitizedIconPath}"
RAW_FOLDERS=(
${sanitizedPaths.map(p => `    "${p}"`).join('\n')}
)

# 檢查 gio
if ! command -v gio &>/dev/null; then
    echo "錯誤：找不到 gio，請安裝 gvfs"
    read -p "按 Enter 鍵關閉"; exit 1
fi

echo "開始套用圖示..."
echo ""
SUCCESS=0; FAIL=0; SKIP=0

for raw in "\${RAW_FOLDERS[@]}"; do
    folder=$(normalize_path "$raw")
    if [ "$folder" != "$raw" ]; then echo "  [INFO] 路徑已正規化: $raw -> $folder"; fi
    
    if [ -d "$folder" ]; then
        gio set "$folder" metadata::custom-icon "file://$ICON_PATH" 2>/dev/null
        if [ $? -eq 0 ]; then echo "  [OK] $folder"; ((SUCCESS++))
        else echo "  [FAIL] $folder"; ((FAIL++)); fi
    else
        echo "  [WARN] 找不到: $folder"
        similar=$(find_similar "$folder"); ret=$?
        if [ $ret -eq 0 ] && [ -n "$similar" ]; then
            echo "         自動比對到: $similar"
            gio set "$similar" metadata::custom-icon "file://$ICON_PATH" 2>/dev/null
            if [ $? -eq 0 ]; then echo "  [OK] $similar (模糊比對)"; ((SUCCESS++))
            else echo "  [FAIL] $similar"; ((FAIL++)); fi
        elif [ $ret -eq 2 ] && [ -n "$similar" ]; then
            echo "         找到類似資料夾："; echo "$similar" | while read -r l; do echo "           - $l"; done
            ((SKIP++))
        else echo "         上層目錄也不存在"; ((FAIL++)); fi
    fi
done

echo ""
echo "完成！成功: $SUCCESS / 跳過: $SKIP / 失敗: $FAIL"
read -p "按 Enter 鍵關閉"
`
}

export function generateScript(config: ScriptConfig, type: ScriptType): string {
  switch (type) {
    case 'powershell':
      return generateWindowsPowerShell(config)
    case 'applescript':
      return generateMacAppleScript(config)
    case 'bash':
      return generateLinuxBash(config)
    default:
      throw new Error(`Unsupported script type: ${type}`)
  }
}

export function getScriptExtension(type: ScriptType): string {
  switch (type) {
    case 'powershell':
      return 'ps1'
    case 'applescript':
      return 'scpt'
    case 'bash':
      return 'sh'
    default:
      return 'txt'
  }
}

export function getScriptInstructions(type: ScriptType): string {
  switch (type) {
    case 'powershell':
      return '1. 右鍵點擊腳本檔案\n2. 選擇「以 PowerShell 執行」\n3. 如遇執行政策限制，請以管理員身分執行 PowerShell 並執行：Set-ExecutionPolicy RemoteSigned'
    case 'applescript':
      return '1. 雙擊腳本檔案執行\n2. 或使用「腳本編輯器」開啟並執行\n3. 首次執行可能需要授予「Finder」存取權限'
    case 'bash':
      return '1. 開啟終端機\n2. 執行：chmod +x script.sh\n3. 執行：./script.sh\n4. 需要安裝 gvfs 套件（Ubuntu/Debian：sudo apt install gvfs）'
    default:
      return '請參考對應作業系統的執行說明'
  }
}

export function downloadScript(scriptContent: string, filename: string): void {
  const blob = new Blob([scriptContent], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
