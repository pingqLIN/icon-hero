import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import zhTW from './locales/zh-TW'
import zhCN from './locales/zh-CN'
import en from './locales/en'
import es from './locales/es'
import fr from './locales/fr'
import ja from './locales/ja'
import ko from './locales/ko'
import { getInitialLanguage, SUPPORTED_LANGUAGES } from './languages'

const initialLanguage = getInitialLanguage()

i18n
  .use(initReactI18next)
  .init({
    resources: {
      'zh-TW': zhTW,
      'zh-CN': zhCN,
      en,
      es,
      fr,
      ja,
      ko,
    },
    lng: initialLanguage,
    fallbackLng: 'zh-TW',
    supportedLngs: SUPPORTED_LANGUAGES.map(({ code }) => code),
    interpolation: {
      escapeValue: false,
    },
  })

export default i18n
