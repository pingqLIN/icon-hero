import { useState, useRef } from 'react'
import { useKV } from '@github/spark/hooks'
import { motion, AnimatePresence } from 'framer-motion'
import { Hand, HandPalm, UploadSimple, Warning } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { IconCard } from '@/components/IconCard'
import { EmptyState } from '@/components/EmptyState'
import { IconItem } from '@/types/icon'
import { toast } from 'sonner'

function App() {
  const [icons, setIcons] = useKV<IconItem[]>('icon-collection', [])
  const [dragEnabled, setDragEnabled] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    const file = files[0]
    const maxSize = 5 * 1024 * 1024

    if (file.size > maxSize) {
      toast.error('File too large', {
        description: 'Please upload an image smaller than 5MB'
      })
      return
    }

    if (!file.type.startsWith('image/')) {
      toast.error('Invalid file type', {
        description: 'Please upload an image file (PNG, JPG, ICO, etc.)'
      })
      return
    }

    try {
      const reader = new FileReader()
      reader.onload = (event) => {
        const url = event.target?.result as string
        const format = file.type.split('/')[1]

        const newIcon: IconItem = {
          id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          name: file.name.replace(/\.[^/.]+$/, ''),
          url,
          format,
          uploadedAt: Date.now()
        }

        setIcons((currentIcons) => [...(currentIcons || []), newIcon])
        toast.success('Icon added', {
          description: `${newIcon.name} has been added to your collection`
        })
      }
      reader.readAsDataURL(file)
    } catch (error) {
      toast.error('Upload failed', {
        description: 'There was an error processing your image'
      })
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleDeleteIcon = (id: string) => {
    setIcons((currentIcons) => (currentIcons || []).filter(icon => icon.id !== id))
    toast.success('Icon deleted', {
      description: 'The icon has been removed from your collection'
    })
  }

  const handleConvertIcon = (newIcon: IconItem) => {
    setIcons((currentIcons) => [...(currentIcons || []), newIcon])
  }

  const handleDragModeToggle = (checked: boolean) => {
    setDragEnabled(checked)
    if (checked) {
      toast.success('Drag mode enabled', {
        description: 'Click and drag icons from browser to your system folders or apps'
      })
    } else {
      toast.info('Drag mode disabled', {
        description: 'Icons are no longer draggable'
      })
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight mb-1" style={{ letterSpacing: '-0.02em' }}>
                Icon Changer
              </h1>
              <p className="text-sm text-muted-foreground" style={{ lineHeight: '1.6' }}>
                Upload and manage icon files, then drag them from browser to your system folders/apps
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-secondary/50 border border-border">
                <div className="flex-1 sm:flex-none">
                  <p className="text-xs font-medium uppercase tracking-wider mb-0.5" style={{ letterSpacing: '0.02em' }}>
                    Drag Mode
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {dragEnabled ? 'Active' : 'Inactive'}
                  </p>
                </div>
                <Switch
                  checked={dragEnabled}
                  onCheckedChange={handleDragModeToggle}
                  className="data-[state=checked]:bg-accent"
                />
                <motion.div
                  animate={{ scale: dragEnabled ? 1 : 1, rotate: dragEnabled ? 0 : 0 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                >
                  {dragEnabled ? (
                    <Hand size={24} weight="fill" className="text-accent" />
                  ) : (
                    <HandPalm size={24} className="text-muted-foreground" />
                  )}
                </motion.div>
              </div>

              <Button
                onClick={handleUploadClick}
                size="lg"
                className="gap-2 whitespace-nowrap"
              >
                <UploadSimple size={20} />
                Add Icon
              </Button>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode="wait">
          {dragEnabled && icons && icons.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6"
            >
              <Alert className="border-accent/50 bg-accent/5">
                <Warning size={18} className="text-accent" />
                <AlertDescription className="text-sm">
                  Drag mode active. Click and hold on any icon, then drag your cursor outside the browser window to your system folder or application to save/apply it.
                </AlertDescription>
              </Alert>
            </motion.div>
          )}
        </AnimatePresence>

        {!icons || icons.length === 0 ? (
          <EmptyState onUploadClick={handleUploadClick} />
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            <AnimatePresence>
              {icons.map((icon, index) => (
                <motion.div
                  key={icon.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <IconCard
                    icon={icon}
                    dragEnabled={dragEnabled}
                    onDelete={handleDeleteIcon}
                    onConvert={handleConvertIcon}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </main>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
        id="icon-upload"
      />
    </div>
  )
}

export default App