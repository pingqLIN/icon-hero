import { motion } from 'framer-motion'
import { Cube } from '@phosphor-icons/react'
import techBotImage from '@/assets/mascot_tech_rbot.png'
import heroToolImage from '@/assets/mascot_hero_tool.png'
import techBotLookDownImage from '@/assets/mascot_tech_rbot_look_down.png'
import heroToolLookDownImage from '@/assets/mascot_hero_tool_look_down.png'

type MascotType = 'bot' | 'hero' | 'abstract'
type MascotState = 'idle' | 'processing' | 'success' | 'error'
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
  const renderBot = () => (
    <div className="relative w-48 h-48 flex items-center justify-center">
      <motion.img
        src={variant === 'lookDown' ? techBotLookDownImage : techBotImage}
        initial={{ y: 0 }}
        animate={state === 'processing'
          ? { y: [0, -10, 0], rotate: [0, 2, -2, 0], scale: [1, 1.05, 1] }
          : variant === 'lookDown'
          ? { y: [0, -5, 0] }
          : { y: [0, -15, 0] }
        }
        transition={{
          duration: state === 'processing' ? 0.5 : variant === 'lookDown' ? 2.5 : 3,
          repeat: Infinity,
          ease: "easeInOut"
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
  const renderHero = () => (
    <div className="relative w-48 h-48 flex items-center justify-center">
      <motion.img
        src={variant === 'lookDown' ? heroToolLookDownImage : heroToolImage}
        initial={{ y: 0 }}
        animate={state === 'processing'
          ? { y: [0, -20, 0], rotate: [0, -5, 5, 0] }
          : variant === 'lookDown'
          ? { y: [0, -8, 0] }
          : { y: [0, -15, 0] }
        }
        transition={{
          duration: state === 'processing' ? 0.8 : variant === 'lookDown' ? 3 : 4,
          repeat: Infinity,
          ease: "easeInOut"
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
