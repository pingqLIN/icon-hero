const zhTW = {
  translation: {
    // Header / Logo
    logoSubtitle: '您的終極圖示轉換工具',

    // Buttons
    selectFile: '選擇圖檔',
    processing: '處理中...',
    loadFromUrl: '從 URL 載入',
    load: '載入',

    // URL input
    urlPlaceholder: '輸入圖檔 URL 或網站 URL（例如：https://example.com/icon.png）',
    urlHint: '支援 HTTPS 圖檔連結或 HTTPS 網站 URL，系統將自動解析網頁中的圖示',

    // URL validation errors
    urlRequired: '請輸入有效的 URL',
    urlInvalidPrefix: 'URL 必須以 https:// 開頭',

    // Workspace
    workspaceTitle: '工作區拖放區',
    step1: '1. ICON 或網址拖拉進工作區',
    step2: '2. 系統自動偵測檔案類型並轉換',
    step3: '3. 提供 PNG / ICO / ICNS 等格式下載',
    workspaceDropIdle: '拖曳檔案或連結到此處',
    workspaceDropProcessing: '正在處理您的圖示...',
    workspaceDropSupportsPrefix: '支援',
    workspaceDropSupportsSuffix: '和 HTTPS 網站 URL',
    workspaceDropAutoStart: '系統將自動啟動轉換引擎',
    workspaceDropPasteHint: '貼上也可以',

    // Queue
    queueTitle: '處理佇列',
    queueDragHint: '拖曳功能啟用：長按格式按鈕（PNG / ICO / ICNS）並拖曳至系統檔案或資料夾，即可替換該目標',
    queueEmpty: '尚無處理項目',
    queueClearCompleted: '清除已完成',
    queueBatchDownload: '批次下載',
    queueBatchDownloadDone: '批次下載完成',
    queueBatchDownloadFormatDesc: '已下載所有 {{format}} 格式檔案',
    queueBatchDownloadAllDesc: '已下載所有轉換檔案',
    queueBatchDownloadError: '批次下載時發生錯誤',
    queueDownloadFailed: '下載失敗',
    queueDownloadAllFormats: '下載全部格式',
    queueDownloadAllFormat: '下載所有 {{format}}',
    queueProcessing: '處理中',
    queueCompleted: '已完成',
    queueErrors: '發生錯誤',
    queueOriginalFormat: '原始: {{format}}',
    queueProcessingFormat: '處理中: {{format}}',
    queueActionPreview: '預覽',
    queueActionApplyFolder: '一鍵套用圖示到資料夾',
    queueActionAutomation: '自動化腳本',
    queueDragToSystemTitle: '拖曳至系統檔案/資料夾{{platformHint}}',
    queueDragToSystemWindowsHint: '（推薦 Windows）',
    queueDragToSystemIcoDesc: '拖曳 ICO 至 Windows 資料夾內，然後在資料夾屬性中自訂圖示',
    queueDragToSystemDownloadDesc: '或點擊下載 {{format}} 檔案',
    queueStatus: {
      pending: '等待中',
      analyzing: '分析中',
      converting: '轉換為 {{format}}',
      completed: '完成',
      error: '失敗',
    },

    // Empty state
    emptyStateTitle: '尚未載入圖檔',
    emptyStateDescription: '上傳圖檔後即可立即拖曳到系統上進行圖示更換，或轉換為其他格式 (PNG, ICO, ICNS)。',

    // Icon resources section
    iconSitesSectionTitle: '世界前 10 大 Icon 資源網站',
    iconSitesSectionHint: '找到理想圖示後，直接貼上 URL 或下載後拖入上方工作區即可轉換',
    iconSitesClickHint: '可點選',
    iconSitesLicense: {
      free: '免費',
      freemium: '免費 + 付費',
      paid: '付費',
    },
    iconSites: {
      flaticon: {
        tagline: '全球最大圖示庫，涵蓋扁平、輪廓、3D 等多種風格',
        highlight: '最大圖示庫',
      },
      icons8: {
        tagline: '一鍵調色、多風格切換，支援插畫、照片與 AI 生成資源',
        highlight: '風格多元',
      },
      theNounProject: {
        tagline: '社群設計師貢獻的極簡 SVG 圖示，以「通用語言」為設計哲學',
        highlight: '極簡設計',
      },
      iconfinder: {
        tagline: '高品質圖示市集，從精緻寫實到扁平化應有盡有',
        highlight: '品質首選',
      },
      fontAwesome: {
        tagline: '前端開發的經典圖示套件，支援 CSS/JS 快速引入',
        highlight: '前端經典',
      },
      phosphorIcons: {
        tagline: '6 種筆觸重量彈性切換，MIT 授權，React / Vue 原生支援',
        highlight: '本站採用',
      },
      heroicons: {
        tagline: 'Tailwind CSS 官方圖示，Outline / Solid / Mini 三種規格',
        highlight: 'Tailwind 官方',
      },
      lucide: {
        tagline: 'Feather Icons 的社群繼承者，持續更新擴充，MIT 授權',
        highlight: '社群活躍',
      },
      featherIcons: {
        tagline: '一致描線風格的極簡開源圖示集，適合介面設計配置',
        highlight: '極簡開源',
      },
      materialIcons: {
        tagline: 'Google Material Design 官方圖示，5 種主題風格自由選擇',
        highlight: 'Google 官方',
      },
    },

    // Toast messages
    toastConvertSuccess: '轉換完成',
    toastConvertSuccessDesc: '{{name}} 已成功轉換為所有格式',
    toastConvertError: '轉換失敗',
    toastConvertErrorDesc: '處理 {{name}} 時發生錯誤',
    toastDownloadStart: '下載已開始',

    // Conversion errors
    conversionErrorHttpsOnly: '僅支援 HTTPS 圖檔或網站 URL。',
    conversionErrorNetwork: '遠端網站阻擋或請求失敗，請改用直接圖檔 URL。',
    conversionErrorTooLarge: '遠端檔案太大，無法在瀏覽器端安全轉換。',
    conversionErrorUnsupportedContentType: '這個 URL 沒有回傳圖片或可解析的網頁。',
    conversionErrorHtmlTooLarge: '網頁內容太大，無法在瀏覽器中安全掃描。',
    conversionErrorIconNotFound: '找不到 favicon、Open Graph 圖片、Twitter 圖片或 /favicon.ico。',
    conversionErrorIconNotImage: '解析到的 icon URL 沒有回傳圖片。',
    conversionErrorImageLoadFailed: '圖片無法載入瀏覽器 canvas。',
    conversionErrorCanvasUnavailable: '瀏覽器 canvas 無法使用，不能進行轉換。',
    conversionErrorCanvasExportFailed: '瀏覽器無法匯出轉換後的圖示。',
    conversionErrorUnsupportedFormat: '不支援這個輸出格式。',
    conversionErrorUnknown: '發生未預期錯誤，無法轉換圖示。',

    // Footer
    githubLabel: 'GitHub：',
    disclaimer: '免責聲明：本網站僅提供線上圖檔格式轉換服務，請留意素材版權並確認您擁有合法使用與轉換權利。',
    uploadAriaLabel: '選擇圖檔上傳',

    // Visitor counter
    visitorCount: '累計使用人數',
    visitorLoading: '載入中...',
    visitorError: '無法載入',

    // Language switcher
    language: '語言',
    switchLanguage: '切換語言',

    // Hover help
    helpThemeToggle: '切換明亮或深色場景。',
    helpSelectFile: '選擇一個或多個本機圖示圖片進行轉換。',
    helpLoadFromUrl: '開啟 HTTPS URL 輸入欄位。',
    helpUrlInput: '貼上 HTTPS 圖檔或網站 URL 以解析圖示。',
    helpUrlSubmit: '將這個 HTTPS URL 加入轉換佇列。',
    helpDropZone: '將圖片檔或 HTTPS 連結拖到這裡，也可以聚焦後貼上。',
    helpGithubLink: '開啟 ICON HERO 原始碼 repository。',
    helpLanguageSwitcher: '切換介面語言。',
    helpLanguageOption: '將介面切換為 {{language}}。',
    helpClearCompleted: '從佇列移除已完成項目。',
    helpBatchDownload: '開啟已完成圖示的批次下載選項。',
    helpBatchDownloadAll: '將所有轉換格式打包成一個 ZIP 下載。',
    helpBatchDownloadFormat: '將所有已完成的 {{format}} 檔打包下載。',
    helpPreview: '預覽這個已轉換圖示。',
    helpApplyIcon: '將這個圖示與資料夾套用腳本打包。',
    helpAutomation: '為這個圖示產生自動化腳本。',
    helpFormatButton: '點擊下載 {{format}}，或拖曳到系統目標。',
    helpIconSitesToggle: '展開或收合推薦的 icon 資源網站。',
    helpIconSiteCard: '在新分頁開啟 {{site}}。',
  }
}

export default zhTW
