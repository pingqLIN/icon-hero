import { UploadSimple, Image } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'

interface EmptyStateProps {
  onUploadClick: () => void
}

export function EmptyState({ onUploadClick }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-24 px-8">
      <div className="relative mb-6">
        <div className="w-24 h-24 rounded-full bg-secondary flex items-center justify-center">
          <Image size={48} className="text-muted-foreground" />
        </div>
        <div className="absolute -bottom-1 -right-1 w-10 h-10 rounded-full bg-accent flex items-center justify-center">
          <UploadSimple size={20} weight="bold" className="text-accent-foreground" />
        </div>
      </div>
      
      <h3 className="text-xl font-bold mb-2">No Icons Yet</h3>
      <p className="text-muted-foreground text-center max-w-sm mb-6">
        Start building your icon collection by uploading custom icons. Once added, enable drag mode to use them.
      </p>
      
      <Button onClick={onUploadClick} size="lg" className="gap-2">
        <UploadSimple size={20} />
        Upload Your First Icon
      </Button>
    </div>
  )
}
