export type ScriptType = 'powershell' | 'applescript' | 'bash'

export interface ScriptConfig {
  format: 'png' | 'ico' | 'icns'
  iconPath: string
  targetPaths: string[]
}

function generateWindowsPowerShell(config: ScriptConfig): string {
  const sanitizedPaths = config.targetPaths.map(p => p.replace(/\\/g, '\\\\'))
  const sanitizedIconPath = config.iconPath.replace(/\\/g, '\\\\')
  
  return `# Windows 圖示自動化腳本
# 生成時間: ${new Date().toLocaleString('zh-TW')}

$iconPath = "${sanitizedIconPath}"
$folders = @(
${sanitizedPaths.map(p => `    "${p}"`).join(',\n')}
)

Write-Host "開始套用圖示..."
Write-Host ""

foreach ($folder in $folders) {
    if (Test-Path $folder) {
        $desktopIni = Join-Path $folder "desktop.ini"
        
        Set-Content -Path $desktopIni -Value @"
[.ShellClassInfo]
IconResource=$iconPath,0
"@
        
        Set-ItemProperty -Path $folder -Name Attributes -Value ([System.IO.FileAttributes]::System)
        Set-ItemProperty -Path $desktopIni -Name Attributes -Value ([System.IO.FileAttributes]::Hidden, [System.IO.FileAttributes]::System)
        
        Write-Host "✓ 已套用圖示: $folder" -ForegroundColor Green
    } else {
        Write-Host "✗ 資料夾不存在: $folder" -ForegroundColor Red
    }
}

Write-Host ""
Read-Host "按 Enter 鍵關閉"
`
}

function generateMacAppleScript(config: ScriptConfig): string {
  const sanitizedIconPath = config.iconPath.replace(/"/g, '\\"')
  const sanitizedPaths = config.targetPaths.map(p => p.replace(/"/g, '\\"'))
  
  return `-- macOS 圖示自動化腳本
-- 生成時間: ${new Date().toLocaleString('zh-TW')}

set iconPath to POSIX file "${sanitizedIconPath}"
set targetFolders to {${sanitizedPaths.map(p => `"${p}"`).join(', ')}}

repeat with folderPath in targetFolders
    try
        set folderAlias to POSIX file folderPath as alias
        tell application "Finder"
            set icon of folderAlias to (read iconPath as «class icns»)
        end tell
        log "✓ 已套用圖示: " & folderPath
    on error errMsg
        log "✗ 套用失敗: " & folderPath & " (" & errMsg & ")"
    end try
end repeat

display dialog "圖示套用完成" buttons {"確定"} default button 1
`
}

function generateLinuxBash(config: ScriptConfig): string {
  const sanitizedPaths = config.targetPaths.map(p => p.replace(/"/g, '\\"'))
  const sanitizedIconPath = config.iconPath.replace(/"/g, '\\"')
  
  return `#!/bin/bash
# Linux 圖示自動化腳本
# 生成時間: ${new Date().toLocaleString('zh-TW')}

ICON_PATH="${sanitizedIconPath}"
TARGET_FOLDERS=(
${sanitizedPaths.map(p => `    "${p}"`).join('\n')}
)

echo "開始套用圖示..."
echo ""

for folder in "\${TARGET_FOLDERS[@]}"; do
    if [ -d "$folder" ]; then
        gio set "$folder" metadata::custom-icon "file://$ICON_PATH"
        
        if [ $? -eq 0 ]; then
            echo "✓ 已套用圖示: $folder"
        else
            echo "✗ 套用失敗: $folder"
        fi
    else
        echo "✗ 資料夾不存在: $folder"
    fi
done

echo ""
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
