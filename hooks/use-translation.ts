import { useI18n } from "@/contexts/i18n-context"

export function useTranslation() {
  const { locale, setLocale, t } = useI18n()

  return {
    locale,
    setLocale,
    t,
  }
}
