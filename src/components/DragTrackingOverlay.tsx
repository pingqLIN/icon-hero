import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Crosshair, Path } from '@phosphor-icons/react'

interface DragPosition {
  x: number
  y: number
}

interface DragTrackingOverlayProps {
  isActive: boolean
  fileName?: string
}

export function DragTrackingOverlay({ isActive, fileName }: DragTrackingOverlayProps) {
  const [mousePos, setMousePos] = useState<DragPosition>({ x: 0, y: 0 })
  const [trail, setTrail] = useState<DragPosition[]>([])

  useEffect(() => {
    if (!isActive) {
      setTrail([])
      return
    }

    const handleMouseMove = (e: MouseEvent) => {
      const newPos = { x: e.clientX, y: e.clientY }
      setMousePos(newPos)
      
      setTrail(prev => {
        const newTrail = [...prev, newPos]
        return newTrail.slice(-15)
      })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [isActive])

  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 pointer-events-none z-[9999]"
        >
          <svg
            className="absolute inset-0 w-full h-full"
            style={{ mixBlendMode: 'multiply' }}
          >
            {trail.map((pos, index) => {
              const opacity = (index + 1) / trail.length
              const size = 8 + (opacity * 12)
              return (
                <circle
                  key={`${pos.x}-${pos.y}-${index}`}
                  cx={pos.x}
                  cy={pos.y}
                  r={size}
                  fill="oklch(0.75 0.18 210)"
                  opacity={opacity * 0.3}
                />
              )
            })}
          </svg>

          <motion.div
            animate={{ x: mousePos.x - 20, y: mousePos.y - 20 }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="absolute"
          >
            <div className="relative">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              >
                <Crosshair size={40} weight="bold" className="text-accent drop-shadow-lg" />
              </motion.div>
              
              {fileName && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute top-12 left-1/2 -translate-x-1/2 whitespace-nowrap"
                >
                  <div className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
                    {fileName}
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute top-4 left-1/2 -translate-x-1/2"
          >
            <div className="bg-accent/90 backdrop-blur-sm text-accent-foreground px-4 py-2 rounded-lg shadow-lg flex items-center gap-2">
              <Path size={20} weight="bold" />
              <span className="text-sm font-semibold">拖曳至目標位置以套用圖示</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
