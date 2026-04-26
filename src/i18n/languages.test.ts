import { describe, expect, it } from 'vitest'
import {
  resolveLanguageCode,
  resolvePreferredLanguage,
  SUPPORTED_LANGUAGES,
  type SupportedLanguageCode,
} from './languages'
import zhTW from './locales/zh-TW'
import zhCN from './locales/zh-CN'
import en from './locales/en'
import es from './locales/es'
import fr from './locales/fr'
import ja from './locales/ja'
import ko from './locales/ko'

describe('language resolver', () => {
  it('uses a supported saved language before browser language detection', () => {
    expect(
      resolvePreferredLanguage({
        saved: 'en',
        navigatorLanguages: ['ja-JP', 'zh-CN'],
        navigatorLanguage: 'ko-KR',
      }),
    ).toBe('en')
  })

  it('ignores invalid saved values and resolves browser languages in order', () => {
    expect(
      resolvePreferredLanguage({
        saved: 'de-DE',
        navigatorLanguages: ['de-DE', 'es-MX'],
        navigatorLanguage: 'fr-FR',
      }),
    ).toBe('es')
  })

  it('falls back to navigator.language when navigator.languages is empty', () => {
    expect(resolvePreferredLanguage({ navigatorLanguages: [], navigatorLanguage: 'fr-CA' })).toBe('fr')
  })

  it.each([
    ['zh', 'zh-TW'],
    ['zh-Hant', 'zh-TW'],
    ['zh-Hant-TW', 'zh-TW'],
    ['zh-Hant-HK', 'zh-TW'],
    ['zh-HK', 'zh-TW'],
    ['zh-MO', 'zh-TW'],
    ['zh-TW', 'zh-TW'],
    ['zh-Hans', 'zh-CN'],
    ['zh-Hans-CN', 'zh-CN'],
    ['zh-SG', 'zh-CN'],
    ['zh-CN', 'zh-CN'],
    ['ja-JP', 'ja'],
    ['ko-KR', 'ko'],
  ] satisfies Array<[string, SupportedLanguageCode]>)('maps %s to %s', (input, expected) => {
    expect(resolveLanguageCode(input)).toBe(expected)
  })

  it('falls back to Traditional Chinese when no candidate matches', () => {
    expect(resolvePreferredLanguage({ saved: null, navigatorLanguages: ['de-DE'], navigatorLanguage: null })).toBe(
      'zh-TW',
    )
  })
})

describe('locale resources', () => {
  const resources: Record<SupportedLanguageCode, unknown> = {
    'zh-TW': zhTW.translation,
    'zh-CN': zhCN.translation,
    en: en.translation,
    es: es.translation,
    fr: fr.translation,
    ja: ja.translation,
    ko: ko.translation,
  }

  const flattenKeys = (value: unknown, prefix = ''): string[] => {
    if (!value || typeof value !== 'object' || Array.isArray(value)) {
      return [prefix]
    }

    return Object.entries(value).flatMap(([key, child]) => flattenKeys(child, prefix ? `${prefix}.${key}` : key))
  }

  it('keeps the language inventory in sync with locale files', () => {
    expect(Object.keys(resources).sort()).toEqual(SUPPORTED_LANGUAGES.map(({ code }) => code).sort())
  })

  it.each(SUPPORTED_LANGUAGES.map(({ code }) => code))('keeps %s translation keys complete', code => {
    expect(flattenKeys(resources[code]).sort()).toEqual(flattenKeys(zhTW.translation).sort())
  })
})
