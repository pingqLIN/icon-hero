export type ScriptType = 'powershell' | 'applescript' | 'bash'

export interface ScriptConfig {
  type: ScriptType
  iconPath: string
  targetPaths: string[]
  itemName: string
  format: 'png' | 'ico' | 'icns'
}

export function generateWindowsPowerShellScript(iconPath: string, targetPaths: string[], itemName: string): string {
  const sanitizedPaths = targetPaths.map(p => p.replace(/\\/g, '\\\\'))
  
  return `# Windows 資料夾圖示自動化腳本
# 圖示: ${itemName}.ico
# 生成時間: ${new Date().toLocaleString('zh-TW')}

$iconPath = "${iconPath.replace(/\\/g, '\\\\')}"
$folders = @(
${sanitizedPaths.map(p => `    "${p}"`).join(',\n')}
)

foreach ($folder in $folders) {
    if (Test-Path $folder) {
        # 建立 desktop.ini 檔案
        $desktopIni = Join-Path $folder "desktop.ini"
        
        # 寫入圖示設定
        @"
[.ShellClassInfo]
IconResource=$iconPath,0
[ViewState]
Mode=
Vid=
FolderType=Generic
"@ | Out-File -FilePath $desktopIni -Encoding ASCII -Force
        
        # 設定 desktop.ini 為隱藏和系統檔案
        $desktopIniFile = Get-Item $desktopIni -Force
        $desktopIniFile.Attributes = 'Hidden, System'
        
        # 設定資料夾屬性
        $folderItem = Get-Item $folder -Force
        $folderItem.Attributes = $folderItem.Attributes -bor [System.IO.FileAttributes]::ReadOnly
        
        Write-Host "✓ 已套用圖示至: $folder" -ForegroundColor Green
    } else {
        Write-Host "✗ 資料夾不存在: $folder" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "完成! 請按 F5 重新整理檔案總管以查看變更" -ForegroundColor Cyan
Read-Host "按 Enter 鍵關閉"`
}

export function generateMacOSAppleScript(iconPath: string, targetPaths: string[], itemName: string): string {
  return `-- macOS 圖示自動化腳本
-- 圖示: ${itemName}.icns
-- 生成時間: ${new Date().toLocaleString('zh-TW')}

set iconPath to POSIX file "${iconPath}"
set targetPaths to {${targetPaths.map(p => `"${p}"`).join(', ')}}

tell application "Finder"
    -- 載入圖示檔案
    set iconImage to (open for access iconPath)
    set iconData to (read iconImage as «class icns»)
    close access iconImage
    
    -- 套用至每個目標
    repeat with targetPath in targetPaths
        try
            set targetItem to (POSIX file targetPath) as alias
            set icon of targetItem to iconData
            log "✓ 已套用圖示至: " & targetPath
        on error errMsg
            log "✗ 失敗: " & targetPath & " (" & errMsg & ")"
        end try
    end repeat
end tell

display dialog "圖示套用完成!" buttons {"確定"} default button "確定"`
}

export function generateLinuxBashScript(iconPath: string, targetPaths: string[], itemName: string): string {
  return `#!/bin/bash
# Linux 圖示自動化腳本
# 圖示: ${itemName}.png
# 生成時間: ${new Date().toLocaleString('zh-TW')}

ICON_PATH="${iconPath}"
TARGET_PATHS=(
${targetPaths.map(p => `    "${p}"`).join('\n')}
)

for folder in "\${TARGET_PATHS[@]}"; do
    if [ -d "$folder" ]; then
        # 建立 .directory 檔案
        cat > "$folder/.directory" << EOF
[Desktop Entry]
Icon=$ICON_PATH
EOF
        
        # 設定檔案權限
        chmod 644 "$folder/.directory"
        
        echo "✓ 已套用圖示至: $folder"
    else
        echo "✗ 資料夾不存在: $folder"
    fi
done

echo ""
echo "完成! 請重新啟動檔案管理器以查看變更"
read -p "按 Enter 鍵關閉"`
}

export function generateScript(config: ScriptConfig): string {
  switch (config.type) {
    case 'powershell':
      return generateWindowsPowerShellScript(config.iconPath, config.targetPaths, config.itemName)
    case 'applescript':
      return generateMacOSAppleScript(config.iconPath, config.targetPaths, config.itemName)
    case 'bash':
      return generateLinuxBashScript(config.iconPath, config.targetPaths, config.itemName)
  }
}

export function downloadScript(script: string, filename: string) {
  const blob = new Blob([script], { type: 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export function getScriptExtension(type: ScriptType): string {
  switch (type) {
    case 'powershell':
      return 'ps1'
    case 'applescript':
      return 'scpt'
    case 'bash':
      return 'sh'
  }
}

export function getScriptInstructions(type: ScriptType): string {
  switch (type) {
    case 'powershell':
      return '1. 下載腳本和 ICO 檔案\n2. 在腳本中修改目標資料夾路徑\n3. 右鍵點擊 .ps1 檔案\n4. 選擇「使用 PowerShell 執行」'
    case 'applescript':
      return '1. 下載腳本和 ICNS 檔案\n2. 使用「腳本編輯器」開啟 .scpt 檔案\n3. 修改目標資料夾路徑\n4. 點擊執行按鈕'
    case 'bash':
      return '1. 下載腳本和 PNG 檔案\n2. 在終端機中執行: chmod +x script.sh\n3. 修改目標資料夾路徑\n4. 執行: ./script.sh'
  }
}
