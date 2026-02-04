export type ScriptType = 'powershell' | 'applescript' | 'bash'

export interface ScriptConfig {
  type: ScriptType
  itemName: string
  format: 'png' | 'ico' | 'icns'
  targetPaths: string[]
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

Write-Host "開始套用圖示..."
Write-Host ""

foreach ($folder in $folders) {
    if (Test-Path $folder) {
        $desktopIni = Join-Path $folder "desktop.ini"
        
        Set-Content -Path $desktopIni -Value @"
[.ShellClassInfo]
IconResource=$iconPath,0
"@
        
        $folder | Set-ItemProperty -Name Attributes -Value ([System.IO.FileAttributes]::System)
        $desktopIni | Set-ItemProperty -Name Attributes -Value ([System.IO.FileAttributes]::Hidden, [System.IO.FileAttributes]::System)
        
        Write-Host "✓ 已套用圖示至: $folder" -ForegroundColor Green
    } else {
        Write-Host "✗ 資料夾不存在: $folder" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "完成!" -ForegroundColor Green
Read-Host "按 Enter 鍵關閉"`
}

export function generateMacOSAppleScript(iconPath: string, targetPaths: string[], itemName: string): string {
  return `-- macOS 圖示自動化腳本
-- 圖示: ${itemName}.icns
-- 生成時間: ${new Date().toLocaleString('zh-TW')}

set iconPath to POSIX file "${iconPath}" as text
set targetPaths to {${targetPaths.map(p => `"${p}"`).join(', ')}}

try
    set iconFile to iconPath
    repeat with targetPath in targetPaths
        try
            set targetFolder to POSIX file targetPath as alias
            tell application "Finder"
                set custom icon of targetFolder to iconFile
            end tell
            display notification "已套用圖示至: " & targetPath with title "圖示自動化腳本"
        on error
            display notification "無法套用圖示至: " & targetPath with title "圖示自動化腳本"
        end try
    end repeat
    display notification "完成!" with title "圖示自動化腳本"
on error errMsg
    display dialog "錯誤: " & errMsg buttons {"確定"} default button 1
end try`
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

export function generateScript(config: ScriptConfig, iconPath: string): string {
  const { type, itemName, targetPaths } = config

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
      return `1. 將圖示檔案與此腳本放在同一資料夾中
2. 右鍵點擊腳本檔案，選擇「以 PowerShell 執行」
3. 如果遇到執行原則限制，請以管理員身份開啟 PowerShell 並執行:
   Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
4. 執行腳本後，資料夾圖示將會被更新`
    case 'applescript':
      return `1. 將圖示檔案與此腳本放在同一資料夾中
2. 使用「腳本編輯器」應用程式開啟此檔案
3. 點擊「執行」按鈕執行腳本
4. 系統可能會要求您授予 Finder 存取權限
5. 執行完成後，資料夾圖示將會被更新`
    case 'bash':
      return `1. 將圖示檔案與此腳本放在同一資料夾中
2. 開啟終端機並導航至腳本所在目錄
3. 執行以下指令賦予執行權限:
   chmod +x ${getScriptFileName('script', type)}
4. 執行腳本:
   ./${getScriptFileName('script', type)}
5. 執行完成後，資料夾圖示將會被更新`
    default:
      return ''
  }
}
