import { motion } from 'framer-motion'
import { Cube } from '@phosphor-icons/react'

// Bot Images
import botFlyImage from '@/assets/bot-fly.png'
import botWaveImage from '@/assets/bot-wave.png'
import botThumbsupImage from '@/assets/bot-thumbsup.png'
import botHoldImage from '@/assets/bot-hold.png'

// Hero Images
import heroWelcomeImage from '@/assets/hero-welcome.png'
import heroFlyImage from '@/assets/hero-fly.png'
import heroWaveImage from '@/assets/hero-wave.png'
import heroThinkImage from '@/assets/hero-think.png'

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
  
  // ------------------------------------------------------------------
  // 1. TECH-BOT (Neon Forge Theme)
  // ------------------------------------------------------------------
  const getBotImage = () => {
    switch (state) {
      case 'idle': return botFlyImage
      case 'analyzing': return botHoldImage
      case 'processing': return botThumbsupImage
      case 'success': return botWaveImage
      case 'error': return botHoldImage
      default: return botFlyImage
    }
  }

  const renderBot = () => (
    <div className="relative w-48 h-48 flex items-center justify-center">
      <motion.img
        key={state + variant} // Force re-render on state change for animation
        src={getBotImage()}
        initial={{ y: 0, opacity: 0, scale: 0.9 }}
        animate={{ 
          y: state === 'processing' ? [0, -10, 0] : variant === 'lookDown' ? [0, -5, 0] : [0, -15, 0],
          opacity: 1,
          scale: 1,
          rotate: state === 'processing' ? [0, 2, -2, 0] : 0
        }}
        transition={{
          y: { duration: state === 'processing' ? 0.5 : variant === 'lookDown' ? 2.5 : 3, repeat: Infinity, ease: "easeInOut" },
          opacity: { duration: 0.3 },
          scale: { duration: 0.3 },
          rotate: { duration: 0.5, repeat: Infinity, ease: "easeInOut" }
        }}
        className="w-full h-full object-contain relative z-10 drop-shadow-[0_0_15px_rgba(6,182,212,0.5)]"
        alt="Tech Bot"
      />
      {/* Shadow */}
      <motion.div
        animate={{ scale: [1, 0.8, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: variant === 'lookDown' ? 2.5 : 3, repeat: Infinity }}
        className="absolute bottom-2 w-24 h-6 bg-black/30 blur-xl rounded-[100%]"
      />
    </div>
  )

  // ------------------------------------------------------------------
  // 2. TOOL HERO (Creative Studio Theme)
  // ------------------------------------------------------------------
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
    <div className="relative w-48 h-48 flex items-center justify-center">
      <motion.img
        key={state + variant} // Force re-render on state change for animation
        src={getHeroImage()}
        initial={{ y: 0, opacity: 0, scale: 0.9 }}
        animate={{ 
          y: state === 'processing' ? [0, -15, 0] : variant === 'lookDown' ? [0, -8, 0] : [0, -15, 0],
          opacity: 1,
          scale: 1,
          rotate: state === 'processing' ? [0, -5, 5, 0] : 0
        }}
        transition={{
          y: { duration: state === 'processing' ? 0.8 : variant === 'lookDown' ? 3 : 4, repeat: Infinity, ease: "easeInOut" },
          opacity: { duration: 0.3 },
          scale: { duration: 0.3 },
          rotate: { duration: 0.8, repeat: Infinity, ease: "easeInOut" }
        }}
        className="w-full h-full object-contain relative z-10 drop-shadow-[0_10px_20px_rgba(59,130,246,0.4)]"
        alt="Tool Hero"
      />
       {/* Shadow */}
       <motion.div
        animate={{ scale: [1, 0.85, 1], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: variant === 'lookDown' ? 3 : 4, repeat: Infinity }}
        className="absolute bottom-2 w-24 h-6 bg-blue-900/20 blur-xl rounded-[100%]"
      />
    </div>
  )

  // ------------------------------------------------------------------
  // 3. ABSTRACT (Modern)
  // ------------------------------------------------------------------
  const renderAbstract = () => (
    <div className="relative w-32 h-32 flex items-center justify-center">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="relative"
      >
        <motion.div 
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="absolute -top-6 -left-6 w-12 h-12 bg-primary/30 rounded-full blur-sm" 
        />
        <motion.div 
          animate={{ scale: [1.2, 1, 1.2] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="absolute -bottom-6 -right-6 w-16 h-16 bg-secondary/30 rounded-full blur-md" 
        />
        <div className="w-16 h-16 bg-white/10 backdrop-blur-md border border-white/50 rounded-2xl rotate-45 flex items-center justify-center">
             <Cube className="text-primary w-8 h-8" />
        </div>
      </motion.div>
    </div>
  )

  return (
    <div className={`flex items-center justify-center ${className}`}>
      {type === 'bot' && renderBot()}
      {type === 'hero' && renderHero()}
      {type === 'abstract' && renderAbstract()}
    </div>
  )
}
