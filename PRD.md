# Planning Guide

A browser-based icon conversion and replacement tool that enables users to drag-and-drop image files or URLs into a workspace, automatically converts them to PNG, ICO, and ICNS formats, and allows direct system icon replacement via drag-and-drop.

**Experience Qualities**:
1. **Efficient** - Automatic batch processing with minimal user intervention required
2. **Powerful** - Convert and manage icons in multiple formats simultaneously with drag-to-system capabilities
3. **Streamlined** - Single unified workspace for all operations without mode switching

**Complexity Level**: Light Application (multiple features with basic state)
This is a specialized utility focused on icon conversion and system replacement. It processes files through analysis, conversion, and enables direct system integration through drag-and-drop, maintaining a processing queue without requiring complex routing.

## Essential Features

### Unified Workspace Drop Zone
- **Functionality**: Single drag-and-drop area that accepts image files, URLs, or clipboard content
- **Purpose**: Provide a centralized entry point for all icon processing operations
- **Trigger**: User drags files/URLs to drop zone, clicks upload button, or pastes content
- **Progression**: User drops item → System analyzes type → Determines if image or URL → Begins conversion pipeline
- **Success criteria**: Accepts multiple files/URLs simultaneously, provides immediate feedback on drop, handles various input types gracefully

### Automatic Multi-Format Conversion
- **Functionality**: Automatically converts all dropped items to PNG, ICO, and ICNS formats simultaneously
- **Purpose**: Eliminate manual format selection and prepare icons for all operating systems
- **Trigger**: Immediately after item analysis completes
- **Progression**: Analysis complete → PNG conversion starts → ICO conversion starts → ICNS conversion starts → All formats ready → Item marked complete
- **Success criteria**: All three formats generated for each item, maintains quality across conversions, ICO includes multiple resolutions (16, 32, 48, 256px), ICNS includes full resolution set

### URL Parsing and Icon Extraction
- **Functionality**: When URL is detected, fetch and parse webpage for icon metadata and resources
- **Purpose**: Enable users to grab icons directly from websites without manual searching
- **Trigger**: User drops or pastes a URL that doesn't point directly to an image
- **Progression**: URL dropped → Fetch webpage → Parse HTML for icon links (favicon, og:image, apple-touch-icon) → Extract best quality icon → Convert to all formats
- **Success criteria**: Successfully extracts icons from major websites, falls back to /favicon.ico if no metadata found, handles CORS and network errors gracefully

### Processing Queue Display
- **Functionality**: Real-time status display showing all items being processed with progress indicators
- **Purpose**: Provide transparency into the conversion pipeline and manage multiple items
- **Trigger**: Automatically updates as items move through conversion stages
- **Progression**: Item added → Shows "Analyzing" → Shows "Converting" with current format → Shows "Completed" with all format buttons
- **Success criteria**: Clear status for each item, grouped by pending/completed/error, smooth animations between states

### Multi-Format Drag-to-System
- **Functionality**: Each completed item displays PNG, ICO, ICNS buttons that can be clicked to download or dragged directly to system targets for icon replacement
- **Purpose**: Enable direct system icon replacement by dragging converted icon files to OS folders, applications, or shortcuts
- **Trigger**: User clicks and holds on a format button (PNG/ICO/ICNS) from a completed item, then drags
- **Progression**: User clicks format button → Holds and drags outside browser → Custom drag preview appears showing filename → Hovers over OS target (folder/app/file) → Releases to drop file → System receives .ico/.png/.icns file for icon replacement
- **Success criteria**: All three format buttons are draggable with visual grab cursor, proper File object is created with correct MIME type, drag data includes DownloadURL format string, custom drag image shows filename clearly, ICO files work on Windows for icon replacement, ICNS on macOS, PNG works universally, tooltip explains drag functionality

### Batch Download All Formats
- **Functionality**: Download all completed conversions at once as a ZIP file, with options to download all formats or filter by specific format (PNG, ICO, or ICNS)
- **Purpose**: Enable efficient bulk export of converted icons for offline use or distribution
- **Trigger**: User clicks "批次下載" dropdown button when completed items exist
- **Progression**: User clicks batch download → Selects format option → System packages all matching files into ZIP → Downloads ZIP with timestamped filename
- **Success criteria**: Creates organized ZIP with folders per item containing respective formats, handles multiple items efficiently, provides clear success feedback, supports format-specific downloads

## Edge Case Handling

- **Empty Workspace State**: Display helpful onboarding message with drag zone when no items exist
- **Invalid File Types**: Show clear error toast when unsupported file formats are dropped
- **Large File Uploads**: Validate reasonable file size and provide feedback for oversized images
- **Multiple Simultaneous Drops**: Process all items concurrently with individual status tracking
- **Conversion Failures**: Mark individual items as error with specific messages, don't block other items
- **Invalid URLs**: Validate URL format before processing and show error for malformed URLs
- **URL Fetch Failures**: Handle network errors, CORS issues, and missing resources with fallback strategies
- **URL Without Icons**: Attempt /favicon.ico fallback when webpage parsing finds no icon metadata
- **Non-Image URLs**: Detect content type and attempt webpage parsing for icon extraction
- **Duplicate Items**: Allow processing of duplicate items with unique IDs for independent tracking
- **Browser Drag Restrictions**: Ensure DownloadURL format is properly set for cross-browser compatibility

## Design Direction

The design should evoke efficiency and technical precision - a professional conversion tool that processes files automatically and provides immediate access to results. Clean, focused interface with clear status indicators and minimal interaction required.

## Color Selection

A sophisticated, tech-forward palette centered around deep purples and electric accents that communicates both efficiency and technical capability.

- **Primary Color**: Deep Purple `oklch(0.35 0.15 290)` - Communicates technical sophistication and processing capability
- **Secondary Colors**: 
  - Soft Lavender `oklch(0.85 0.08 290)` for backgrounds and drop zone areas
  - Dark Charcoal `oklch(0.25 0.02 290)` for text and high-contrast elements
- **Accent Color**: Electric Cyan `oklch(0.75 0.18 210)` - Vibrant highlight for active processing states and interactive format buttons
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

Animations should emphasize the flow of processing and the satisfaction of completion, using smooth transitions and purposeful motion.

- **Item Drop**: Quick fade-in and slide-up animation when new items are added to queue (200ms ease-out)
- **Status Changes**: Smooth color transitions as items move from analyzing → converting → completed
- **Format Button Appearance**: Staggered fade-in of PNG, ICO, ICNS buttons on completion (100ms delay between each)
- **Drag Start**: Subtle scale and opacity change to indicate button is being dragged
- **Processing Indicators**: Gentle pulse animation on items being converted
- **Success State**: Brief scale pulse on completion with color transition to success state

## Component Selection

- **Components**: 
  - `Card` for queue item containers with status-based styling
  - `Button` for upload actions and format download/drag buttons
  - `Input` for URL entry with clear action button
  - `Badge` for status and format indicators with color coding
  - `Tooltip` for contextual help on drag functionality
  - `Dialog` for preview modal showing converted images
  - `ScrollArea` for queue list with many items
  - `Alert` for empty state messaging
  
- **Customizations**: 
  - Custom drop zone component with animated upload icon
  - Enhanced format buttons with drag-enabled state and icon indicators
  - Status-aware queue item cards with progress visualization
  - Multi-format preview in dialog showing all three outputs
  
- **States**: 
  - Queue Items: Pending (muted), Analyzing (accent pulse), Converting (primary pulse), Completed (success border), Error (destructive)
  - Format Buttons: Enabled drag state with cursor indication, hover lift effect, active pressed state
  - Drop Zone: Default invitation state, drag-over highlight state, processing state
  - Upload Button: Rest, hover, disabled during active processing
  
- **Icon Selection**: 
  - Upload/Add: `UploadSimple` from Phosphor
  - Files/Workspace: `Files` from Phosphor
  - Download: `DownloadSimple` from Phosphor
  - Batch Download: `FileZip` from Phosphor
  - Preview: `Eye` from Phosphor
  - Status - Analyzing: `CircleNotch` spinning from Phosphor
  - Status - Converting: `ArrowsDownUp` pulsing from Phosphor
  - Status - Complete: `CheckCircle` filled from Phosphor
  - Status - Error: `Warning` filled from Phosphor
  - Image Type: `Image` from Phosphor
  - URL Type: `Link` from Phosphor
  - Close: `X` from Phosphor
  
- **Spacing**: 
  - Page padding: `p-8` (2rem)
  - Section spacing: `space-y-8` (2rem vertical)
  - Queue item spacing: `space-y-2` (0.5rem vertical)
  - Card padding: `p-4` (1rem)
  - Button group gap: `gap-2` (0.5rem)
  
- **Mobile**: 
  - Single column layout for queue items
  - Upload buttons: Full width on mobile, inline on desktop
  - Format buttons: Stack vertically on narrow screens, inline on wide screens
  - Drop zone: Reduced padding on mobile for better space utilization
  - Sticky header for access to upload actions while scrolling
