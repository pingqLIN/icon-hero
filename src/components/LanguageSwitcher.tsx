import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Globe } from '@phosphor-icons/react'
import { LANGUAGE_STORAGE_KEY, SUPPORTED_LANGUAGES, type SupportedLanguageCode } from '@/i18n/languages'

export function LanguageSwitcher() {
  const { i18n, t } = useTranslation()

  const handleChange = (code: SupportedLanguageCode) => {
    i18n
      .changeLanguage(code)
      .then(() => {
        try {
          localStorage.setItem(LANGUAGE_STORAGE_KEY, code)
        } catch {
          // ignoring storage errors to avoid crashing the component tree
        }
      })
      .catch(() => {
        /* language change failed silently */
      })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" aria-label={t('switchLanguage')} data-help={t('helpLanguageSwitcher')}>
          <Globe size={18} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {SUPPORTED_LANGUAGES.map(({ code, label }) => (
          <DropdownMenuItem
            key={code}
            onClick={() => handleChange(code)}
            className={i18n.language === code ? 'font-semibold' : ''}
            data-help={t('helpLanguageOption', { language: label })}
          >
            {label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
