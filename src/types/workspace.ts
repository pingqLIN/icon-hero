export type ProcessingStatus = 'pending' | 'analyzing' | 'converting' | 'completed' | 'error'

export type ItemType = 'image' | 'url' | 'unknown'

export interface WorkspaceItem {
  id: string
  name: string
  type: ItemType
  originalUrl: string
  status: ProcessingStatus
  format?: string
  convertedUrl?: string
  convertedFormat?: string
  convertedUrls?: {
    png?: string
    ico?: string
    icns?: string
  }
  convertedBlobs?: {
    png?: Blob
    ico?: Blob
    icns?: Blob
  }
  error?: string
  addedAt: number
  completedAt?: number
}
