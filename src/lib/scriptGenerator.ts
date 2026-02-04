export type ScriptType = 'powershell' | 'applescript' | 'bash'

export interface ScriptConfig {
  type: ScriptType
  format: 'png' | 'ico' | 'icns'
  targetPaths: string[]
  iconPath: string
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
        
        Write-Host "✓ 已套用圖示: $folder"
    } else {
        Write-Host "✗ 資料夾不存在: $folder" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "完成！" -ForegroundColor Green
Read-Host "按 Enter 鍵關閉"
`
}

function generateMacOSAppleScript(config: ScriptConfig): string {
  const sanitizedPaths = config.targetPaths.map(p => p.replace(/"/g, '\\"'))
  const sanitizedIconPath = config.iconPath.replace(/"/g, '\\"')
  
  return `-- macOS 圖示自動化腳本
-- 生成時間: ${new Date().toLocaleString('zh-TW')}

set iconPath to "${sanitizedIconPath}"
set targetFolders to {${sanitizedPaths.map(p => `"${p}"`).join(', ')}}

tell application "Finder"
    repeat with targetFolder in targetFolders
        try
            set folderAlias to POSIX file targetFolder as alias
            set icon of folderAlias to (read file (POSIX file iconPath as alias) as picture)
            display notification "已套用圖示" with title targetFolder
        on error errMsg
            display notification "無法套用圖示: " & errMsg with title targetFolder
        end try
    end repeat
    
    display dialog "圖示套用完成！" buttons {"確定"} default button 1
end tell
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
echo "完成！"
read -p "按 Enter 鍵關閉"
`
}

export function generateScript(config: ScriptConfig): string {
  const { type } = config
  
  switch (type) {
    case 'powershell':
      return generateWindowsPowerShell(config)
    case 'applescript':
      return generateMacOSAppleScript(config)
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
      return `使用方式：
1. 將圖示檔案和此腳本放在同一個位置
2. 右鍵點擊腳本檔案，選擇「以 PowerShell 執行」
3. 如果出現安全提示，請選擇「執行」
4. 等待腳本完成執行`

    case 'applescript':
      return `使用方式：
1. 將圖示檔案和此腳本放在同一個位置
2. 使用「腳本編輯器」應用程式開啟此腳本
3. 點擊「執行」按鈕
4. 系統可能會要求您授予 Finder 存取權限`

    case 'bash':
      return `使用方式：
1. 將圖示檔案和此腳本放在同一個位置
2. 開啟終端機，導航到腳本所在目錄
3. 執行以下命令賦予執行權限：
   chmod +x ${getScriptExtension(type)}
4. 執行腳本：
   ./${getScriptExtension(type)}`

    default:
      return ''
  }
}

export function downloadScript(scriptContent: string, fileName: string): void {
  const blob = new Blob([scriptContent], { type: 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = fileName
  document.body.appendChild(a)
  a.click()
  URL.revokeObjectURL(url)
  document.body.removeChild(a)
}
