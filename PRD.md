# Planning Guide

Icon Changer is a specialized utility focused on icon conversion, automation script generation, and system replacement with real-time drag tracking.

**Experience Qualities**:
1. **Efficient**: Streamlined workflow from drop to download with minimal clicks
2. **Intelligent**: Automatically detects file types, generates platform-specific scripts, and provides visual feedback
3. **Powerful**: Advanced drag-to-system functionality with visual tracking and batch automation

**Complexity Level**: Light Application (multiple features with basic state)
This is a focused utility combining file conversion, script generation, and drag-drop interactions with persistent state management.

## Essential Features

### Unified Workspace Drop Zone
- **Functionality**: Accept images and URLs via drag-drop or paste
- **Purpose**: Provide a centralized entry point for all icon sources
- **Trigger**: User drags files/URLs or pastes into the drop zone
- **Progression**: User drops item → System analyzes type → Determines if image or URL → Begins conversion
- **Success criteria**: Accepts multiple items simultaneously, shows visual feedback on hover, handles various file formats

### URL Parsing and Icon Extraction
- **Functionality**: Extract icons from website URLs or direct image links
- **Purpose**: Enable users to grab icons directly from websites without manual searching
- **Progression**: URL dropped → Fetch webpage → Parse HTML for icon links (favicon, apple-touch-icon) → Download best quality icon → Convert
- **Trigger**: User drops or pastes a URL
- **Success criteria**: Finds and downloads the highest quality icon available, handles CORS and network errors gracefully

### Real-time Processing Queue
- **Functionality**: Real-time status display showing all items being processed with progress indicators
- **Purpose**: Provide transparency into the conversion pipeline and manage multiple items
- **Trigger**: Automatically updates as items move through conversion stages
- **Progression**: Item added → Shows "Analyzing" → Shows "Converting" with current format → Shows "Completed" with all format buttons
- **Success criteria**: Clear status for each item, grouped by pending/completed/error, smooth animations between states

### Multi-Format Drag-to-System with Visual Tracking
- **Functionality**: Each completed item displays PNG, ICO, ICNS buttons that can be clicked to download or dragged directly to system targets with real-time visual tracking overlay
- **Purpose**: Enable direct system icon replacement by dragging converted icon files to OS folders, applications, or shortcuts with clear visual feedback
- **Trigger**: User clicks and holds on a format button (PNG/ICO/ICNS) from a completed item, then drags
- **Progression**: User clicks format button → Holds and drags → Visual tracking overlay activates with crosshair cursor and motion trail → Custom drag preview shows filename → Hovers over OS target → Releases to drop → System receives file for icon replacement
- **Success criteria**: All three format buttons are draggable with visual grab cursor, animated tracking overlay with motion trail appears during drag, proper File object is created with correct MIME type, drag data includes DownloadURL format string, custom drag image shows filename clearly, ICO files work on Windows for icon replacement, visual feedback enhances user confidence

### Automation Script Generator
- **Functionality**: Generate platform-specific scripts (PowerShell, AppleScript, Bash) to batch-apply icons to multiple folders or files
- **Purpose**: Enable advanced users to automate icon replacement across multiple targets without manual dragging
- **Trigger**: User clicks automation button (code icon) on a completed item
- **Progression**: User opens automation dialog → Selects OS platform (Windows/macOS/Linux) → Adds target folder paths (via typing or drag-drop) → Clicks generate → Script is displayed → User can copy or download script → Script includes instructions for execution
- **Success criteria**: Generates working scripts for each platform, accepts folder paths via drag-drop into the dialog, displays script with syntax highlighting, provides platform-specific usage instructions, script handles multiple target paths, includes error handling in generated scripts

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
- **Script Path Validation**: Accept both typed and dragged folder paths in automation dialog
- **Empty Path List**: Disable script generation button when no target paths are added
- **Drag Tracking Performance**: Optimize motion trail rendering to prevent performance issues during extended drags

## Design Direction

The interface should feel professional, efficient, and powerful - like a developer tool that's accessible to all users. Visual feedback during drag operations should feel fluid and intuitive, building user confidence. The automation features should feel advanced yet approachable, with clear instructions that demystify the scripting process.

## Color Selection

The color scheme uses a sophisticated purple-blue palette that conveys technical precision while remaining approachable.

- **Primary Color**: Deep purple `oklch(0.35 0.15 290)` - Represents the core action and conversion process, conveys professionalism
- **Secondary Colors**: Soft lavender `oklch(0.85 0.08 290)` for backgrounds, muted purple-gray `oklch(0.50 0.02 290)` for secondary text
- **Accent Color**: Bright cyan-blue `oklch(0.75 0.18 210)` for highlights, drag tracking overlay, and attention-grabbing elements
- **Foreground/Background Pairings**: 
  - Primary Purple (oklch(0.35 0.15 290)): White text (oklch(0.98 0.005 290)) - Ratio 8.2:1 ✓
  - Accent Cyan-Blue (oklch(0.75 0.18 210)): Dark text (oklch(0.25 0.02 290)) - Ratio 5.1:1 ✓
  - Background (oklch(0.98 0.005 290)): Foreground text (oklch(0.25 0.02 290)) - Ratio 12.4:1 ✓

## Font Selection

Space Grotesk provides a technical, geometric aesthetic that conveys precision and modernity, perfect for a developer-focused utility tool.

- **Typographic Hierarchy**: 
  - H1 (App Title): Space Grotesk Bold/32px/tight letter spacing (-0.02em)
  - H2 (Section Headers): Space Grotesk Bold/20px/normal
  - H3 (Subsection): Space Grotesk Semibold/14px/normal
  - Body (Descriptions): Space Grotesk Regular/14px/1.6 line height
  - Code (Scripts, File paths): Space Grotesk Medium/13px/monospace feel
  - Button Labels: Space Grotesk Semibold/13px
  - Badge Text: Space Grotesk Medium/10px

## Animations

Animations should enhance usability by providing clear feedback and creating moments of delight during drag operations and state transitions.

- **Drag Tracking**: Smooth crosshair rotation (2s linear infinite) with trailing motion blur effect (15 frame trail with opacity fade)
- **Status Transitions**: Gentle fade and slide animations (200-300ms) when items move between pending/converting/completed
- **Button Interactions**: Subtle scale (1.05) on hover, pressed state with scale (0.98)
- **Upload Pulse**: Gentle floating animation on drop zone icon (2s ease-in-out)
- **Script Generation**: Fade-in reveal (300ms) when script appears in dialog
- **Toast Notifications**: Slide in from bottom-right with spring physics

## Component Selection

- **Components**: 
  - Dialog (Shadcn): For Preview and Automation dialogs with max-width constraints
  - Card (Shadcn): For queue items with hover states and border styling
  - Button (Shadcn): Primary for main actions (ICO format), outline for secondary (PNG/ICNS), ghost for icon-only
  - Tabs (Shadcn): For OS platform selection in automation dialog
  - Tooltip (Shadcn): For explaining drag functionality and button purposes
  - Badge (Shadcn): For status indicators and format labels
  - ScrollArea (Shadcn): For long queues and script display
  - Input (Shadcn): For URL input and path entry in automation dialog
  - Dropdown Menu (Shadcn): For batch download options
  - Toaster (Sonner): For success/error feedback

- **Customizations**: 
  - DragTrackingOverlay: Custom component with SVG trail rendering and animated crosshair
  - WorkspaceDropZone: Custom with dashed border, gradient background using secondary/20
  - Automation Dialog: Custom tabs with platform logos, drag-drop enabled path input
  - Custom drag image: Generated DOM element with icon and filename

- **States**: 
  - Buttons: Default, hover (border-primary), active (scale 0.98), disabled (opacity 50%), grab cursor on draggable
  - Queue Items: Pending (muted), analyzing (accent pulse), converting (primary pulse), completed (green check), error (destructive)
  - Drop Zone: Default (border-border), hover (border-primary/50, bg-secondary/30)
  - Drag Tracking: Active (overlay visible with trail), inactive (hidden)

- **Icon Selection**: 
  - Upload: UploadSimple (animated float on drop zone)
  - Status - Analyzing: CircleNotch (animated spin, accent color)
  - Status - Converting: ArrowsDownUp (pulse animation, primary color)
  - Status - Complete: CheckCircle (filled, green)
  - Status - Error: Warning (filled, destructive)
  - Drag Tracking: Crosshair (rotating), Path (indicator text)
  - Automation: Code (bold weight)
  - Platform Logos: WindowsLogo, AppleLogo, LinuxLogo (filled weight)
  - File Operations: Download, Copy, FolderOpen
  - Queue Management: DotsSixVertical (reorder handle), Trash, FileZip

- **Spacing**: 
  - Container padding: `px-4 sm:px-6 lg:px-8`
  - Section spacing: `space-y-8` (2rem vertical)
  - Component spacing: `gap-2` (0.5rem) for tight groups, `gap-4` (1rem) for sections
  - Card padding: `p-4` (1rem)
  - Button spacing: `gap-2` for icon+text buttons

- **Mobile**: 
  - Sticky header for access to upload actions while scrolling
  - Stack buttons vertically on narrow screens (<640px)
  - Single column layout
  - Format buttons: Stack vertically on narrow screens, inline on wide screens
  - Automation dialog: Full height on mobile with scrollable content
  - Drag tracking: Simplified on touch devices (no trail effect)


















































































