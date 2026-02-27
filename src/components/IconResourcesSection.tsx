import { motion } from 'framer-motion'
import { ArrowSquareOut, Star } from '@phosphor-icons/react'

interface IconSite {
  name: string
  url: string
  tagline: string
  count: string
  license: 'free' | 'freemium' | 'paid'
  formats: string[]
  highlight: string
  accentColor: string
  logo: string
}

const ICON_SITES: IconSite[] = [
  {
    name: 'Flaticon',
    url: 'https://www.flaticon.com',
    tagline: '全球最大圖示庫，涵蓋扁平、輪廓、3D 等多種風格',
    count: '22M+',
    license: 'freemium',
    formats: ['SVG', 'PNG', 'ICO', 'PSD'],
    highlight: '最大圖示庫',
    accentColor: '#00BFA5',
    logo: '🟩',
  },
  {
    name: 'Icons8',
    url: 'https://icons8.com',
    tagline: '一鍵調色、多風格切換，支援插畫、照片與 AI 生成資源',
    count: '1.5M+',
    license: 'freemium',
    formats: ['SVG', 'PNG', 'ICO', 'PDF'],
    highlight: '風格多元',
    accentColor: '#43A047',
    logo: '🟢',
  },
  {
    name: 'The Noun Project',
    url: 'https://thenounproject.com',
    tagline: '社群設計師貢獻的極簡 SVG 圖示，以「通用語言」為設計哲學',
    count: '5M+',
    license: 'freemium',
    formats: ['SVG', 'PNG'],
    highlight: '極簡設計',
    accentColor: '#757575',
    logo: '⬛',
  },
  {
    name: 'Iconfinder',
    url: 'https://www.iconfinder.com',
    tagline: '高品質圖示市集，從精緻寫實到扁平化應有盡有',
    count: '6M+',
    license: 'freemium',
    formats: ['SVG', 'PNG', 'ICO', 'ICNS'],
    highlight: '品質首選',
    accentColor: '#1E88E5',
    logo: '🔵',
  },
  {
    name: 'Font Awesome',
    url: 'https://fontawesome.com',
    tagline: '前端開發的經典圖示套件，支援 CSS/JS 快速引入',
    count: '30k+',
    license: 'freemium',
    formats: ['SVG', 'WebFont', 'React'],
    highlight: '前端經典',
    accentColor: '#228BE6',
    logo: '🔷',
  },
  {
    name: 'Phosphor Icons',
    url: 'https://phosphoricons.com',
    tagline: '6 種筆觸重量彈性切換，MIT 授權，React / Vue 原生支援',
    count: '9k+',
    license: 'free',
    formats: ['SVG', 'React', 'Vue', 'Flutter'],
    highlight: '本站採用',
    accentColor: '#7950F2',
    logo: '🟣',
  },
  {
    name: 'Heroicons',
    url: 'https://heroicons.com',
    tagline: 'Tailwind CSS 官方圖示，Outline / Solid / Mini 三種規格',
    count: '300+',
    license: 'free',
    formats: ['SVG', 'React', 'Vue'],
    highlight: 'Tailwind 官方',
    accentColor: '#06B6D4',
    logo: '🦸',
  },
  {
    name: 'Lucide',
    url: 'https://lucide.dev',
    tagline: 'Feather Icons 的社群繼承者，持續更新擴充，MIT 授權',
    count: '1.5k+',
    license: 'free',
    formats: ['SVG', 'React', 'Vue', 'Flutter'],
    highlight: '社群活躍',
    accentColor: '#F97316',
    logo: '✨',
  },
  {
    name: 'Feather Icons',
    url: 'https://feathericons.com',
    tagline: '一致描線風格的極簡開源圖示集，適合介面設計配置',
    count: '287',
    license: 'free',
    formats: ['SVG'],
    highlight: '極簡開源',
    accentColor: '#868E96',
    logo: '🪶',
  },
  {
    name: 'Material Icons',
    url: 'https://fonts.google.com/icons',
    tagline: 'Google Material Design 官方圖示，5 種主題風格自由選擇',
    count: '2500+',
    license: 'free',
    formats: ['SVG', 'PNG', 'Android', 'iOS'],
    highlight: 'Google 官方',
    accentColor: '#4285F4',
    logo: '🔵',
  },
]

const LICENSE_LABEL: Record<IconSite['license'], { label: string; className: string }> = {
  free: { label: '免費', className: 'bg-emerald-500/15 text-emerald-500 ring-1 ring-emerald-500/30' },
  freemium: { label: '免費 + 付費', className: 'bg-amber-500/15 text-amber-500 ring-1 ring-amber-500/30' },
  paid: { label: '付費', className: 'bg-rose-500/15 text-rose-500 ring-1 ring-rose-500/30' },
}

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
}

const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
}

export function IconResourcesSection() {
  return (
    <section className="mt-16">
      {/* Section Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="h-px flex-1 bg-border" />
        <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground tracking-wider uppercase">
          <Star size={14} weight="fill" className="text-primary" />
          世界前 10 大 Icon 資源網站
          <Star size={14} weight="fill" className="text-primary" />
        </div>
        <div className="h-px flex-1 bg-border" />
      </div>

      <p className="text-center text-sm text-muted-foreground mb-8 -mt-2">
        找到理想圖示後，直接貼上 URL 或下載後拖入上方工作區即可轉換
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
          <SiteCard key={site.name} site={site} />
        ))}
      </motion.div>
    </section>
  )
}

function SiteCard({ site }: { site: IconSite }) {
  const license = LICENSE_LABEL[site.license]

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
        {site.tagline}
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
        {site.highlight}
      </div>
    </motion.a>
  )
}
