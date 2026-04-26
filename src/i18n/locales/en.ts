const en = {
  translation: {
    // Header / Logo
    logoSubtitle: 'Your Ultimate Icon Conversion Tool',

    // Buttons
    selectFile: 'Select Image',
    processing: 'Processing...',
    loadFromUrl: 'Load from URL',
    load: 'Load',

    // URL input
    urlPlaceholder: 'Enter image URL or website URL (e.g. https://example.com/icon.png)',
    urlHint: 'Supports direct HTTPS image links or HTTPS website URLs. The system will automatically extract icons from web pages.',

    // URL validation errors
    urlRequired: 'Please enter a valid URL',
    urlInvalidPrefix: 'URL must start with https://',

    // Workspace
    workspaceTitle: 'Workspace Drop Zone',
    step1: '1. Drag an ICON or URL into the workspace',
    step2: '2. System automatically detects file type and converts',
    step3: '3. Download in PNG / ICO / ICNS formats',
    workspaceDropIdle: 'Drag files or links here',
    workspaceDropProcessing: 'Processing your icons...',
    workspaceDropSupportsPrefix: 'Supports',
    workspaceDropSupportsSuffix: 'and HTTPS website URLs',
    workspaceDropAutoStart: 'The conversion engine will start automatically',
    workspaceDropPasteHint: 'Paste works too',

    // Queue
    queueTitle: 'Processing Queue',
    queueDragHint: 'Drag enabled: Long-press a format button (PNG / ICO / ICNS) and drag to a system file or folder to replace the target',
    queueEmpty: 'No items in the queue yet',
    queueClearCompleted: 'Clear completed',
    queueBatchDownload: 'Batch download',
    queueBatchDownloadDone: 'Batch download complete',
    queueBatchDownloadFormatDesc: 'Downloaded all {{format}} files',
    queueBatchDownloadAllDesc: 'Downloaded all converted files',
    queueBatchDownloadError: 'An error occurred during batch download',
    queueDownloadFailed: 'Download failed',
    queueDownloadAllFormats: 'Download all formats',
    queueDownloadAllFormat: 'Download all {{format}}',
    queueProcessing: 'Processing',
    queueCompleted: 'Completed',
    queueErrors: 'Errors',
    queueOriginalFormat: 'Original: {{format}}',
    queueProcessingFormat: 'Processing: {{format}}',
    queueActionPreview: 'Preview',
    queueActionApplyFolder: 'Apply icon to folder',
    queueActionAutomation: 'Automation script',
    queueDragToSystemTitle: 'Drag to a system file/folder{{platformHint}}',
    queueDragToSystemWindowsHint: ' (Recommended for Windows)',
    queueDragToSystemIcoDesc: 'Drag the ICO into a Windows folder, then customize the icon from the folder properties.',
    queueDragToSystemDownloadDesc: 'Or click to download the {{format}} file',
    queueStatus: {
      pending: 'Pending',
      analyzing: 'Analyzing',
      converting: 'Converting to {{format}}',
      completed: 'Completed',
      error: 'Failed',
    },

    // Empty state
    emptyStateTitle: 'No icon loaded yet',
    emptyStateDescription: 'Upload an image to start replacing system icons or convert it into other formats such as PNG, ICO, and ICNS.',

    // Icon resources section
    iconSitesSectionTitle: 'Top 10 Icon Resources',
    iconSitesSectionHint: 'Find an icon you like, then paste the URL or download it and drag it into the workspace above.',
    iconSitesLicense: {
      free: 'Free',
      freemium: 'Free + Paid',
      paid: 'Paid',
    },
    iconSites: {
      flaticon: {
        tagline: 'The largest icon library with flat, outline, and 3D styles.',
        highlight: 'Largest library',
      },
      icons8: {
        tagline: 'Flexible styles with recoloring plus illustration, photo, and AI assets.',
        highlight: 'Style variety',
      },
      theNounProject: {
        tagline: 'Minimal SVG icons contributed by a global design community.',
        highlight: 'Minimal design',
      },
      iconfinder: {
        tagline: 'A premium icon marketplace covering polished and flat styles.',
        highlight: 'Premium picks',
      },
      fontAwesome: {
        tagline: 'A frontend classic with easy CSS and JS integration.',
        highlight: 'Frontend staple',
      },
      phosphorIcons: {
        tagline: 'Six adaptable stroke weights with MIT licensing and React/Vue support.',
        highlight: 'Used here',
      },
      heroicons: {
        tagline: 'Official Tailwind CSS icons with outline, solid, and mini variants.',
        highlight: 'Tailwind official',
      },
      lucide: {
        tagline: 'A fast-moving open-source successor to Feather Icons.',
        highlight: 'Active community',
      },
      featherIcons: {
        tagline: 'A clean open-source icon set with consistent strokes.',
        highlight: 'Minimal OSS',
      },
      materialIcons: {
        tagline: 'Google Material Design icons with five theme styles.',
        highlight: 'Google official',
      },
    },

    // Toast messages
    toastConvertSuccess: 'Conversion complete',
    toastConvertSuccessDesc: '{{name}} has been successfully converted to all formats',
    toastConvertError: 'Conversion failed',
    toastConvertErrorDesc: 'An error occurred while processing {{name}}',
    toastDownloadStart: 'Download started',

    // Conversion errors
    conversionErrorHttpsOnly: 'Only HTTPS image or website URLs are supported.',
    conversionErrorNetwork: 'The remote site blocked or failed the request. Try a direct image URL.',
    conversionErrorTooLarge: 'The remote file is too large for browser-side conversion.',
    conversionErrorUnsupportedContentType: 'This URL does not return an image or supported web page.',
    conversionErrorHtmlTooLarge: 'The web page is too large to scan safely in the browser.',
    conversionErrorIconNotFound: 'No favicon, Open Graph image, Twitter image, or /favicon.ico was found.',
    conversionErrorIconNotImage: 'The discovered icon URL did not return an image.',
    conversionErrorImageLoadFailed: 'The image could not be loaded into the browser canvas.',
    conversionErrorCanvasUnavailable: 'The browser canvas is unavailable for conversion.',
    conversionErrorCanvasExportFailed: 'The browser could not export the converted icon.',
    conversionErrorUnsupportedFormat: 'That output format is not supported.',
    conversionErrorUnknown: 'The icon could not be converted because of an unexpected error.',

    // Footer
    githubLabel: 'GitHub: ',
    disclaimer: 'Disclaimer: This website provides online image format conversion only. Please respect copyright and ensure you have the legal right to use and convert the materials.',
    uploadAriaLabel: 'Select image upload',

    // Visitor counter
    visitorCount: 'Total Visitors',
    visitorLoading: 'Loading...',
    visitorError: 'Unavailable',

    // Language switcher
    language: 'Language',
    switchLanguage: 'Switch language',

    // Hover help
    helpThemeToggle: 'Switch between light and dark scenes.',
    helpSelectFile: 'Choose one or more local icon images to convert.',
    helpLoadFromUrl: 'Open the HTTPS URL input field.',
    helpUrlInput: 'Paste an HTTPS image or website URL for icon extraction.',
    helpUrlSubmit: 'Load this HTTPS URL into the conversion queue.',
    helpDropZone: 'Drop image files or HTTPS links here, or focus this area and paste.',
    helpGithubLink: 'Open the ICON HERO source repository.',
    helpLanguageSwitcher: 'Change the interface language.',
    helpLanguageOption: 'Switch the interface to {{language}}.',
    helpClearCompleted: 'Remove completed items from the queue.',
    helpBatchDownload: 'Open batch download choices for completed icons.',
    helpBatchDownloadAll: 'Download every converted format as one ZIP file.',
    helpBatchDownloadFormat: 'Download all completed {{format}} files as a ZIP.',
    helpPreview: 'Preview this converted icon.',
    helpApplyIcon: 'Package this icon with a folder-apply script.',
    helpAutomation: 'Generate an automation script for this icon.',
    helpFormatButton: 'Click to download {{format}}, or drag it to a system target.',
    helpIconSitesToggle: 'Show or hide recommended icon resource websites.',
    helpIconSiteCard: 'Open {{site}} in a new tab.',
  }
}

export default en
