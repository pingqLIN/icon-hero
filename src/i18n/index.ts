import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import zhTW from './locales/zh-TW'
import en from './locales/en'

const savedLang = (() => {
  if (typeof localStorage === 'undefined') {
    return 'zh-TW'
  }
  try {
    const stored = localStorage.getItem('icon-hero-lang')
    if (stored === 'zh-TW' || stored === 'en') {
      return stored
    }
  } catch {
    // Ignore storage access errors and fall back to default language.
  }
  return 'zh-TW'
})()

i18n
  .use(initReactI18next)
  .init({
    resources: {
      'zh-TW': zhTW,
      en,
    },
    lng: savedLang,
    fallbackLng: 'zh-TW',
    interpolation: {
      escapeValue: false,
    },
  })

export default i18n
