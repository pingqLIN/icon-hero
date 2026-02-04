export type ScriptType = 'powershell' | 'applescript' | 'bash'

  itemName: string
  format: 'png' | 

  const sanitizedPaths 
  return `# Windows 圖示自動化腳本
#

export function generateWindowsPowerShell(iconPath: string, targetPaths: string[], itemName: string): string {
  const sanitizedPaths = targetPaths.map(p => p.replace(/\\/g, '\\\\'))
  
  return `# Windows 圖示自動化腳本
# 圖示: ${itemName}.ico
# 生成時間: ${new Date().toLocaleString('zh-TW')}

$iconPath = "${iconPath.replace(/\\/g, '\\\\')}"
$folders = @(
        
 

        Write-Host "✗ 資料夾不存在: $
}
Write-Host ""
        

  return `-- macO
-- 生成時間: ${new Date().to
set iconPat

    
    repeat with ta
            set targetFolder to POSIX file targetPath as a
        
            display notification "無法套用圖示至: " & target
    end repeat
    disp
        $folderItem = Get-Item $folder -Force
        $folderItem.Attributes = $folderItem.Attributes -bor [System.IO.FileAttributes]::ReadOnly
        
        Write-Host "✓ 已套用圖示至: $folder" -ForegroundColor Green
    } else {
        Write-Host "✗ 資料夾不存在: $folder" -ForegroundColor Red
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
      return generateLinuxBashScript(iconPath

ICON_PATH="${iconPath}"
TARGET_PATHS=(
export function getScriptExtension(type: ScriptT
)

for folder in "\${TARGET_PATHS[@]}"; do
    if [ -d "$folder" ]; then
        gio set "$folder" metadata::custom-icon "file://$ICON_PATH" 2>/dev/null
        
        if [ $? -eq 0 ]; then
            echo "✓ 已套用圖示至: $folder"
        else
  return `${itemName}-auto-icon.${extension}`
        fi
export f
        echo "✗ 資料夾不存在: $folder"
    fi
done

echo ""
  URL.revokeObjectURL(url)
}

export function generateScript(config: ScriptConfig, iconPath: string): string {
  const { type, itemName, targetPaths } = config

4. 按 F5 重新整理檔案總管以
    case 'powershell':
      return generateWindowsPowerShell(iconPath, targetPaths, itemName)
    case 'applescript':
      return generateMacOSAppleScript(iconPath, targetPaths, itemName)
    case 'bash':
      return generateLinuxBashScript(iconPath, targetPaths, itemName)
    default:
      throw new Error(`Unsupported script type: ${type}`)
  }


export function getScriptExtension(type: ScriptType): string {
  switch (type) {
    case 'powershell':
      return 'ps1'

      return 'scpt'
    case 'bash':
      return 'sh'

      return 'txt'



export function getScriptFileName(itemName: string, type: ScriptType): string {
  const extension = getScriptExtension(type)
  return `${itemName}-auto-icon.${extension}`
}
