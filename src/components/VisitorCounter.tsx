import { useTranslation } from 'react-i18next'
import { Users } from '@phosphor-icons/react'
import { useVisitorCount } from '@/hooks/use-visitor-count'

export function VisitorCounter() {
  const { t } = useTranslation()
  const { count, loading, error } = useVisitorCount()

  return (
    <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
      <Users size={16} />
      <span>{t('visitorCount')}:</span>
      {loading ? (
        <span className="animate-pulse">{t('visitorLoading')}</span>
      ) : error ? (
        <span>{t('visitorError')}</span>
      ) : (
        <span className="font-semibold tabular-nums text-foreground">
          {count?.toLocaleString() ?? '-'}
        </span>
      )}
    </div>
  )
}
