# Planning Guide

A browser-based icon customization tool that enables users to drag image files from the web browser directly onto operating system applications or folders to replace their default icons.

**Experience Qualities**:
1. **Intuitive** - The drag-and-drop interaction should feel natural and immediate, requiring no explanation
2. **Powerful** - Users should feel empowered to customize their system with minimal friction
3. **Polished** - Every visual detail should communicate professionalism and reliability

**Complexity Level**: Light Application (multiple features with basic state)
This is a specialized utility with a focused purpose - browsing/selecting icons, enabling drag mode, and facilitating system icon replacement. It maintains icon collections and operation modes but doesn't require complex routing or heavy data management.

## Essential Features

### Icon Gallery Browser
- **Functionality**: Display a curated collection of icon images in a grid layout that users can browse
- **Purpose**: Provide users with a visual catalog of icons to choose from for system customization
- **Trigger**: Automatically loads when the application opens
- **Progression**: App loads → Icons render in grid → User scrolls to browse collection → User identifies desired icon
- **Success criteria**: All icons load correctly with proper thumbnails, grid is responsive and easy to navigate

### Drag Mode Toggle
- **Functionality**: A prominent toggle switch that enables/disables drag-and-drop functionality
- **Purpose**: Prevent accidental drags and clearly communicate when the app is in "active" mode
- **Trigger**: User clicks the toggle switch
- **Progression**: User clicks toggle → Visual state change indicates mode is active → Icons become draggable → User can now perform drag operations
- **Success criteria**: Clear visual feedback of active/inactive states, drag behavior only works when enabled

### Icon Drag-and-Drop System
- **Functionality**: Enable users to click and drag icon images from the browser window to external system targets (folders, applications) outside the browser
- **Purpose**: Core functionality that allows seamless icon file transfer without traditional downloads, enabling direct system icon replacement
- **Trigger**: User clicks and holds on an icon while in drag mode
- **Progression**: User clicks and holds icon → Drags cursor outside browser window → Hovers over system folder/app in OS → Releases to save/apply icon file
- **Success criteria**: Browser creates proper drag data with DownloadURL format, icons transfer as files to OS, formats are compatible with system icon replacement

### Icon Upload/Add
- **Functionality**: Allow users to upload their own custom icon images to the gallery via file picker or URL
- **Purpose**: Extend the icon collection beyond pre-loaded options and enable loading icons directly from web sources
- **Trigger**: User clicks "Add Icon" button or "從 URL 載入" button
- **Progression**: 
  - File upload: User clicks add button → File picker opens → User selects image → Image validates → New icon appears in gallery
  - URL load: User clicks URL button → URL input appears → User pastes URL → System fetches and parses → If direct image: downloads and displays → If webpage: parses HTML for icon metadata (favicon, og:image, apple-touch-icon) → Icon loads in gallery
- **Success criteria**: Uploaded icons persist, are properly formatted, URL parsing correctly identifies icons from webpages, both methods work with drag system

### Icon Format Conversion
- **Functionality**: Convert icons between PNG, ICO, and ICNS formats with multi-resolution support
- **Purpose**: Enable users to prepare icons for different operating systems (Windows ICO, macOS ICNS) without external tools
- **Trigger**: User clicks the conversion button on an icon card
- **Progression**: User clicks convert button → Dialog opens showing format options → User selects target format → Conversion processes → User can download or add to collection
- **Success criteria**: Accurate format conversion with proper multi-resolution support for ICO/ICNS, converted icons are draggable and downloadable

### Icon Management
- **Functionality**: Display icon metadata and provide delete/organize capabilities
- **Purpose**: Help users curate their personal icon collection
- **Trigger**: User hovers over or selects an icon
- **Progression**: User interacts with icon → Actions appear → User selects delete/info → Confirmation if needed → Action completes
- **Success criteria**: Icons can be removed, collection state persists across sessions

## Edge Case Handling

- **Empty Gallery State**: Display helpful onboarding message with upload prompt when no icons exist
- **Invalid File Types**: Show clear error toast when unsupported image formats are uploaded
- **Large File Uploads**: Validate file size limits and provide feedback for oversized images
- **Drag Without Mode Active**: Prevent drag behavior and show subtle reminder to enable drag mode
- **Failed Persistence**: Gracefully handle storage errors and notify user if icons can't be saved
- **Format Conversion Errors**: Handle conversion failures with clear error messages and suggestions
- **Unsupported Source Formats**: Inform users if source format cannot be reliably converted to target format
- **Conversion of Current Format**: Disable conversion to the same format already being used
- **Invalid URLs**: Validate URL format and show error for malformed URLs
- **URL Fetch Failures**: Handle network errors, CORS issues, and missing resources gracefully
- **URL Without Icons**: When parsing webpage URLs, fallback to /favicon.ico if no icon metadata found
- **Non-Image Content Types**: Detect when URL points to non-image content and attempt to parse as webpage

## Design Direction

The design should evoke a sense of precision, control, and creative empowerment. It should feel like a professional tool that respects the user's system customization workflow - clean, focused, and purposeful with just enough personality to feel delightful rather than sterile.

## Color Selection

A sophisticated, tech-forward palette centered around deep purples and electric accents that communicates both creativity and precision.

- **Primary Color**: Deep Purple `oklch(0.35 0.15 290)` - Communicates creativity, sophistication, and technical capability
- **Secondary Colors**: 
  - Soft Lavender `oklch(0.85 0.08 290)` for backgrounds and subtle containers
  - Dark Charcoal `oklch(0.25 0.02 290)` for text and high-contrast elements
- **Accent Color**: Electric Cyan `oklch(0.75 0.18 210)` - Vibrant highlight for the drag mode toggle and active states, creating visual excitement
- **Foreground/Background Pairings**: 
  - Background White `oklch(0.98 0.005 290)`: Dark Charcoal text `oklch(0.25 0.02 290)` - Ratio 12.8:1 ✓
  - Primary Purple `oklch(0.35 0.15 290)`: White text `oklch(0.98 0.005 290)` - Ratio 8.2:1 ✓
  - Accent Cyan `oklch(0.75 0.18 210)`: Dark Charcoal text `oklch(0.25 0.02 290)` - Ratio 5.1:1 ✓
  - Lavender Background `oklch(0.85 0.08 290)`: Dark Charcoal text `oklch(0.25 0.02 290)` - Ratio 6.9:1 ✓

## Font Selection

Typography should convey modern technical precision while remaining approachable - a geometric sans-serif with strong letter-forms that maintains readability at all sizes.

**Primary Typeface**: Space Grotesk - A distinctive geometric sans with technical character that balances personality with professionalism

- **Typographic Hierarchy**: 
  - H1 (App Title): Space Grotesk Bold/32px/tight letter spacing (-0.02em)
  - H2 (Section Headers): Space Grotesk SemiBold/20px/normal letter spacing
  - Body (Instructions): Space Grotesk Regular/15px/relaxed line height (1.6)
  - Labels (UI Controls): Space Grotesk Medium/13px/wide letter spacing (0.02em)
  - Captions (Icon Info): Space Grotesk Regular/12px/normal letter spacing

## Animations

Animations should emphasize the physicality of dragging and the satisfaction of mode changes, using smooth easing and purposeful motion.

- **Drag Mode Toggle**: Smooth scale and color transition (300ms ease-out) with a subtle bounce when activated
- **Icon Hover**: Gentle lift effect (transform translateY) with soft shadow expansion to suggest grabbability
- **Icon Drag Start**: Quick scale-down (150ms) to create visual feedback that the icon is "picked up"
- **Upload Success**: Brief scale-up pulse animation on newly added icons to draw attention
- **Grid Loading**: Staggered fade-in of icons with slight upward motion for visual interest

## Component Selection

- **Components**: 
  - `Switch` for the drag mode toggle with custom styling for prominence
  - `Card` for individual icon containers with hover states
  - `Dialog` for upload interface, format conversion, and icon detail views
  - `Button` for primary actions (upload, delete, convert) with distinct variants
  - `Alert` for status messages about drag mode or upload results
  - `Tooltip` for contextual help on icons and controls
  - `Badge` for file format indicators on icons
  
- **Customizations**: 
  - Custom icon grid component using CSS Grid with responsive columns
  - Styled drag preview element with semi-transparency
  - Enhanced Switch component with larger hit area and icon indicators
  - Custom empty state illustration component
  - Format conversion dialog with visual format selection and preview
  
- **States**: 
  - Toggle Switch: Clear on/off states with color change (purple inactive, cyan active) and icon swap
  - Icon Cards: Default, hover (lifted with shadow), dragging (reduced opacity), selected (border highlight)
  - Upload Button: Rest (primary purple), hover (darker purple), active (pressed effect), disabled (muted)
  - Drag Overlay: Visible only during drag operations with semi-transparent background
  - Conversion Dialog: Format selection states, converting indicator, success state with download/add options
  
- **Icon Selection**: 
  - Upload/Add: `UploadSimple` from Phosphor
  - Drag Enabled: `Hand` from Phosphor
  - Drag Disabled: `HandPalm` from Phosphor  
  - Delete: `Trash` from Phosphor
  - Info: `Info` from Phosphor
  - Image/File: `Image` from Phosphor
  - Convert: `ArrowsDownUp` from Phosphor
  - Download: `Download` from Phosphor
  - Success: `Check` from Phosphor
  - Link/URL: `Link` from Phosphor
  
- **Spacing**: 
  - Page padding: `p-8` (2rem)
  - Grid gap: `gap-6` (1.5rem)
  - Card padding: `p-4` (1rem)
  - Section spacing: `space-y-6` (1.5rem vertical)
  - Button padding: `px-6 py-3`
  
- **Mobile**: 
  - Grid: 2 columns on mobile, 3 on tablet (md:), 4 on desktop (lg:), 5 on xl screens
  - Drag mode toggle: Larger touch target (min 56px height) with clear label
  - Upload button: Full width on mobile, auto width on desktop
  - Icon cards: Minimum 120px width for comfortable touch targets
  - Sticky header with toggle for easy access while scrolling on mobile
