import { renderHook } from "@testing-library/react"
import { I18nProvider } from "@/contexts/i18n-context"
import { useTranslation } from "@/hooks/use-translation"
import type { ReactNode } from "react"

const createWrapper = () => {
  return ({ children }: { children: ReactNode }) => <I18nProvider>{children}</I18nProvider>
}

describe("useTranslation", () => {
  it("should return translation function", () => {
    const wrapper = createWrapper()
    const { result } = renderHook(() => useTranslation(), { wrapper })

    expect(typeof result.current.t).toBe("function")
    expect(typeof result.current.setLocale).toBe("function")
    expect(result.current.locale).toBe("en")
  })

  it("should translate keys correctly", () => {
    const wrapper = createWrapper()
    const { result } = renderHook(() => useTranslation(), { wrapper })

    expect(result.current.t("common.save")).toBe("Save")
    expect(result.current.t("common.cancel")).toBe("Cancel")
    expect(result.current.t("common.delete")).toBe("Delete")
  })

  it("should return key if translation not found", () => {
    const wrapper = createWrapper()
    const { result } = renderHook(() => useTranslation(), { wrapper })

    expect(result.current.t("nonexistent.key")).toBe("nonexistent.key")
  })

  it("should handle nested translation keys", () => {
    const wrapper = createWrapper()
    const { result } = renderHook(() => useTranslation(), { wrapper })

    expect(result.current.t("budget.title")).toBe("Budget")
    expect(result.current.t("diary.title")).toBe("Diary")
    expect(result.current.t("settings.title")).toBe("Settings")
  })
})
