import { useState } from 'react'
import { ArrowsDownUp, Check, Download } from '@phosphor-icons/react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { IconItem } from '@/types/icon'
import { convertIcon, downloadConvertedIcon, type IconFormat, type ConversionResult } from '@/lib/iconConverter'
import { toast } from 'sonner'
import { motion, AnimatePresence } from 'framer-motion'

interface ConversionDialogProps {
  icon: IconItem
  onConvert: (newIcon: IconItem) => void
}

const formatOptions: { value: IconFormat; label: string; description: string }[] = [
  { value: 'png', label: 'PNG', description: 'Universal format, best for web and general use' },
  { value: 'ico', label: 'ICO', description: 'Windows icon format, multi-size support' },
  { value: 'icns', label: 'ICNS', description: 'macOS icon format, for Mac applications' },
]

export function ConversionDialog({ icon, onConvert }: ConversionDialogProps) {
  const [selectedFormat, setSelectedFormat] = useState<IconFormat>('png')
  const [isConverting, setIsConverting] = useState(false)
  const [convertedResult, setConvertedResult] = useState<ConversionResult | null>(null)
  const [open, setOpen] = useState(false)

  const currentFormat = icon.format.toLowerCase().replace('x-icon', 'ico').replace('vnd.microsoft.icon', 'ico')

  const handleConvert = async () => {
    setIsConverting(true)
    setConvertedResult(null)

    try {
      const result = await convertIcon(icon.url, selectedFormat)
      setConvertedResult(result)
      toast.success('Conversion complete', {
        description: `Successfully converted to ${selectedFormat.toUpperCase()}`
      })
    } catch (error) {
      toast.error('Conversion failed', {
        description: 'There was an error converting the icon'
      })
      console.error('Conversion error:', error)
    } finally {
      setIsConverting(false)
    }
  }

  const handleDownload = () => {
    if (!convertedResult) return
    downloadConvertedIcon(convertedResult, icon.name)
    toast.success('Download started', {
      description: `${icon.name}.${selectedFormat} has been downloaded`
    })
  }

  const handleAddToCollection = () => {
    if (!convertedResult) return

    const newIcon: IconItem = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: `${icon.name}-${selectedFormat}`,
      url: convertedResult.url,
      format: selectedFormat,
      uploadedAt: Date.now()
    }

    onConvert(newIcon)
    toast.success('Icon added', {
      description: `${newIcon.name} has been added to your collection`
    })
    setOpen(false)
    setConvertedResult(null)
  }

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen)
    if (!newOpen) {
      setConvertedResult(null)
      setSelectedFormat('png')
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          size="icon"
          variant="secondary"
          className="h-7 w-7"
          onClick={(e) => e.stopPropagation()}
        >
          <ArrowsDownUp size={14} />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Convert Icon Format</DialogTitle>
          <DialogDescription>
            Convert {icon.name} to a different icon format
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-lg bg-secondary/30 flex items-center justify-center p-2 flex-shrink-0">
              <img
                src={icon.url}
                alt={icon.name}
                className="max-w-full max-h-full object-contain"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{icon.name}</p>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="secondary" className="text-xs">
                  Current: {currentFormat.toUpperCase()}
                </Badge>
              </div>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-3 block">Select Target Format</label>
            <div className="grid gap-2">
              {formatOptions.map((format) => (
                <button
                  key={format.value}
                  onClick={() => setSelectedFormat(format.value)}
                  disabled={currentFormat === format.value}
                  className={`relative flex items-start gap-3 p-4 rounded-lg border-2 transition-all text-left ${
                    selectedFormat === format.value
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50 bg-card'
                  } ${
                    currentFormat === format.value
                      ? 'opacity-50 cursor-not-allowed'
                      : 'cursor-pointer'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${
                      selectedFormat === format.value
                        ? 'border-primary bg-primary'
                        : 'border-border bg-background'
                    }`}
                  >
                    {selectedFormat === format.value && (
                      <Check size={12} weight="bold" className="text-primary-foreground" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-sm">{format.label}</span>
                      {currentFormat === format.value && (
                        <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                          Current
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">{format.description}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <AnimatePresence mode="wait">
            {convertedResult && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="p-4 rounded-lg bg-accent/10 border border-accent/20"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded bg-background flex items-center justify-center flex-shrink-0">
                    <Check size={24} weight="bold" className="text-accent" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Conversion Complete</p>
                    <p className="text-xs text-muted-foreground">
                      Ready to download or add to collection
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex gap-2">
            {!convertedResult ? (
              <>
                <Button
                  onClick={handleConvert}
                  disabled={isConverting || currentFormat === selectedFormat}
                  className="flex-1 gap-2"
                >
                  <ArrowsDownUp size={16} />
                  {isConverting ? 'Converting...' : 'Convert'}
                </Button>
              </>
            ) : (
              <>
                <Button
                  onClick={handleDownload}
                  variant="secondary"
                  className="flex-1 gap-2"
                >
                  <Download size={16} />
                  Download
                </Button>
                <Button
                  onClick={handleAddToCollection}
                  className="flex-1 gap-2"
                >
                  <Check size={16} />
                  Add to Collection
                </Button>
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
