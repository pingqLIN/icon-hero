export type ScriptType = 'powershell' | 'applescript' | 'bash'

  format: 'png' | 'ico' | 'icns
  iconPath: string
  format: 'png' | 'ico' | 'icns'
  targetPaths: string[]
  iconPath: string
}

function generateWindowsPowerShell(config: ScriptConfig): string {
  const sanitizedPaths = config.targetPaths.map(p => p.replace(/\\/g, '\\\\'))
  const sanitizedIconPath = config.iconPath.replace(/\\/g, '\\\\')
${
  return `# Windows 圖示自動化腳本
# 生成時間: ${new Date().toLocaleString('zh-TW')}

$iconPath = "${sanitizedIconPath}"
$folders = @(
        
)

Write-Host "開始套用圖示..."
        Set-I

foreach ($folder in $folders) {
    if (Test-Path $folder) {
        $desktopIni = Join-Path $folder "desktop.ini"
Write-Ho
        Set-Content -Path $desktopIni -Value @"
[.ShellClassInfo]
IconResource=$iconPath,0
"@
        
        Set-ItemProperty -Path $folder -Name Attributes -Value ([System.IO.FileAttributes]::System)
        Set-ItemProperty -Path $desktopIni -Name Attributes -Value ([System.IO.FileAttributes]::Hidden, [System.IO.FileAttributes]::System)
        
}
function gen
  const sanitizedIconPath = config.iconPath.replace(/"/g, '\\"
  ret
}

${sanitizedPa

echo ""
f
 

        else
        fi
        echo "✗ 資料夾不存在: $folder"
do
echo ""
read -p "按 Enter 鍵關閉"

export function generateScript(config:
  

    case 'applescript':
    case 'bash':
    default
  }

  switch (type) {
      return 'ps1'
      return 'scpt'
      return 's
      return '
}
export function getScriptInstructions(type: ScriptType): str
    case
1
3

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

















































































