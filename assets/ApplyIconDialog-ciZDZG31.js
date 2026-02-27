import{r as t,p as S,J as I,j as e,b as A,B as u,a as b,c as E,s as N,t as g}from"./index-CadvBdgV.js";import{L as C,T as j,a as _,b as w,m as W,s as H,c as v,F as R}from"./FolderPathInput-CBFuXsQf.js";import{D as k,a as D,b as L,c as O,d as T}from"./dialog-BDfz3aQ2.js";const Z=new Map([["bold",t.createElement(t.Fragment,null,t.createElement("path",{d:"M108,84a16,16,0,1,1,16,16A16,16,0,0,1,108,84Zm128,44A108,108,0,1,1,128,20,108.12,108.12,0,0,1,236,128Zm-24,0a84,84,0,1,0-84,84A84.09,84.09,0,0,0,212,128Zm-72,36.68V132a20,20,0,0,0-20-20,12,12,0,0,0-4,23.32V168a20,20,0,0,0,20,20,12,12,0,0,0,4-23.32Z"}))],["duotone",t.createElement(t.Fragment,null,t.createElement("path",{d:"M224,128a96,96,0,1,1-96-96A96,96,0,0,1,224,128Z",opacity:"0.2"}),t.createElement("path",{d:"M144,176a8,8,0,0,1-8,8,16,16,0,0,1-16-16V128a8,8,0,0,1,0-16,16,16,0,0,1,16,16v40A8,8,0,0,1,144,176Zm88-48A104,104,0,1,1,128,24,104.11,104.11,0,0,1,232,128Zm-16,0a88,88,0,1,0-88,88A88.1,88.1,0,0,0,216,128ZM124,96a12,12,0,1,0-12-12A12,12,0,0,0,124,96Z"}))],["fill",t.createElement(t.Fragment,null,t.createElement("path",{d:"M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm-4,48a12,12,0,1,1-12,12A12,12,0,0,1,124,72Zm12,112a16,16,0,0,1-16-16V128a8,8,0,0,1,0-16,16,16,0,0,1,16,16v40a8,8,0,0,1,0,16Z"}))],["light",t.createElement(t.Fragment,null,t.createElement("path",{d:"M142,176a6,6,0,0,1-6,6,14,14,0,0,1-14-14V128a2,2,0,0,0-2-2,6,6,0,0,1,0-12,14,14,0,0,1,14,14v40a2,2,0,0,0,2,2A6,6,0,0,1,142,176ZM124,94a10,10,0,1,0-10-10A10,10,0,0,0,124,94Zm106,34A102,102,0,1,1,128,26,102.12,102.12,0,0,1,230,128Zm-12,0a90,90,0,1,0-90,90A90.1,90.1,0,0,0,218,128Z"}))],["regular",t.createElement(t.Fragment,null,t.createElement("path",{d:"M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm16-40a8,8,0,0,1-8,8,16,16,0,0,1-16-16V128a8,8,0,0,1,0-16,16,16,0,0,1,16,16v40A8,8,0,0,1,144,176ZM112,84a12,12,0,1,1,12,12A12,12,0,0,1,112,84Z"}))],["thin",t.createElement(t.Fragment,null,t.createElement("path",{d:"M140,176a4,4,0,0,1-4,4,12,12,0,0,1-12-12V128a4,4,0,0,0-4-4,4,4,0,0,1,0-8,12,12,0,0,1,12,12v40a4,4,0,0,0,4,4A4,4,0,0,1,140,176ZM124,92a8,8,0,1,0-8-8A8,8,0,0,0,124,92Zm104,36A100,100,0,1,1,128,28,100.11,100.11,0,0,1,228,128Zm-8,0a92,92,0,1,0-92,92A92.1,92.1,0,0,0,220,128Z"}))]]),P=t.forwardRef((o,a)=>t.createElement(S,{ref:a,...o,weights:Z}));P.displayName="InfoIcon";const M=P;function F(o){switch(o){case"windows":return"ico";case"macos":return"icns";case"linux":return"png"}}function U(o){switch(o){case"windows":return"apply-icon.ps1";case"macos":return"apply-icon.command";case"linux":return"apply-icon.sh"}}function z(o,a){const n=F(a);return`${o}.${n}`}function K(o,a){return`# ============================================
# Windows 資料夾圖示一鍵套用腳本
# 生成時間: ${new Date().toLocaleString("zh-TW")}
# ============================================
# 使用方式：右鍵此檔案 → 以 PowerShell 執行
# ============================================

# ---------- 工具函數 ----------

# 正規化路徑：展開環境變數、去尾斜線、正斜線轉反斜線
function Normalize-FolderPath {
    param([string]$RawPath)
    # 展開環境變數（如 %USERPROFILE%）
    $expanded = [System.Environment]::ExpandEnvironmentVariables($RawPath)
    # 正斜線轉反斜線
    $expanded = $expanded.Replace('/', '\\\\')
    # 去除結尾斜線（但保留根路徑如 C:\\）
    $expanded = $expanded.TrimEnd('\\\\')
    if ($expanded -match '^[A-Za-z]:$') { $expanded += '\\\\' }
    return $expanded
}

# 模糊搜尋：若路徑不存在，在上層目錄搜尋名稱相似的資料夾
function Find-SimilarFolder {
    param([string]$TargetPath)
    $parentDir = Split-Path -Parent $TargetPath
    $folderName = Split-Path -Leaf $TargetPath
    
    if (-not (Test-Path $parentDir)) { return $null }
    
    # 1. 不區分大小寫完全比對
    $exact = Get-ChildItem -Path $parentDir -Directory -ErrorAction SilentlyContinue |
        Where-Object { $_.Name -ieq $folderName } | Select-Object -First 1
    if ($exact) { return $exact.FullName }
    
    # 2. 包含關鍵字比對（如 "my-project" 可以找到 "My Project"）
    $keyword = $folderName -replace '[-_\\s]+', '*'
    $partial = Get-ChildItem -Path $parentDir -Directory -ErrorAction SilentlyContinue |
        Where-Object { $_.Name -ilike "*$keyword*" } | Select-Object -First 5
    if ($partial) { return $partial }
    
    return $null
}

# ---------- 主程式 ----------

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$iconPath = Join-Path $scriptDir "${o}"

if (-not (Test-Path $iconPath)) {
    Write-Host "錯誤：找不到圖示檔案 $iconPath" -ForegroundColor Red
    Write-Host "請確認圖示檔案與腳本在同一個資料夾中" -ForegroundColor Yellow
    Read-Host "按 Enter 鍵關閉"
    exit 1
}

$iconFullPath = (Resolve-Path $iconPath).Path

# 原始目標清單
$rawFolders = @(
${a.map(n=>`    "${n.replace(/\\/g,"\\\\")}"`).join(`,
`)}
)

Write-Host ""
Write-Host "====================================" -ForegroundColor Cyan
Write-Host "  資料夾圖示一鍵套用工具" -ForegroundColor Cyan
Write-Host "====================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "圖示檔案: $iconFullPath" -ForegroundColor Gray
Write-Host "目標資料夾數量: $($rawFolders.Count)" -ForegroundColor Gray
Write-Host ""

$successCount = 0
$failCount = 0
$skipCount = 0

foreach ($rawPath in $rawFolders) {
    # Step 1: 正規化路徑
    $folder = Normalize-FolderPath $rawPath
    
    if ($folder -ne $rawPath) {
        Write-Host "  [INFO] 路徑已正規化: $rawPath -> $folder" -ForegroundColor DarkGray
    }
    
    # Step 2: 檢查路徑是否存在
    if (Test-Path $folder) {
        # 確認是資料夾（不是檔案）
        if (-not (Test-Path $folder -PathType Container)) {
            Write-Host "  [SKIP] 不是資料夾（是檔案）: $folder" -ForegroundColor Yellow
            $skipCount++
            continue
        }
        
        try {
            $desktopIni = Join-Path $folder "desktop.ini"

            if (Test-Path $desktopIni) {
                attrib -h -s $desktopIni 2>$null
            }

            @"
[.ShellClassInfo]
IconResource=$iconFullPath,0
"@ | Set-Content -Path $desktopIni -Encoding Unicode

            attrib +h +s $desktopIni
            attrib +s $folder

            Write-Host "  [OK] $folder" -ForegroundColor Green
            $successCount++
        } catch {
            Write-Host "  [FAIL] $folder - $($_.Exception.Message)" -ForegroundColor Red
            $failCount++
        }
    } else {
        # Step 3: 路徑不存在 → 嘗試模糊搜尋
        Write-Host "  [WARN] 找不到: $folder" -ForegroundColor Yellow
        
        $similar = Find-SimilarFolder $folder
        if ($similar -is [System.IO.DirectoryInfo] -or $similar -is [string]) {
            $suggestedPath = if ($similar -is [string]) { $similar } else { $similar.FullName }
            Write-Host "          你是不是要找: $suggestedPath" -ForegroundColor DarkYellow
            Write-Host "          自動使用此路徑套用圖示..." -ForegroundColor DarkYellow
            
            try {
                $desktopIni = Join-Path $suggestedPath "desktop.ini"
                if (Test-Path $desktopIni) { attrib -h -s $desktopIni 2>$null }
                @"
[.ShellClassInfo]
IconResource=$iconFullPath,0
"@ | Set-Content -Path $desktopIni -Encoding Unicode
                attrib +h +s $desktopIni
                attrib +s $suggestedPath
                Write-Host "  [OK] $suggestedPath (模糊比對)" -ForegroundColor Green
                $successCount++
            } catch {
                Write-Host "  [FAIL] $suggestedPath - $($_.Exception.Message)" -ForegroundColor Red
                $failCount++
            }
        } elseif ($similar -is [System.Array] -and $similar.Count -gt 0) {
            Write-Host "          找到 $($similar.Count) 個類似資料夾：" -ForegroundColor DarkYellow
            foreach ($s in $similar) {
                Write-Host "            - $($s.FullName)" -ForegroundColor DarkYellow
            }
            Write-Host "          請修改腳本中的路徑後重新執行" -ForegroundColor DarkYellow
            $skipCount++
        } else {
            Write-Host "          上層目錄也不存在，請確認路徑是否正確" -ForegroundColor Red
            $failCount++
        }
    }
}

Write-Host ""
Write-Host "====================================" -ForegroundColor Cyan
Write-Host "  完成！成功: $successCount / 跳過: $skipCount / 失敗: $failCount" -ForegroundColor Cyan
Write-Host "====================================" -ForegroundColor Cyan
Write-Host ""

# 重新整理圖示快取
Write-Host "正在重新整理圖示快取..." -ForegroundColor Gray
ie4uinit.exe -show 2>$null
Write-Host "完成。如果圖示沒有立即更新，請重新啟動檔案總管或登出再登入。" -ForegroundColor Gray
Write-Host ""
Read-Host "按 Enter 鍵關閉"
`}function G(o,a){return`#!/bin/bash
# ============================================
# macOS 資料夾圖示一鍵套用腳本
# 生成時間: ${new Date().toLocaleString("zh-TW")}
# ============================================
# 使用方式：雙擊此檔案即可執行
# ============================================

# ---------- 工具函數 ----------

# 正規化路徑：展開 ~ 和環境變數、去除尾斜線
normalize_path() {
    local raw="$1"
    # 展開 ~ 為 $HOME
    if [[ "$raw" == ~* ]]; then
        raw="\${raw/#\\~/$HOME}"
    fi
    # 去除結尾斜線
    raw="\${raw%/}"
    echo "$raw"
}

# 模糊搜尋：路徑不存在時，在上層目錄不區分大小寫搜尋
find_similar() {
    local target="$1"
    local parent_dir
    local folder_name
    parent_dir="$(dirname "$target")"
    folder_name="$(basename "$target")"
    
    if [ ! -d "$parent_dir" ]; then
        return 1
    fi
    
    # 不區分大小寫搜尋同名資料夾
    local found
    found=$(find "$parent_dir" -maxdepth 1 -type d -iname "$folder_name" 2>/dev/null | head -1)
    if [ -n "$found" ]; then
        echo "$found"
        return 0
    fi
    
    # 部分比對（包含關鍵字）
    found=$(find "$parent_dir" -maxdepth 1 -type d -iname "*$folder_name*" 2>/dev/null | head -5)
    if [ -n "$found" ]; then
        echo "$found"
        return 2  # 回傳碼 2 表示多個候選
    fi
    
    return 1
}

# 套用圖示到資料夾
apply_icon() {
    local folder="$1"
    local icon="$2"
    if command -v fileicon &>/dev/null; then
        fileicon set "$folder" "$icon" 2>/dev/null
    else
        osascript -e "
            use framework \\"AppKit\\"
            set iconImage to current application's NSImage's alloc()'s initWithContentsOfFile:\\"$icon\\"
            current application's NSWorkspace's sharedWorkspace()'s setIcon:iconImage forFile:\\"$folder\\" options:0
        " 2>/dev/null
    fi
    return $?
}

# ---------- 主程式 ----------

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
ICON_PATH="$SCRIPT_DIR/${o}"

if [ ! -f "$ICON_PATH" ]; then
    echo "錯誤：找不到圖示檔案 $ICON_PATH"
    echo "請確認圖示檔案與腳本在同一個資料夾中"
    read -p "按 Enter 鍵關閉"
    exit 1
fi

echo ""
echo "===================================="
echo "  資料夾圖示一鍵套用工具 (macOS)"
echo "===================================="
echo ""

RAW_FOLDERS=(
${a.map(n=>`    "${n.replace(/"/g,'\\"')}"`).join(`
`)}
)

SUCCESS=0
FAIL=0
SKIP=0

for raw in "\${RAW_FOLDERS[@]}"; do
    folder=$(normalize_path "$raw")
    
    if [ "$folder" != "$raw" ]; then
        echo "  [INFO] 路徑已正規化: $raw -> $folder"
    fi
    
    if [ -d "$folder" ]; then
        apply_icon "$folder" "$ICON_PATH"
        if [ $? -eq 0 ]; then
            echo "  [OK] $folder"
            ((SUCCESS++))
        else
            echo "  [FAIL] $folder"
            ((FAIL++))
        fi
    else
        echo "  [WARN] 找不到: $folder"
        
        similar=$(find_similar "$folder")
        ret=$?
        
        if [ $ret -eq 0 ] && [ -n "$similar" ]; then
            echo "         自動比對到: $similar"
            apply_icon "$similar" "$ICON_PATH"
            if [ $? -eq 0 ]; then
                echo "  [OK] $similar (模糊比對)"
                ((SUCCESS++))
            else
                echo "  [FAIL] $similar"
                ((FAIL++))
            fi
        elif [ $ret -eq 2 ] && [ -n "$similar" ]; then
            echo "         找到類似的資料夾："
            echo "$similar" | while read -r line; do
                echo "           - $line"
            done
            echo "         請修改腳本中的路徑後重新執行"
            ((SKIP++))
        else
            echo "         上層目錄也不存在，請確認路徑是否正確"
            ((FAIL++))
        fi
    fi
done

echo ""
echo "===================================="
echo "  完成！成功: $SUCCESS / 跳過: $SKIP / 失敗: $FAIL"
echo "===================================="
echo ""
read -p "按 Enter 鍵關閉"
`}function q(o,a){return`#!/bin/bash
# ============================================
# Linux 資料夾圖示一鍵套用腳本
# 生成時間: ${new Date().toLocaleString("zh-TW")}
# ============================================
# 使用方式：終端機執行 chmod +x apply-icon.sh && ./apply-icon.sh
# ============================================

# ---------- 工具函數 ----------

normalize_path() {
    local raw="$1"
    if [[ "$raw" == ~* ]]; then
        raw="\${raw/#\\~/$HOME}"
    fi
    raw="\${raw%/}"
    echo "$raw"
}

find_similar() {
    local target="$1"
    local parent_dir folder_name found
    parent_dir="$(dirname "$target")"
    folder_name="$(basename "$target")"
    
    if [ ! -d "$parent_dir" ]; then return 1; fi
    
    found=$(find "$parent_dir" -maxdepth 1 -type d -iname "$folder_name" 2>/dev/null | head -1)
    if [ -n "$found" ]; then echo "$found"; return 0; fi
    
    found=$(find "$parent_dir" -maxdepth 1 -type d -iname "*$folder_name*" 2>/dev/null | head -5)
    if [ -n "$found" ]; then echo "$found"; return 2; fi
    
    return 1
}

# ---------- 主程式 ----------

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
ICON_PATH="$SCRIPT_DIR/${o}"

if [ ! -f "$ICON_PATH" ]; then
    echo "錯誤：找不到圖示檔案 $ICON_PATH"
    echo "請確認圖示檔案與腳本在同一個資料夾中"
    read -p "按 Enter 鍵關閉"
    exit 1
fi

# 檢查 gio 是否可用
if ! command -v gio &>/dev/null; then
    echo "錯誤：找不到 gio 指令"
    echo "請安裝：sudo apt install gvfs (Debian/Ubuntu)"
    read -p "按 Enter 鍵關閉"
    exit 1
fi

echo ""
echo "===================================="
echo "  資料夾圖示一鍵套用工具 (Linux)"
echo "===================================="
echo ""

RAW_FOLDERS=(
${a.map(n=>`    "${n.replace(/"/g,'\\"')}"`).join(`
`)}
)

SUCCESS=0
FAIL=0
SKIP=0

for raw in "\${RAW_FOLDERS[@]}"; do
    folder=$(normalize_path "$raw")
    
    if [ "$folder" != "$raw" ]; then
        echo "  [INFO] 路徑已正規化: $raw -> $folder"
    fi
    
    if [ -d "$folder" ]; then
        gio set "$folder" metadata::custom-icon "file://$ICON_PATH" 2>/dev/null
        if [ $? -eq 0 ]; then
            echo "  [OK] $folder"
            ((SUCCESS++))
        else
            echo "  [FAIL] $folder"
            ((FAIL++))
        fi
    else
        echo "  [WARN] 找不到: $folder"
        
        similar=$(find_similar "$folder")
        ret=$?
        
        if [ $ret -eq 0 ] && [ -n "$similar" ]; then
            echo "         自動比對到: $similar"
            gio set "$similar" metadata::custom-icon "file://$ICON_PATH" 2>/dev/null
            if [ $? -eq 0 ]; then
                echo "  [OK] $similar (模糊比對)"
                ((SUCCESS++))
            else
                echo "  [FAIL] $similar"
                ((FAIL++))
            fi
        elif [ $ret -eq 2 ] && [ -n "$similar" ]; then
            echo "         找到類似的資料夾："
            echo "$similar" | while read -r line; do
                echo "           - $line"
            done
            echo "         請修改腳本中的路徑後重新執行"
            ((SKIP++))
        else
            echo "         上層目錄也不存在，請確認路徑是否正確"
            ((FAIL++))
        fi
    fi
done

echo ""
echo "===================================="
echo "  完成！成功: $SUCCESS / 跳過: $SKIP / 失敗: $FAIL"
echo "===================================="
echo ""
read -p "按 Enter 鍵關閉"
`}function V(o,a){return`===================================
  資料夾圖示一鍵套用工具
  Icon Changer - Apply Package
===================================

${{windows:`使用方式（Windows）：
1. 將此資料夾解壓縮到任意位置
2. 確認「${a}」和「apply-icon.ps1」在同一個資料夾中
3. 右鍵點擊「apply-icon.ps1」→ 選擇「以 PowerShell 執行」
4. 腳本會自動將圖示套用到所有目標資料夾

如果出現「執行原則」錯誤：
- 以管理員身分開啟 PowerShell
- 執行：Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
- 再次執行腳本

如果圖示沒有立即更新：
- 重新啟動檔案總管（工作管理員 → 重新啟動 explorer.exe）
- 或登出再登入`,macos:`使用方式（macOS）：
1. 將此資料夾解壓縮到任意位置
2. 確認「${a}」和「apply-icon.command」在同一個資料夾中
3. 雙擊「apply-icon.command」即可執行
4. 首次執行可能需要在「系統偏好設定 → 安全性」中允許

如果無法執行：
- 開啟終端機
- 執行：chmod +x apply-icon.command
- 再次雙擊執行`,linux:`使用方式（Linux）：
1. 將此資料夾解壓縮到任意位置
2. 確認「${a}」和「apply-icon.sh」在同一個資料夾中
3. 開啟終端機，切換到此資料夾
4. 執行：chmod +x apply-icon.sh
5. 執行：./apply-icon.sh

需要的套件：
- GNOME：通常已內建 gio
- 其他桌面環境：sudo apt install gvfs（Debian/Ubuntu）`}[o]}

---
由 Icon Changer 自動生成
${new Date().toLocaleString("zh-TW")}
`}async function B(o){const{iconBlob:a,iconName:n,targetPaths:i,platform:l}=o,d=new I,m=`${n}-icon-apply`,$=d.folder(m);if(!$)throw new Error("無法建立 ZIP 資料夾");const c=z(n,l);$.file(c,a);let s;switch(l){case"windows":s=K(c,i);break;case"macos":s=G(c,i);break;case"linux":s=q(c,i);break}const h=U(l);$.file(h,s);const x=V(l,c);$.file("README.txt",x);const y=await d.generateAsync({type:"blob"}),p=URL.createObjectURL(y),r=document.createElement("a");r.href=p,r.download=`${m}.zip`,document.body.appendChild(r),r.click(),document.body.removeChild(r),URL.revokeObjectURL(p)}function X({item:o,open:a,onOpenChange:n}){const[i,l]=t.useState("windows"),[d,m]=t.useState([]),[$,c]=t.useState(!1);if(t.useEffect(()=>{const r=navigator.userAgent.toLowerCase();r.includes("mac")?l("macos"):r.includes("linux")?l("linux"):l("windows")},[]),t.useEffect(()=>{a&&(m([]),c(!1))},[a]),!o||o.status!=="completed")return null;const s=F(i),h=o.convertedBlobs?.[s],x=async()=>{if(d.length===0){g.error("請至少新增一個目標資料夾路徑");return}const r=o.convertedBlobs?.[s];if(!r){g.error(`找不到 ${s.toUpperCase()} 格式的圖示檔案`);return}c(!0);try{await B({iconBlob:r,iconName:o.name,targetPaths:d,platform:i}),g.success("安裝包已下載！",{description:"解壓縮後執行腳本即可套用圖示"}),n(!1)}catch(f){g.error("打包失敗",{description:f instanceof Error?f.message:"未知錯誤"})}finally{c(!1)}},p={windows:{steps:["解壓縮下載的 ZIP","右鍵「apply-icon.ps1」→ 以 PowerShell 執行","圖示會自動套用到所有目標資料夾"],script:"apply-icon.ps1"},macos:{steps:["解壓縮下載的 ZIP","雙擊「apply-icon.command」","首次可能需在「系統偏好 → 安全性」允許"],script:"apply-icon.command"},linux:{steps:["解壓縮下載的 ZIP","終端機執行 chmod +x apply-icon.sh","執行 ./apply-icon.sh"],script:"apply-icon.sh"}}[i];return e.jsx(k,{open:a,onOpenChange:n,children:e.jsxs(D,{className:"max-w-2xl max-h-[90vh] overflow-y-auto",children:[e.jsxs(L,{children:[e.jsxs(O,{className:"flex items-center gap-2",children:[e.jsx(A,{size:24,weight:"fill",className:"text-primary"}),"一鍵套用圖示到資料夾"]}),e.jsx(T,{children:"下載安裝包，解壓縮後執行腳本即可自動替換資料夾圖示"})]}),e.jsxs("div",{className:"space-y-5",children:[e.jsxs("div",{className:"space-y-2",children:[e.jsxs(C,{className:"text-sm font-semibold flex items-center gap-2",children:[e.jsx(u,{variant:"secondary",className:"text-[10px] px-1.5 py-0 font-mono",children:"1"}),"選擇作業系統"]}),e.jsx(j,{value:i,onValueChange:r=>l(r),children:e.jsxs(_,{className:"grid w-full grid-cols-3",children:[e.jsxs(w,{value:"windows",className:"gap-2",children:[e.jsx(W,{size:16,weight:"fill"}),"Windows"]}),e.jsxs(w,{value:"macos",className:"gap-2",children:[e.jsx(H,{size:16,weight:"fill"}),"macOS"]}),e.jsxs(w,{value:"linux",className:"gap-2",children:[e.jsx(v,{size:16,weight:"fill"}),"Linux"]})]})}),e.jsxs("div",{className:"flex items-center justify-between p-2.5 bg-secondary/20 rounded-lg border border-border",children:[e.jsx("span",{className:"text-xs text-muted-foreground",children:"圖示檔案"}),e.jsxs("span",{className:"text-xs font-mono font-semibold",children:[o.name,".",s]}),!h&&e.jsx(u,{variant:"destructive",className:"text-[10px] px-1.5 py-0",children:"格式不可用"})]})]}),e.jsxs("div",{className:"space-y-2",children:[e.jsxs(C,{className:"text-sm font-semibold flex items-center gap-2",children:[e.jsx(u,{variant:"secondary",className:"text-[10px] px-1.5 py-0 font-mono",children:"2"}),"新增目標資料夾路徑"]}),e.jsx(R,{paths:d,onPathsChange:m,placeholder:i==="windows"?"C:\\Users\\Username\\Desktop\\MyFolder":i==="macos"?"/Users/username/Desktop/MyFolder":"/home/username/Desktop/MyFolder"})]}),e.jsxs("div",{className:"space-y-3",children:[e.jsxs(C,{className:"text-sm font-semibold flex items-center gap-2",children:[e.jsx(u,{variant:"secondary",className:"text-[10px] px-1.5 py-0 font-mono",children:"3"}),"下載安裝包"]}),e.jsx(b,{onClick:x,className:"w-full gap-2 h-11",disabled:d.length===0||!h||$,size:"lg",children:$?e.jsxs(e.Fragment,{children:[e.jsx(E,{size:18,className:"animate-spin"}),"正在打包..."]}):e.jsxs(e.Fragment,{children:[e.jsx(N,{size:18,weight:"bold"}),"下載安裝包（",s.toUpperCase()," + 腳本）"]})}),e.jsxs("div",{className:"p-3 bg-accent/10 rounded-lg border border-accent/20",children:[e.jsxs("p",{className:"text-xs font-semibold text-accent-foreground mb-2 flex items-center gap-1",children:[e.jsx(M,{size:14}),"下載後的使用步驟："]}),e.jsx("ol",{className:"text-xs text-muted-foreground space-y-1 list-decimal list-inside",children:p.steps.map((r,f)=>e.jsx("li",{children:r},f))})]})]})]})]})})}export{X as ApplyIconDialog};
