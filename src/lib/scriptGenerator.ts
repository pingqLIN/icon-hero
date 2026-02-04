export type ScriptType = 'powershell' | 'applescript' | 'bash'

export interface ScriptConfig {
  type: ScriptType
  itemName: string
  targetPaths: string[]

  format: 'png' | 'ico' | 'icns'


)
foreach ($folder in $folders) {
  
        
        @"
IconResource=$iconPath,0

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
Write-Host ""
"@ | Out-File -FilePath $desktopIni -Encoding ASCII -Force
}
        # 設定 desktop.ini 為隱藏和系統檔案
        $desktopIniFile = Get-Item $desktopIni -Force
        $desktopIniFile.Attributes = 'Hidden, System'
set targ
        # 設定資料夾屬性
        $folderItem = Get-Item $folder -Force
        $folderItem.Attributes = $folderItem.Attributes -bor [System.IO.FileAttributes]::ReadOnly
        
        Write-Host "✓ 已套用圖示至: $folder" -ForegroundColor Green
    
        Write-Host "✗ 資料夾不存在: $folder" -ForegroundColor Red
     
 

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
  a.click()
  UR

  switch (type) {
      retur
      return 'scpt'
      return 'sh'
}
export function getScri
    case 'powershell':
    case 'apple
    case 'bash
  }

















































































