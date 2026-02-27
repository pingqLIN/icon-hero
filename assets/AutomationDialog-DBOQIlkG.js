import{r as l,j as e,i as y,a1 as _,a2 as v,a3 as A,a4 as L,a5 as W,s as E}from"./vendor-react-C6e-5eE6.js";import{D as k,a as O,b as D,c as T,d as R}from"./dialog-n6Et0HJq.js";import{B as H,a as u,S as z}from"./index-C7NKU9uD.js";import{T as C,a as b,b as c,L as h,F as U}from"./FolderPathInput-DyixXoL2.js";import{ag as $}from"./vendor-misc-DGu4uscJ.js";import{m as K}from"./vendor-motion-DHv8ew7D.js";import"./vendor-ui-BQCqNqg0.js";import"./vendor-spark-DzJFg9d8.js";import"./vendor-utils-BkFDvfcB.js";function q(t){const a=t.targetPaths.map(r=>r.replace(/\\/g,"\\\\")),s=t.iconPath.replace(/\\/g,"\\\\");return`# Windows 圖示自動化腳本
# 生成時間: ${new Date().toLocaleString("zh-TW")}

# ---------- 工具函數 ----------

# 正規化路徑：展開環境變數、去尾斜線、正斜線轉反斜線
function Normalize-FolderPath {
    param([string]$RawPath)
    $expanded = [System.Environment]::ExpandEnvironmentVariables($RawPath)
    $expanded = $expanded.Replace('/', '\\\\')
    $expanded = $expanded.TrimEnd('\\\\')
    if ($expanded -match '^[A-Za-z]:$') { $expanded += '\\\\' }
    return $expanded
}

# 模糊搜尋
function Find-SimilarFolder {
    param([string]$TargetPath)
    $parentDir = Split-Path -Parent $TargetPath
    $folderName = Split-Path -Leaf $TargetPath
    if (-not (Test-Path $parentDir)) { return $null }
    
    $exact = Get-ChildItem -Path $parentDir -Directory -ErrorAction SilentlyContinue |
        Where-Object { $_.Name -ieq $folderName } | Select-Object -First 1
    if ($exact) { return $exact.FullName }
    
    $keyword = $folderName -replace '[-_\\s]+', '*'
    $partial = Get-ChildItem -Path $parentDir -Directory -ErrorAction SilentlyContinue |
        Where-Object { $_.Name -ilike "*$keyword*" } | Select-Object -First 5
    if ($partial) { return $partial }
    return $null
}

# ---------- 主程式 ----------

$iconPath = "${s}"
$rawFolders = @(
${a.map(r=>`    "${r}"`).join(`,
`)}
)

Write-Host "開始套用圖示..."
Write-Host ""

$successCount = 0
$failCount = 0
$skipCount = 0

foreach ($rawPath in $rawFolders) {
    $folder = Normalize-FolderPath $rawPath
    if ($folder -ne $rawPath) {
        Write-Host "  [INFO] 路徑已正規化: $rawPath -> $folder" -ForegroundColor DarkGray
    }
    
    if (Test-Path $folder) {
        if (-not (Test-Path $folder -PathType Container)) {
            Write-Host "  [SKIP] 不是資料夾: $folder" -ForegroundColor Yellow
            $skipCount++
            continue
        }
        try {
            $desktopIni = Join-Path $folder "desktop.ini"
            if (Test-Path $desktopIni) { attrib -h -s $desktopIni 2>$null }
            @"
[.ShellClassInfo]
IconResource=$iconPath,0
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
        Write-Host "  [WARN] 找不到: $folder" -ForegroundColor Yellow
        $similar = Find-SimilarFolder $folder
        if ($similar -is [System.IO.DirectoryInfo] -or $similar -is [string]) {
            $suggestedPath = if ($similar -is [string]) { $similar } else { $similar.FullName }
            Write-Host "         你是不是要找: $suggestedPath" -ForegroundColor DarkYellow
            Write-Host "         自動使用此路徑..." -ForegroundColor DarkYellow
            try {
                $desktopIni = Join-Path $suggestedPath "desktop.ini"
                if (Test-Path $desktopIni) { attrib -h -s $desktopIni 2>$null }
                @"
[.ShellClassInfo]
IconResource=$iconPath,0
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
            Write-Host "         找到類似資料夾：" -ForegroundColor DarkYellow
            foreach ($s in $similar) { Write-Host "           - $($s.FullName)" -ForegroundColor DarkYellow }
            $skipCount++
        } else {
            Write-Host "         上層目錄也不存在" -ForegroundColor Red
            $failCount++
        }
    }
}

Write-Host ""
Write-Host "完成！成功: $successCount / 跳過: $skipCount / 失敗: $failCount"
${t.isInlineMode?"":'Read-Host "按 Enter 鍵關閉"'}
`}function G(t){const a=t.iconPath.replace(/"/g,'\\"'),s=t.targetPaths.map(r=>r.replace(/"/g,'\\"'));return`#!/bin/bash
# macOS 圖示自動化腳本
# 生成時間: ${new Date().toLocaleString("zh-TW")}

normalize_path() {
    local raw="$1"
    if [[ "$raw" == ~* ]]; then raw="\${raw/#\\~/$HOME}"; fi
    raw="\${raw%/}"
    echo "$raw"
}

find_similar() {
    local target="$1" parent_dir folder_name found
    parent_dir="$(dirname "$target")"
    folder_name="$(basename "$target")"
    if [ ! -d "$parent_dir" ]; then return 1; fi
    found=$(find "$parent_dir" -maxdepth 1 -type d -iname "$folder_name" 2>/dev/null | head -1)
    if [ -n "$found" ]; then echo "$found"; return 0; fi
    found=$(find "$parent_dir" -maxdepth 1 -type d -iname "*$folder_name*" 2>/dev/null | head -5)
    if [ -n "$found" ]; then echo "$found"; return 2; fi
    return 1
}

apply_icon() {
    local folder="$1" icon="$2"
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

ICON_PATH="${a}"
RAW_FOLDERS=(
${s.map(r=>`    "${r}"`).join(`
`)}
)

echo "開始套用圖示..."
echo ""
SUCCESS=0; FAIL=0; SKIP=0

for raw in "\${RAW_FOLDERS[@]}"; do
    folder=$(normalize_path "$raw")
    if [ "$folder" != "$raw" ]; then echo "  [INFO] 路徑已正規化: $raw -> $folder"; fi
    
    if [ -d "$folder" ]; then
        apply_icon "$folder" "$ICON_PATH"
        if [ $? -eq 0 ]; then echo "  [OK] $folder"; ((SUCCESS++))
        else echo "  [FAIL] $folder"; ((FAIL++)); fi
    else
        echo "  [WARN] 找不到: $folder"
        similar=$(find_similar "$folder"); ret=$?
        if [ $ret -eq 0 ] && [ -n "$similar" ]; then
            echo "         自動比對到: $similar"
            apply_icon "$similar" "$ICON_PATH"
            if [ $? -eq 0 ]; then echo "  [OK] $similar (模糊比對)"; ((SUCCESS++))
            else echo "  [FAIL] $similar"; ((FAIL++)); fi
        elif [ $ret -eq 2 ] && [ -n "$similar" ]; then
            echo "         找到類似資料夾："; echo "$similar" | while read -r l; do echo "           - $l"; done
            ((SKIP++))
        else echo "         上層目錄也不存在"; ((FAIL++)); fi
    fi
done

echo ""
echo "完成！成功: $SUCCESS / 跳過: $SKIP / 失敗: $FAIL"
read -p "按 Enter 鍵關閉"
`}function M(t){const a=t.targetPaths.map(r=>r.replace(/"/g,'\\"')),s=t.iconPath.replace(/"/g,'\\"');return`#!/bin/bash
# Linux 圖示自動化腳本
# 生成時間: ${new Date().toLocaleString("zh-TW")}

normalize_path() {
    local raw="$1"
    if [[ "$raw" == ~* ]]; then raw="\${raw/#\\~/$HOME}"; fi
    raw="\${raw%/}"
    echo "$raw"
}

find_similar() {
    local target="$1" parent_dir folder_name found
    parent_dir="$(dirname "$target")"
    folder_name="$(basename "$target")"
    if [ ! -d "$parent_dir" ]; then return 1; fi
    found=$(find "$parent_dir" -maxdepth 1 -type d -iname "$folder_name" 2>/dev/null | head -1)
    if [ -n "$found" ]; then echo "$found"; return 0; fi
    found=$(find "$parent_dir" -maxdepth 1 -type d -iname "*$folder_name*" 2>/dev/null | head -5)
    if [ -n "$found" ]; then echo "$found"; return 2; fi
    return 1
}

ICON_PATH="${s}"
RAW_FOLDERS=(
${a.map(r=>`    "${r}"`).join(`
`)}
)

# 檢查 gio
if ! command -v gio &>/dev/null; then
    echo "錯誤：找不到 gio，請安裝 gvfs"
    read -p "按 Enter 鍵關閉"; exit 1
fi

echo "開始套用圖示..."
echo ""
SUCCESS=0; FAIL=0; SKIP=0

for raw in "\${RAW_FOLDERS[@]}"; do
    folder=$(normalize_path "$raw")
    if [ "$folder" != "$raw" ]; then echo "  [INFO] 路徑已正規化: $raw -> $folder"; fi
    
    if [ -d "$folder" ]; then
        gio set "$folder" metadata::custom-icon "file://$ICON_PATH" 2>/dev/null
        if [ $? -eq 0 ]; then echo "  [OK] $folder"; ((SUCCESS++))
        else echo "  [FAIL] $folder"; ((FAIL++)); fi
    else
        echo "  [WARN] 找不到: $folder"
        similar=$(find_similar "$folder"); ret=$?
        if [ $ret -eq 0 ] && [ -n "$similar" ]; then
            echo "         自動比對到: $similar"
            gio set "$similar" metadata::custom-icon "file://$ICON_PATH" 2>/dev/null
            if [ $? -eq 0 ]; then echo "  [OK] $similar (模糊比對)"; ((SUCCESS++))
            else echo "  [FAIL] $similar"; ((FAIL++)); fi
        elif [ $ret -eq 2 ] && [ -n "$similar" ]; then
            echo "         找到類似資料夾："; echo "$similar" | while read -r l; do echo "           - $l"; done
            ((SKIP++))
        else echo "         上層目錄也不存在"; ((FAIL++)); fi
    fi
done

echo ""
echo "完成！成功: $SUCCESS / 跳過: $SKIP / 失敗: $FAIL"
read -p "按 Enter 鍵關閉"
`}function Y(t,a){switch(a){case"powershell":return q(t);case"applescript":return G(t);case"bash":return M(t);default:throw new Error(`Unsupported script type: ${a}`)}}function B(t){switch(t){case"powershell":return"ps1";case"applescript":return"scpt";case"bash":return"sh";default:return"txt"}}function V(t){switch(t){case"powershell":return`1. 右鍵點擊腳本檔案
2. 選擇「以 PowerShell 執行」
3. 如遇執行政策限制，請以管理員身分執行 PowerShell 並執行：Set-ExecutionPolicy RemoteSigned`;case"applescript":return`1. 雙擊腳本檔案執行
2. 或使用「腳本編輯器」開啟並執行
3. 首次執行可能需要授予「Finder」存取權限`;case"bash":return`1. 開啟終端機
2. 執行：chmod +x script.sh
3. 執行：./script.sh
4. 需要安裝 gvfs 套件（Ubuntu/Debian：sudo apt install gvfs）`;default:return"請參考對應作業系統的執行說明"}}function J(t,a){const s=new Blob([t],{type:"text/plain"}),r=URL.createObjectURL(s),i=document.createElement("a");i.href=r,i.download=a,document.body.appendChild(i),i.click(),document.body.removeChild(i),URL.revokeObjectURL(r)}const m=()=>{const t=navigator.userAgent.toLowerCase();return t.includes("win")?"powershell":t.includes("mac")?"applescript":"bash"},f=m();function ie({item:t,open:a,onOpenChange:s}){const[r,i]=l.useState(()=>m()),[x,g]=l.useState("file"),[d,w]=l.useState([]),[o,S]=l.useState("");if(l.useEffect(()=>{a&&(i(m()),g("file"),w([]),S(""))},[a]),!t||t.status!=="completed")return null;const p=n=>{switch(n){case"powershell":return"ico";case"applescript":return"icns";case"bash":return"png"}},P=()=>{if(d.length===0){$.error("請至少新增一個目標路徑");return}const n=p(r),F=`/path/to/${t.name}.${n}`,N=Y({targetPaths:d,iconPath:F,isInlineMode:x==="inline"},r);S(N),$.success("腳本已生成")},j=()=>{o&&(navigator.clipboard.writeText(o),$.success("已複製到剪貼簿"))},I=()=>{if(o){const n=B(r);J(o,`${t.name}_automation.${n}`),$.success("腳本已下載")}};return e.jsx(k,{open:a,onOpenChange:s,children:e.jsxs(O,{className:"max-w-3xl max-h-[90vh] overflow-y-auto",children:[e.jsxs(D,{children:[e.jsxs(T,{className:"flex items-center gap-2",children:[e.jsx(y,{size:24,weight:"bold",className:"text-primary"}),"自動化腳本生成器"]}),e.jsx(R,{children:"生成自動化腳本以批次套用圖示至多個資料夾或檔案"})]}),e.jsx(C,{value:r,onValueChange:n=>i(n),className:"w-full",children:e.jsxs(b,{className:"grid w-full grid-cols-3",children:[e.jsxs(c,{value:"powershell",className:"gap-2",children:[e.jsx(_,{size:16,weight:"fill"}),"Windows"]}),e.jsxs(c,{value:"applescript",className:"gap-2",children:[e.jsx(v,{size:16,weight:"fill"}),"macOS"]}),e.jsxs(c,{value:"bash",className:"gap-2",children:[e.jsx(A,{size:16,weight:"fill"}),"Linux"]})]})}),r!==f&&e.jsxs("div",{className:"px-3 py-2 rounded-lg bg-yellow-500/10 border border-yellow-500/30 text-yellow-600 dark:text-yellow-400 text-xs flex items-center gap-2",children:[e.jsx("span",{children:"⚠️"}),e.jsxs("span",{children:["你目前使用的是 ",e.jsx("strong",{children:f==="powershell"?"Windows":f==="applescript"?"macOS":"Linux"}),"， 但選擇了 ",e.jsx("strong",{children:r==="powershell"?"Windows":r==="applescript"?"macOS":"Linux"})," 腳本。 此腳本無法在你目前的系統上直接執行。"]})]}),e.jsxs("div",{className:"space-y-4",children:[e.jsxs("div",{className:"space-y-2",children:[e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsx(h,{className:"text-sm font-semibold",children:"圖示檔案"}),e.jsxs(H,{variant:"secondary",className:"text-xs",children:["推薦: ",p(r).toUpperCase()]})]}),e.jsx("div",{className:"p-3 bg-secondary/20 rounded-lg border border-border",children:e.jsxs("p",{className:"text-sm font-mono text-muted-foreground",children:[t.name,".",p(r)]})})]}),e.jsxs("div",{className:"space-y-2",children:[e.jsx(h,{className:"text-sm font-semibold",children:"目標路徑"}),e.jsx(U,{paths:d,onPathsChange:w,placeholder:r==="powershell"?"C:\\Users\\Username\\Documents\\Folder":r==="applescript"?"/Users/username/Documents/Folder":"/home/username/Documents/Folder"})]}),r==="powershell"&&e.jsxs("div",{className:"flex items-center justify-between p-2.5 bg-secondary/10 rounded-lg border border-border",children:[e.jsx(h,{className:"text-xs text-muted-foreground",children:"腳本格式"}),e.jsx(C,{value:x,onValueChange:n=>g(n),className:"h-auto",children:e.jsxs(b,{className:"h-8",children:[e.jsx(c,{value:"file",className:"text-xs h-7",children:"檔案執行"}),e.jsx(c,{value:"inline",className:"text-xs h-7",children:"複製貼上"})]})})]}),e.jsxs(u,{onClick:P,className:"w-full gap-2",disabled:d.length===0,type:"button",children:[e.jsx(L,{size:16,weight:"fill"}),"生成腳本"]}),o&&e.jsxs(K.div,{initial:{opacity:0,y:10},animate:{opacity:1,y:0},className:"space-y-2",children:[e.jsx(h,{className:"text-sm font-semibold",children:"生成的腳本"}),e.jsx(z,{className:"h-64 w-full rounded-lg border border-border bg-muted/30",children:e.jsx("pre",{className:"p-4 text-xs font-mono",children:e.jsx("code",{children:o})})}),e.jsxs("div",{className:"flex gap-2",children:[e.jsxs(u,{onClick:j,variant:"outline",className:"flex-1 gap-2",type:"button",children:[e.jsx(W,{size:16}),"複製腳本"]}),e.jsxs(u,{onClick:I,className:"flex-1 gap-2",type:"button",children:[e.jsx(E,{size:16}),"下載腳本"]})]}),e.jsxs("div",{className:"p-3 bg-accent/10 rounded-lg border border-accent/20",children:[e.jsx("p",{className:"text-xs font-semibold text-accent-foreground mb-1",children:"使用說明:"}),e.jsx("p",{className:"text-xs text-muted-foreground whitespace-pre-line",children:V(r)})]})]})]})]})})}export{ie as AutomationDialog};
