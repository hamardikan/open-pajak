import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import id from './locales/id/common.json'
import en from './locales/en/common.json'
import ja from './locales/ja/common.json'
import zh from './locales/zh/common.json'
import zhTW from './locales/zh-TW/common.json'

export const availableLocales = [
  { code: 'id', label: 'Bahasa', emoji: '🇮🇩' },
  { code: 'en', label: 'English', emoji: '🇺🇸' },
  { code: 'ja', label: '日本語', emoji: '🇯🇵' },
  { code: 'zh', label: '简体中文', emoji: '🇨🇳' },
  { code: 'zh-TW', label: '繁體中文', emoji: '🇹🇼' },
]

const resources = {
  id: { translation: id },
  en: { translation: en },
  ja: { translation: ja },
  zh: { translation: zh },
  'zh-TW': { translation: zhTW },
}

const fallbackLng = 'id'

const detectLocale = () => {
  const stored = typeof window !== 'undefined' ? localStorage.getItem('locale') : null
  if (stored && resources[stored as keyof typeof resources]) return stored
  const navigatorLang =
    typeof window !== 'undefined'
      ? window.navigator.language.split('-')[0]
      : fallbackLng
  if (resources[navigatorLang as keyof typeof resources]) {
    return navigatorLang
  }
  return fallbackLng
}

i18n.use(initReactI18next).init({
  resources,
  lng: detectLocale(),
  fallbackLng,
  interpolation: {
    escapeValue: false,
  },
  react: {
    useSuspense: false,
  },
})

export function changeLocale(locale: string) {
  if (!resources[locale as keyof typeof resources]) {
    return
  }
  i18n.changeLanguage(locale)
  if (typeof window !== 'undefined') {
    localStorage.setItem('locale', locale)
  }
}

export default i18n
