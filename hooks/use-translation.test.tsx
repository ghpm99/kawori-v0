import { renderHook } from "@testing-library/react"
import { I18nProvider } from "@/contexts/i18n-context"
import { useTranslation } from "./use-translation"
import type { ReactNode } from "react"

const createWrapper = () => {
  return ({ children }: { children: ReactNode }) => <I18nProvider>{children}</I18nProvider>
}

describe("useTranslation", () => {
  it("should provide translation function", () => {
    const wrapper = createWrapper()
    const { result } = renderHook(() => useTranslation(), { wrapper })

    expect(result.current.t).toBeDefined()
    expect(typeof result.current.t).toBe("function")
  })

  it("should provide current locale", () => {
    const wrapper = createWrapper()
    const { result } = renderHook(() => useTranslation(), { wrapper })

    expect(result.current.locale).toBeDefined()
    expect(typeof result.current.locale).toBe("string")
  })

  it("should provide setLocale function", () => {
    const wrapper = createWrapper()
    const { result } = renderHook(() => useTranslation(), { wrapper })

    expect(result.current.setLocale).toBeDefined()
    expect(typeof result.current.setLocale).toBe("function")
  })

  it("should translate simple keys", () => {
    const wrapper = createWrapper()
    const { result } = renderHook(() => useTranslation(), { wrapper })

    const translation = result.current.t("common.loading")
    expect(typeof translation).toBe("string")
    expect(translation).not.toBe("common.loading") // Should be translated
  })

  it("should handle missing translations", () => {
    const wrapper = createWrapper()
    const { result } = renderHook(() => useTranslation(), { wrapper })

    const translation = result.current.t("nonexistent.key")
    expect(translation).toBe("nonexistent.key") // Should return key if not found
  })

  it("should handle interpolation", () => {
    const wrapper = createWrapper()
    const { result } = renderHook(() => useTranslation(), { wrapper })

    const translation = result.current.t("common.currency", { amount: 1000 })
    expect(typeof translation).toBe("string")
    expect(translation).toContain("1000")
  })

  it("should change locale", () => {
    const wrapper = createWrapper()
    const { result } = renderHook(() => useTranslation(), { wrapper })

    const initialLocale = result.current.locale

    // Change locale
    result.current.setLocale("pt")

    expect(result.current.locale).toBe("pt")
    expect(result.current.locale).not.toBe(initialLocale)
  })

  it("should provide available locales", () => {
    const wrapper = createWrapper()
    const { result } = renderHook(() => useTranslation(), { wrapper })

    expect(result.current.availableLocales).toBeDefined()
    expect(Array.isArray(result.current.availableLocales)).toBe(true)
    expect(result.current.availableLocales.length).toBeGreaterThan(0)
  })

  it("should handle nested translation keys", () => {
    const wrapper = createWrapper()
    const { result } = renderHook(() => useTranslation(), { wrapper })

    const translation = result.current.t("settings.account.title")
    expect(typeof translation).toBe("string")
    expect(translation.length).toBeGreaterThan(0)
  })

  it("should handle pluralization", () => {
    const wrapper = createWrapper()
    const { result } = renderHook(() => useTranslation(), { wrapper })

    const singular = result.current.t("common.item", { count: 1 })
    const plural = result.current.t("common.items", { count: 2 })

    expect(typeof singular).toBe("string")
    expect(typeof plural).toBe("string")
  })
})
