import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import zhTW from './locales/zh-TW'
import en from './locales/en'

const savedLang = typeof localStorage !== 'undefined'
  ? localStorage.getItem('icon-hero-lang') ?? 'zh-TW'
  : 'zh-TW'

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
