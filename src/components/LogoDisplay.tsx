import { motion } from 'framer-motion'
import iconHeroLogo from '@/assets/ICONHERO.png'

interface LogoDisplayProps {
    className?: string
}

export function LogoDisplay({ className = '' }: LogoDisplayProps) {
    return (
        <div className={`relative flex items-center gap-4 group ${className}`}>
            {/* Spotlight Effect - Background Glow */}
            <div className="absolute left-8 top-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-primary/20 rounded-full blur-3xl opacity-50 group-hover:opacity-80 transition-opacity duration-500" />

            {/* Logo Container with Stage Presence */}
            <motion.div
                className="relative z-10"
                initial={{ scale: 0.8, opacity: 0, y: -20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                transition={{
                    type: "spring",
                    stiffness: 200,
                    damping: 15,
                    delay: 0.2
                }}
                whileHover={{
                    scale: 1.1,
                    rotate: [0, -5, 5, 0],
                    transition: { duration: 0.4 }
                }}
            >
                <div className="relative">
                    {/* Platform/Base Shadow */}
                    <motion.div
                        className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-12 h-2 bg-black/40 blur-md rounded-full"
                        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                        transition={{ duration: 3, repeat: Infinity }}
                    />

                    <img
                        src={iconHeroLogo}
                        alt="ICON HERO Logo"
                        className="w-16 h-16 object-contain drop-shadow-[0_0_15px_rgba(59,130,246,0.6)] relative z-10"
                    />

                    {/* Sparkles/Glow overlay on logo */}
                    <motion.div
                        className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/30 to-white/0 opacity-0 group-hover:opacity-100 rounded-full"
                        animate={{ rotate: [0, 360] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                        style={{ mixBlendMode: 'overlay' }}
                    />
                </div>
            </motion.div>

            {/* Text Container with Reveal Animation */}
            <div className="relative z-10">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                >
                    <h1 className="text-3xl font-bold tracking-tight mb-1 relative overflow-hidden">
                        <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent inline-block drop-shadow-sm filter backdrop-brightness-125">
                            ICON HERO
                        </span>
                        {/* Shine effect on text */}
                        <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-12"
                            initial={{ x: '-150%' }}
                            animate={{ x: '150%' }}
                            transition={{
                                repeat: Infinity,
                                repeatDelay: 5,
                                duration: 1.5,
                                ease: "easeInOut"
                            }}
                        />
                    </h1>
                </motion.div>

                <motion.p
                    className="text-sm text-muted-foreground font-medium"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8, duration: 0.5 }}
                >
                    您的終極圖示轉換工具
                </motion.p>
            </div>
        </div>
    )
}
