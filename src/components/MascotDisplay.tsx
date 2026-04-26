import { AnimatePresence, motion, useReducedMotion, type Variants } from 'framer-motion'
import { Cube } from '@phosphor-icons/react'

// Bot Images
import botFlyImage from '@/assets/bot-fly.webp'
import botFlyHeroImage from '@/assets/bot-fly-hero.webp'
import botWaveImage from '@/assets/bot-wave.webp'
import botThumbsupImage from '@/assets/bot-thumbsup.webp'
import botHoldImage from '@/assets/bot-hold.webp'

// Hero Images
import heroWelcomeImage from '@/assets/hero-welcome.webp'
import heroFlyImage from '@/assets/hero-fly.webp'
import heroWaveImage from '@/assets/hero-wave.webp'
import heroThinkImage from '@/assets/hero-think.webp'

type MascotType = 'bot' | 'hero' | 'abstract'
type MascotState = 'idle' | 'processing' | 'success' | 'error' | 'analyzing'
type MascotVariant = 'default' | 'lookDown'

interface MascotDisplayProps {
  type?: MascotType
  state?: MascotState
  className?: string
  variant?: MascotVariant
}

export function MascotDisplay({ type = 'bot', state = 'idle', className = '', variant = 'default' }: MascotDisplayProps) {
  const shouldReduceMotion = useReducedMotion()

  const movement = shouldReduceMotion
    ? { y: 0, rotate: 0 }
    : {
        idle: variant === 'lookDown' ? { y: [0, -3, 0], rotate: [0, -1, 0] } : { y: [0, -10, 0], rotate: [0, 1, 0] },
        analyzing: { y: [0, -4, 0], rotate: [-2, 2, -2] },
        processing: { y: [0, -12, 0], rotate: [0, 3, -3, 0] },
        success: { y: [0, -8, 0], rotate: [0, -2, 2, 0] },
        error: { y: [0, 3, 0], rotate: [0, -3, 3, 0] },
      }[state]

  const mascotVariants: Variants = {
    hidden: { opacity: 0, y: 12, scale: 0.94 },
    visible: {
      opacity: 1,
      scale: 1,
      ...movement,
      transition: {
        opacity: { duration: 0.24 },
        scale: { duration: 0.28, ease: 'easeOut' },
        y: shouldReduceMotion ? { duration: 0 } : { duration: state === 'processing' ? 1.2 : 3.2, repeat: Infinity, ease: 'easeInOut' },
        rotate: shouldReduceMotion ? { duration: 0 } : { duration: state === 'processing' ? 1.2 : 3.2, repeat: Infinity, ease: 'easeInOut' },
      },
    },
    exit: { opacity: 0, y: -8, scale: 0.98, transition: { duration: 0.18, ease: 'easeIn' } },
  }

  const auraAnimation = shouldReduceMotion
    ? { opacity: 0.35, scale: 1 }
    : { opacity: state === 'processing' || state === 'analyzing' ? 0.42 : 0.24, scale: state === 'success' ? 1.08 : 1 }

  const shadowAnimation = shouldReduceMotion
    ? { opacity: 0.32, scale: 1 }
    : { opacity: state === 'processing' ? 0.42 : 0.28, scale: state === 'processing' ? 0.86 : 1 }

  const getBotImage = () => {
    switch (state) {
      case 'idle': return variant === 'lookDown' ? botFlyImage : botFlyHeroImage
      case 'analyzing': return botHoldImage
      case 'processing': return botThumbsupImage
      case 'success': return botWaveImage
      case 'error': return botHoldImage
      default: return variant === 'lookDown' ? botFlyImage : botFlyHeroImage
    }
  }

  const renderBot = () => (
    <div className="relative flex h-48 w-48 items-center justify-center overflow-visible">
      <motion.div
        aria-hidden="true"
        animate={auraAnimation}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="absolute inset-8 rounded-full bg-cyan-400/25 blur-2xl"
      />
      <AnimatePresence mode="wait">
        <motion.img
          key={`${type}-${state}-${variant}`}
          src={getBotImage()}
          variants={mascotVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="relative z-10 h-full w-full object-contain drop-shadow-[0_14px_24px_rgba(6,182,212,0.34)]"
          alt=""
          aria-hidden="true"
          draggable={false}
        />
      </AnimatePresence>
      <motion.div
        aria-hidden="true"
        animate={shadowAnimation}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="absolute bottom-2 h-5 w-24 rounded-[100%] bg-black/30 blur-xl"
      />
    </div>
  )

  const getHeroImage = () => {
    switch (state) {
      case 'idle': return heroWelcomeImage
      case 'analyzing': return heroThinkImage
      case 'processing': return heroFlyImage
      case 'success': return heroWaveImage
      case 'error': return heroThinkImage
      default: return heroWelcomeImage
    }
  }

  const renderHero = () => (
    <div className="relative flex h-48 w-48 items-center justify-center overflow-visible">
      <motion.div
        aria-hidden="true"
        animate={auraAnimation}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="absolute inset-7 rounded-full bg-blue-400/20 blur-2xl"
      />
      <AnimatePresence mode="wait">
        <motion.img
          key={`${type}-${state}-${variant}`}
          src={getHeroImage()}
          variants={mascotVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="relative z-10 h-full w-full object-contain drop-shadow-[0_16px_26px_rgba(59,130,246,0.34)]"
          alt=""
          aria-hidden="true"
          draggable={false}
        />
      </AnimatePresence>
      <motion.div
        aria-hidden="true"
        animate={shadowAnimation}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="absolute bottom-2 h-5 w-24 rounded-[100%] bg-blue-950/24 blur-xl"
      />
    </div>
  )

  const renderAbstract = () => (
    <div className="relative flex h-32 w-32 items-center justify-center overflow-hidden">
      <motion.div
        animate={shouldReduceMotion ? { rotate: 0 } : { rotate: 360 }}
        transition={{ duration: 20, repeat: shouldReduceMotion ? 0 : Infinity, ease: "linear" }}
        className="relative"
      >
        <motion.div
          animate={shouldReduceMotion ? { scale: 1 } : { scale: [1, 1.14, 1] }}
          transition={{ duration: 3, repeat: shouldReduceMotion ? 0 : Infinity }}
          className="absolute -top-6 -left-6 h-12 w-12 rotate-45 border border-primary/40 bg-primary/10"
        />
        <motion.div
          animate={shouldReduceMotion ? { scale: 1 } : { scale: [1.12, 1, 1.12] }}
          transition={{ duration: 4, repeat: shouldReduceMotion ? 0 : Infinity }}
          className="absolute -bottom-6 -right-6 h-16 w-16 rotate-45 border border-secondary/40 bg-secondary/10"
        />
        <div className="flex h-16 w-16 rotate-45 items-center justify-center rounded-sm border border-white/50 bg-white/10 backdrop-blur-md">
             <Cube className="h-8 w-8 -rotate-45 text-primary" />
        </div>
      </motion.div>
    </div>
  )

  return (
    <div className={`pointer-events-none flex items-center justify-center ${className}`}>
      {type === 'bot' && renderBot()}
      {type === 'hero' && renderHero()}
      {type === 'abstract' && renderAbstract()}
    </div>
  )
}
