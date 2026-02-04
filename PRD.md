# Planning Guide

**Experience Qualities**:


This is a specialized utility focused on icon conversion and system replacement. It p
## Essential Features
### Unified Workspace Drop Zone

- **Progression**: User drops item → System analyzes type → Determines if im


- **Trigger**: Immedi

### URL Parsing and Icon Extrac
- **Purpose**: Enable users to grab icons directly from websites without manual searching
- **Progression**: URL dropped → Fetch webpage → Parse HTML for icon links (favicon

- **Functionality**: Real-time status display showing all items being processed with progress indicators
- **Trigger**: Automatically updates as items move through conversion stages

### Multi-Format Drag-to-System
- **Purpose**: Enable direct system icon replacement by dragging converted icon files to OS folders, appli
- **Progression**: User clicks format button → Holds and drags outside browser → Custom drag

- **Functionality**: Download all completed conversions at once as a ZIP file, with options to download all formats or filter by specific format (PNG, I
- **Trigger**: User clicks "批次下載" dropdown button when completed items exist

## Edge Case Handling
- **Empty Workspace State**: Display helpful onboarding message with drag zone when no items exist
- **Large File Uploads**: Validate reasonable file size and provide feedback for oversize
- **Conversion Failures**: Mark individual items as error with specific messages,
- **URL Fetch Failures**: Handle network errors, CORS issues, and missing resources with fallback strategies
- **Non-Image URLs**: Detect content type and attempt webpage parsing for icon extraction


- **Functionality**: Real-time status display showing all items being processed with progress indicators
- **Purpose**: Provide transparency into the conversion pipeline and manage multiple items
- **Trigger**: Automatically updates as items move through conversion stages
- **Progression**: Item added → Shows "Analyzing" → Shows "Converting" with current format → Shows "Completed" with all format buttons
- **Success criteria**: Clear status for each item, grouped by pending/completed/error, smooth animations between states

### Multi-Format Drag-to-System
- **Functionality**: Each completed item displays PNG, ICO, ICNS buttons that can be clicked to download or dragged directly to system targets for icon replacement
- **Purpose**: Enable direct system icon replacement by dragging converted icon files to OS folders, applications, or shortcuts, particularly optimized for Windows folder icon replacement
- **Trigger**: User clicks and holds on a format button (PNG/ICO/ICNS) from a completed item, then drags
- **Progression**: User clicks format button → Holds and drags outside browser → Custom drag preview appears showing filename → Hovers over OS target (folder/app/file) → Releases to drop file → System receives .ico/.png/.icns file for icon replacement
- **Success criteria**: All three format buttons are draggable with visual grab cursor, proper File object is created with correct MIME type, drag data includes DownloadURL format string, custom drag image shows filename clearly, ICO files work on Windows for icon replacement (especially folder icons via desktop.ini), ICNS on macOS, PNG works universally, tooltip explains drag functionality with Windows-specific instructions

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
- **Windows Folder Icon Replacement**: Provide clear instructions for users on how to use dragged ICO files to replace folder icons in Windows (drag ICO to folder, then customize folder properties)

## Design Direction

  - Status - Complete: `CheckCircle` filled from Phosphor

  - Close: `X` fro

  - Section spacing: `space-y-8` (2rem vertical)

  
  - Single column layout
  - Format buttons: Stack vertically on narrow screens, inline on wide scree
  - Sticky header for access to upload actions while scrolling


















































































