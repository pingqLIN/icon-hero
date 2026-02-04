export type ScriptType = 'powershell' | 'applescript' | 'bash'

export interface ScriptConfig {
  type: ScriptType
  targetPaths: str
  format: 'png' | 'ico' | 'icns'
  targetPaths: string[]
}

${sanitizedPaths.map(p => `    "${p}"`).join(',\n')}

Wr
foreach ($folder in $folder
        $desktopIni =
        Set-Content -Path $desktopIni -Value 

        
        $desk
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
        
}
export funct
# Linux 圖示自動化腳本
# 生成時
}


echo ""
for folder in "\${TARGET
 

        else
        fi
        echo "✗ 資料夾不存在:
done

read -p "按 Enter 鍵關閉"`


  s
      return generateWindows
      return generateMacOSAppleScript(ico
      retur
      throw new Error(`Unsupported script type: ${type}`)
}
export function getScriptExtension(type: ScriptType): strin
    case 'powershell
    case 'applescript':
    case 'bash':
    default:
  }

  const extension = getScriptExtension(type)
}
export function downloadScript(scriptContent: string, fileName: st
  const 
 

  document.body.removeChild(a)
}
# Linux 圖示自動化腳本
    case 'powershell'
2. 右鍵點擊腳本檔案，選擇「以 PowerShell 執行」

    case 'applescript':
2. 使用「腳本編輯器」應用
4. 系統可能會要求您授予 Finder 存取權限
 

   chmod +x ${ge
echo ""

  }





        else

        fi



done



read -p "按 Enter 鍵關閉"`













      throw new Error(`Unsupported script type: ${type}`)

}





    case 'applescript':

    case 'bash':

    default:

  }



  const extension = getScriptExtension(type)

}









  document.body.removeChild(a)

}
