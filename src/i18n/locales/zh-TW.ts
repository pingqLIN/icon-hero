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
    urlHint: '支援直接圖檔連結或網站 URL，系統將自動解析網頁中的圖示',

    // URL validation errors
    urlRequired: '請輸入有效的 URL',
    urlInvalidPrefix: 'URL 必須以 http:// 或 https:// 開頭',

    // Workspace
    workspaceTitle: '工作區拖放區',
    step1: '1. ICON 或網址拖拉進工作區',
    step2: '2. 系統自動偵測檔案類型並轉換',
    step3: '3. 提供 PNG / ICO / ICNS 等格式下載',
    workspaceDropIdle: '拖曳檔案或連結到此處',
    workspaceDropProcessing: '正在處理您的圖示...',
    workspaceDropSupportsPrefix: '支援',
    workspaceDropSupportsSuffix: '和網站 URL',
    workspaceDropAutoStart: '系統將自動啟動轉換引擎',
    workspaceDropPasteHint: '貼上也可以',

    // Queue
    queueTitle: '處理佇列',
    queueDragHint: '拖曳功能啟用：長按格式按鈕（PNG / ICO / ICNS）並拖曳至系統檔案或資料夾，即可替換該目標',

    // Empty state
    emptyStateTitle: '尚未載入圖檔',
    emptyStateDescription: '上傳圖檔後即可立即拖曳到系統上進行圖示更換，或轉換為其他格式 (PNG, ICO, ICNS)。',

    // Icon resources section
    iconSitesSectionTitle: '世界前 10 大 Icon 資源網站',
    iconSitesSectionHint: '找到理想圖示後，直接貼上 URL 或下載後拖入上方工作區即可轉換',
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
  }
}

export default zhTW
