"use client"

import type React from "react"
import { createContext, useContext, useState } from "react"

type Locale = "en" | "pt"

type Translations = {
  [key: string]: string | Translations
}

type I18nContextType = {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: (key: string) => string
}

// Import translations
import enTranslations from "@/i18n/locales/en.json"
import ptTranslations from "@/i18n/locales/pt.json"

const translations: Record<Locale, Translations> = {
  en: enTranslations,
  pt: ptTranslations,
}

export const I18nContext = createContext<I18nContextType | undefined>(undefined)

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = useState<Locale>("en")

  const t = (key: string): string => {
    const keys = key.split(".")
    let value: any = translations[locale]

    for (const k of keys) {
      if (value === undefined) return key
      value = value[k]
    }

    return typeof value === "string" ? value : key
  }

  return <I18nContext.Provider value={{ locale, setLocale, t }}>{children}</I18nContext.Provider>
}

export function useI18n() {
  const context = useContext(I18nContext)
  if (context === undefined) {
    throw new Error("useI18n must be used within an I18nProvider")
  }
  return context
}
