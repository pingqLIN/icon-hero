export type ScriptType = 'powershell' | 'applescript' | 'bash'

export interface ScriptConfig {
  type: ScriptType
  itemName: string
  targetPaths: string[]
  format: 'png' | 'ico' | 'icns'
}

export function generateWindowsPowerShell(iconPath: string, targetPaths: string[], itemName: string): string {
  const sanitizedPaths = targetPaths.map(p => p.replace(/\\/g, '\\\\'))
  
  return `# Windows 圖示自動化腳本
# 圖示: ${itemName}.ico
# 生成時間: ${new Date().toLocaleString('zh-TW')}

$iconPath = "${iconPath.replace(/\\/g, '\\\\')}"
$folders = @(
${sanitizedPaths.map(p => `    "${p}"`).join(',\n')}
)

foreach ($folder in $folders) {
    if (Test-Path $folder) {
        $desktopIni = Join-Path $folder "desktop.ini"
        
        @"
[.ShellClassInfo]
IconResource=$iconPath,0
[ViewState]
Mode=
Vid=
FolderType=Generic
"@ | Out-File -FilePath $desktopIni -Encoding ASCII -Force
        
        $desktopIniFile = Get-Item $desktopIni -Force
        $desktopIniFile.Attributes = 'Hidden, System'
        
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
    set iconFile to iconPath as alias
    
    repeat with targetPath in targetPaths
        try
            set targetFolder to POSIX file targetPath as alias
            set icon of targetFolder to icon of iconFile
            display notification "已套用圖示至: " & targetPath
        on error errMsg
            display notification "無法套用圖示至: " & targetPath
        end try
    end repeat
    
    display notification "完成!" with title "圖示自動化腳本"
end tell`
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
        gio set "$folder" metadata::custom-icon "file://$ICON_PATH" 2>/dev/null
        
        if [ $? -eq 0 ]; then
            echo "✓ 已套用圖示至: $folder"
        else
            echo "✗ 無法套用圖示至: $folder (需要 gvfs/gio 工具)"
        fi
    else
        echo "✗ 資料夾不存在: $folder"
    fi
done

echo ""
echo "完成! 請重新整理檔案管理員以查看變更"`
}

export function generateScript(config: ScriptConfig): string {
  const { type, itemName, targetPaths, format } = config
  
  const iconPath = type === 'powershell' 
    ? `C:\\Icons\\${itemName}.${format}`
    : type === 'applescript'
    ? `/Users/username/Icons/${itemName}.${format}`
    : `/home/username/Icons/${itemName}.${format}`

  switch (type) {
    case 'powershell':
      return generateWindowsPowerShell(iconPath, targetPaths, itemName)
    case 'applescript':
      return generateMacOSAppleScript(iconPath, targetPaths, itemName)
    case 'bash':
      return generateLinuxBashScript(iconPath, targetPaths, itemName)
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

export function getScriptFileName(itemName: string, type: ScriptType): string {
  const extension = getScriptExtension(type)
  return `${itemName}-auto-icon.${extension}`
}

export function downloadScript(script: string, filename: string): void {
  const blob = new Blob([script], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export function getScriptInstructions(type: ScriptType): string {
  switch (type) {
    case 'powershell':
      return `1. 將圖示檔案 (.ico) 放置在指定路徑
2. 以系統管理員身分執行 PowerShell
3. 執行此腳本
4. 按 F5 重新整理檔案總管以查看變更`
    case 'applescript':
      return `1. 將圖示檔案 (.icns) 放置在指定路徑
2. 使用「腳本編輯器」開啟此腳本
3. 點擊「執行」按鈕執行腳本
4. 授予必要的系統權限`
    case 'bash':
      return `1. 將圖示檔案 (.png) 放置在指定路徑
2. 賦予腳本執行權限: chmod +x script.sh
3. 執行腳本: ./script.sh
4. 重新整理檔案管理員以查看變更`
    default:
      return ''
  }
}
