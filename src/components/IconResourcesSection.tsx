import { motion } from 'framer-motion'
import { ArrowSquareOut, Star } from '@phosphor-icons/react'
import { useTranslation } from 'react-i18next'

interface IconSite {
  name: string
  url: string
  taglineKey: string
  count: string
  license: 'free' | 'freemium' | 'paid'
  formats: string[]
  highlightKey: string
  accentColor: string
  logo: string
}

const ICON_SITES: IconSite[] = [
  {
    name: 'Flaticon',
    url: 'https://www.flaticon.com',
    taglineKey: 'iconSites.flaticon.tagline',
    count: '22M+',
    license: 'freemium',
    formats: ['SVG', 'PNG', 'ICO', 'PSD'],
    highlightKey: 'iconSites.flaticon.highlight',
    accentColor: '#00BFA5',
    logo: '🟩',
  },
  {
    name: 'Icons8',
    url: 'https://icons8.com',
    taglineKey: 'iconSites.icons8.tagline',
    count: '1.5M+',
    license: 'freemium',
    formats: ['SVG', 'PNG', 'ICO', 'PDF'],
    highlightKey: 'iconSites.icons8.highlight',
    accentColor: '#43A047',
    logo: '🟢',
  },
  {
    name: 'The Noun Project',
    url: 'https://thenounproject.com',
    taglineKey: 'iconSites.theNounProject.tagline',
    count: '5M+',
    license: 'freemium',
    formats: ['SVG', 'PNG'],
    highlightKey: 'iconSites.theNounProject.highlight',
    accentColor: '#757575',
    logo: '⬛',
  },
  {
    name: 'Iconfinder',
    url: 'https://www.iconfinder.com',
    taglineKey: 'iconSites.iconfinder.tagline',
    count: '6M+',
    license: 'freemium',
    formats: ['SVG', 'PNG', 'ICO', 'ICNS'],
    highlightKey: 'iconSites.iconfinder.highlight',
    accentColor: '#1E88E5',
    logo: '🔵',
  },
  {
    name: 'Font Awesome',
    url: 'https://fontawesome.com',
    taglineKey: 'iconSites.fontAwesome.tagline',
    count: '30k+',
    license: 'freemium',
    formats: ['SVG', 'WebFont', 'React'],
    highlightKey: 'iconSites.fontAwesome.highlight',
    accentColor: '#228BE6',
    logo: '🔷',
  },
  {
    name: 'Phosphor Icons',
    url: 'https://phosphoricons.com',
    taglineKey: 'iconSites.phosphorIcons.tagline',
    count: '9k+',
    license: 'free',
    formats: ['SVG', 'React', 'Vue', 'Flutter'],
    highlightKey: 'iconSites.phosphorIcons.highlight',
    accentColor: '#7950F2',
    logo: '🟣',
  },
  {
    name: 'Heroicons',
    url: 'https://heroicons.com',
    taglineKey: 'iconSites.heroicons.tagline',
    count: '300+',
    license: 'free',
    formats: ['SVG', 'React', 'Vue'],
    highlightKey: 'iconSites.heroicons.highlight',
    accentColor: '#06B6D4',
    logo: '🦸',
  },
  {
    name: 'Lucide',
    url: 'https://lucide.dev',
    taglineKey: 'iconSites.lucide.tagline',
    count: '1.5k+',
    license: 'free',
    formats: ['SVG', 'React', 'Vue', 'Flutter'],
    highlightKey: 'iconSites.lucide.highlight',
    accentColor: '#F97316',
    logo: '✨',
  },
  {
    name: 'Feather Icons',
    url: 'https://feathericons.com',
    taglineKey: 'iconSites.featherIcons.tagline',
    count: '287',
    license: 'free',
    formats: ['SVG'],
    highlightKey: 'iconSites.featherIcons.highlight',
    accentColor: '#868E96',
    logo: '🪶',
  },
  {
    name: 'Material Icons',
    url: 'https://fonts.google.com/icons',
    taglineKey: 'iconSites.materialIcons.tagline',
    count: '2500+',
    license: 'free',
    formats: ['SVG', 'PNG', 'Android', 'iOS'],
    highlightKey: 'iconSites.materialIcons.highlight',
    accentColor: '#4285F4',
    logo: '🔵',
  },
]

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
}

const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' as const } },
}

export function IconResourcesSection() {
  const { t } = useTranslation()
  const licenseLabel: Record<IconSite['license'], { label: string; className: string }> = {
    free: { label: t('iconSitesLicense.free'), className: 'bg-emerald-500/15 text-emerald-500 ring-1 ring-emerald-500/30' },
    freemium: { label: t('iconSitesLicense.freemium'), className: 'bg-amber-500/15 text-amber-500 ring-1 ring-amber-500/30' },
    paid: { label: t('iconSitesLicense.paid'), className: 'bg-rose-500/15 text-rose-500 ring-1 ring-rose-500/30' },
  }

  return (
    <section className="mt-16">
      {/* Section Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="h-px flex-1 bg-border" />
        <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground tracking-wider uppercase">
          <Star size={14} weight="fill" className="text-primary" />
          {t('iconSitesSectionTitle')}
          <Star size={14} weight="fill" className="text-primary" />
        </div>
        <div className="h-px flex-1 bg-border" />
      </div>

      <p className="text-center text-sm text-muted-foreground mb-8 -mt-2">
        {t('iconSitesSectionHint')}
      </p>

      {/* Cards Grid */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-60px' }}
      >
        {ICON_SITES.map((site) => (
          <SiteCard key={site.name} site={site} licenseLabel={licenseLabel} />
        ))}
      </motion.div>
    </section>
  )
}

function SiteCard({ site, licenseLabel }: { site: IconSite; licenseLabel: Record<IconSite['license'], { label: string; className: string }> }) {
  const { t } = useTranslation()
  const license = licenseLabel[site.license]

  return (
    <motion.a
      variants={cardVariants}
      href={site.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative flex flex-col gap-3 rounded-xl border border-border bg-card p-4 transition-all duration-200
                 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-[0_4px_20px_rgba(0,0,0,0.15)]
                 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      style={
        {
          '--site-color': site.accentColor,
        } as React.CSSProperties
      }
    >
      {/* Top accent bar */}
      <div
        className="absolute top-0 left-4 right-4 h-[2px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ background: site.accentColor }}
      />

      {/* Header row */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-2xl leading-none">{site.logo}</span>
          <span className="font-bold text-sm text-foreground leading-tight">{site.name}</span>
        </div>
        <ArrowSquareOut
          size={14}
          className="mt-0.5 flex-shrink-0 text-muted-foreground/60 group-hover:text-primary transition-colors"
        />
      </div>

      {/* Count + License */}
      <div className="flex items-center gap-2 flex-wrap">
        <span
          className="text-xl font-extrabold tabular-nums leading-none"
          style={{ color: site.accentColor }}
        >
          {site.count}
        </span>
        <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full leading-none ${license.className}`}>
          {license.label}
        </span>
      </div>

      {/* Tagline */}
      <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3 flex-1">
        {t(site.taglineKey)}
      </p>

      {/* Formats */}
      <div className="flex flex-wrap gap-1 mt-auto pt-1 border-t border-border/50">
        {site.formats.map((fmt) => (
          <span
            key={fmt}
            className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-muted text-muted-foreground leading-none"
          >
            {fmt}
          </span>
        ))}
      </div>

      {/* Highlight badge */}
      <div
        className="absolute -top-2.5 right-3 text-[10px] font-bold px-2 py-0.5 rounded-full text-white shadow-sm leading-none"
        style={{ background: site.accentColor }}
      >
        {t(site.highlightKey)}
      </div>
    </motion.a>
  )
}
