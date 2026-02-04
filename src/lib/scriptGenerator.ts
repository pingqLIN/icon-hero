export type ScriptType = 'powershell' | 'applescript' | 'bash'

export interface ScriptConfig {
  type: ScriptType
  itemName: string
  format: 'png' | 'ico' | 'icns'
  targetPaths: string[]
  iconPath?: string
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

Write-Host "開始套用圖示..." -ForegroundColor Cyan
Write-Host ""

foreach ($folder in $folders) {
    if (Test-Path $folder) {
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

echo "開始套用圖示..."
echo ""

for folder in "\${TARGET_PATHS[@]}"; do
    if [ -d "$folder" ]; then
        gio set "$folder" metadata::custom-icon "file://$ICON_PATH" 2>/dev/null
        
        if [ $? -eq 0 ]; then
            echo "✓ 已套用圖示至: $folder"
        else
            echo "✗ 無法套用圖示至: $folder"
        fi
    else
        echo "✗ 資料夾不存在: $folder"
    fi
done

echo ""
echo "完成!"
read -p "按 Enter 鍵關閉"`
}

export function generateScript(config: ScriptConfig): string {
  const { type, itemName, targetPaths, iconPath = `/path/to/${itemName}.${config.format}` } = config

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

export function downloadScript(scriptContent: string, fileName: string): void {
  const blob = new Blob([scriptContent], { type: 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = fileName
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export function getScriptInstructions(type: ScriptType): string {
  switch (type) {
    case 'powershell':
      return `1. 將圖示檔案 (.ico) 放在穩定的位置
2. 以系統管理員身分執行此 PowerShell 腳本
3. 等待腳本完成
4. 按 F5 重新整理檔案總管以查看變更`
    case 'applescript':
      return `1. 將圖示檔案 (.icns) 放在穩定的位置
2. 開啟「腳本編輯器」應用程式
3. 貼上並執行此腳本
4. 授予 Finder 存取權限（如有提示）`
    case 'bash':
      return `1. 將圖示檔案 (.png) 放在穩定的位置
2. 賦予腳本執行權限: chmod +x script.sh
3. 執行腳本: ./script.sh
4. 重新整理檔案管理員以查看變更`
    default:
      return ''
  }
}
