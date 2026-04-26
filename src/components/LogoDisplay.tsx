import { motion, useReducedMotion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import iconHeroLogo from '@/assets/ICONHERO.png'

interface LogoDisplayProps {
    className?: string
}

export function LogoDisplay({ className = '' }: LogoDisplayProps) {
    const { t } = useTranslation()
    const shouldReduceMotion = useReducedMotion()

    return (
        <div className={`group relative flex min-w-0 items-center gap-3 sm:gap-4 ${className}`}>
            <motion.div
                className="relative z-10 shrink-0"
                initial={{ scale: 0.8, opacity: 0, y: -20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                transition={{
                    type: "spring",
                    stiffness: 200,
                    damping: 15,
                    delay: 0.2
                }}
                whileHover={{
                    scale: shouldReduceMotion ? 1 : 1.04,
                    rotate: shouldReduceMotion ? 0 : [0, -3, 3, 0],
                    transition: { duration: 0.4 }
                }}
            >
                <div className="relative rounded-sm border border-border/80 bg-background p-1.5 shadow-[0_10px_24px_rgba(0,0,0,0.12)] dark:shadow-[0_10px_24px_rgba(0,0,0,0.34)]">
                    <motion.div
                        className="absolute inset-1 rounded-sm border border-black/10 dark:border-white/10"
                        animate={shouldReduceMotion ? { opacity: 0.5 } : { opacity: [0.32, 0.64, 0.32] }}
                        transition={{ duration: 3, repeat: shouldReduceMotion ? 0 : Infinity, ease: 'easeInOut' }}
                        aria-hidden="true"
                    />

                    <img
                        src={iconHeroLogo}
                        alt="ICON HERO Logo"
                        className="relative z-10 h-14 w-14 object-contain drop-shadow-[0_8px_14px_rgba(59,130,246,0.28)]"
                    />

                    <motion.div
                        className="absolute inset-1 rounded-sm bg-gradient-to-tr from-white/0 via-white/25 to-white/0 opacity-0 group-hover:opacity-100"
                        animate={shouldReduceMotion ? { x: 0 } : { x: ['-20%', '20%', '-20%'] }}
                        transition={{ duration: 4, repeat: shouldReduceMotion ? 0 : Infinity, ease: 'easeInOut' }}
                        style={{ mixBlendMode: 'overlay' }}
                        aria-hidden="true"
                    />
                </div>
            </motion.div>

            <div className="relative z-10 min-w-0">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                >
                    <h1 className="relative mb-1 overflow-hidden text-2xl font-black leading-none tracking-[0.08em] sm:text-3xl lg:text-[2.15rem]">
                        <span className="inline-block whitespace-nowrap bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent drop-shadow-sm filter backdrop-brightness-125">
                            ICON HERO
                        </span>
                        <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-12"
                            initial={{ x: shouldReduceMotion ? '150%' : '-150%' }}
                            animate={{ x: '150%' }}
                            transition={{
                                repeat: shouldReduceMotion ? 0 : Infinity,
                                repeatDelay: 5,
                                duration: 1.5,
                                ease: "easeInOut"
                            }}
                        />
                    </h1>
                </motion.div>

                <motion.p
                    className="max-w-[26rem] text-xs font-medium text-muted-foreground sm:text-sm"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8, duration: 0.5 }}
                >
                    {t('logoSubtitle')}
                </motion.p>
            </div>
        </div>
    )
}
