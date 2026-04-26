export const LANGUAGE_STORAGE_KEY = 'icon-hero-lang'

export const SUPPORTED_LANGUAGES = [
  { code: 'zh-TW', label: '繁體中文' },
  { code: 'zh-CN', label: '简体中文' },
  { code: 'en', label: 'English' },
  { code: 'ja', label: '日本語' },
  { code: 'es', label: 'Español' },
  { code: 'fr', label: 'Français' },
  { code: 'ko', label: '한국어' },
] as const

export type SupportedLanguageCode = (typeof SUPPORTED_LANGUAGES)[number]['code']

const FALLBACK_LANGUAGE: SupportedLanguageCode = 'zh-TW'
const SUPPORTED_LANGUAGE_CODES = new Set<string>(SUPPORTED_LANGUAGES.map(({ code }) => code))

export interface PreferredLanguageInput {
  saved?: string | null
  navigatorLanguages?: readonly string[] | null
  navigatorLanguage?: string | null
}

export function isSupportedLanguageCode(value: string): value is SupportedLanguageCode {
  return SUPPORTED_LANGUAGE_CODES.has(value)
}

export function resolveLanguageCode(language: string | null | undefined): SupportedLanguageCode | null {
  if (!language) {
    return null
  }

  const normalized = language.trim().replace(/_/g, '-').toLowerCase()
  if (!normalized) {
    return null
  }

  if (normalized === 'zh-tw') {
    return 'zh-TW'
  }

  if (normalized === 'zh-cn') {
    return 'zh-CN'
  }

  if (
    normalized === 'zh' ||
    normalized.startsWith('zh-hant') ||
    normalized === 'zh-hk' ||
    normalized === 'zh-mo'
  ) {
    return 'zh-TW'
  }

  if (normalized.startsWith('zh-hans') || normalized === 'zh-sg') {
    return 'zh-CN'
  }

  if (normalized.startsWith('en')) {
    return 'en'
  }

  if (normalized.startsWith('ja')) {
    return 'ja'
  }

  if (normalized.startsWith('es')) {
    return 'es'
  }

  if (normalized.startsWith('fr')) {
    return 'fr'
  }

  if (normalized.startsWith('ko')) {
    return 'ko'
  }

  return null
}

export function resolvePreferredLanguage({
  saved,
  navigatorLanguages,
  navigatorLanguage,
}: PreferredLanguageInput): SupportedLanguageCode {
  if (saved && isSupportedLanguageCode(saved)) {
    return saved
  }

  const candidates = [...(navigatorLanguages ?? []), navigatorLanguage].filter(Boolean)
  for (const candidate of candidates) {
    const resolved = resolveLanguageCode(candidate)
    if (resolved) {
      return resolved
    }
  }

  return FALLBACK_LANGUAGE
}

export function getInitialLanguage(): SupportedLanguageCode {
  const saved = (() => {
    if (typeof localStorage === 'undefined') {
      return null
    }

    try {
      return localStorage.getItem(LANGUAGE_STORAGE_KEY)
    } catch {
      return null
    }
  })()

  const navigatorLanguages = typeof navigator === 'undefined' ? null : navigator.languages
  const navigatorLanguage = typeof navigator === 'undefined' ? null : navigator.language

  return resolvePreferredLanguage({ saved, navigatorLanguages, navigatorLanguage })
}
