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
  error?: string
  addedAt: number
  completedAt?: number
}
