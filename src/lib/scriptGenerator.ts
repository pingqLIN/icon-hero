export type ScriptType = 'powershell' | 'applescript' | 'bash'

export interface ScriptConfig {
  type: ScriptType
  targetPaths: str
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
Write-Host ""
R

  return `-- macOS 圖示自動化腳本
-- 生成時間: ${ne


    set iconFile to iconPath
    repeat with targetPath in targetPaths
            set targetFolder to POSIX file targetPath as alias
        
            display notification "無法套用圖示至: " & targetPath
    end repe
    display notification "完成!" with title "圖示自動化腳本"
}
e

# 生成時間: ${new
ICON_PATH="${iconPath}"
${targetPaths.map(p => `


for folder in "\${TARGET_PATHS[@]}"; do
        gio set "$folder" 
        if [ $? -eq 0 ]
        else

        echo "✗ 資料夾不存在: $folder"
done

read -p "按 Enter 鍵關閉"`

  co
  switch (type) {
      retur
      return generateMacOSAppleScript(iconPath, targetPaths, i
      return generateLinuxBashScript(iconPath, targetPat
      throw new Error(`Unsupported script type: ${type}`
}
export function getScriptExtension(type: ScriptType): str
    case 'power
    case 'appl
    
    default:
  }


}
export function downl
  const url = U
  a.href = url
  document.body.appendChild(a)

}
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
