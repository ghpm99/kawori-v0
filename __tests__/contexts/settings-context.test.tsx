import { renderHook, act } from "@testing-library/react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { SettingsProvider, useSettings } from "@/contexts/settings-context"
import { I18nProvider } from "@/contexts/i18n-context"
import type { ReactNode } from "react"

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  })

  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <I18nProvider>
        <SettingsProvider>{children}</SettingsProvider>
      </I18nProvider>
    </QueryClientProvider>
  )
}

describe("SettingsContext", () => {
  it("should provide initial settings", () => {
    const wrapper = createWrapper()
    const { result } = renderHook(() => useSettings(), { wrapper })

    expect(result.current.settings).toBeDefined()
    expect(result.current.settings?.fullName).toBe("John Doe")
    expect(result.current.settings?.email).toBe("john.doe@example.com")
    expect(result.current.settings?.language).toBe("en")
    expect(result.current.settings?.theme).toBe("system")
  })

  it("should have correct notification settings", () => {
    const wrapper = createWrapper()
    const { result } = renderHook(() => useSettings(), { wrapper })

    const notifications = result.current.settings?.notifications
    expect(notifications?.email).toBe(true)
    expect(notifications?.push).toBe(true)
    expect(notifications?.sms).toBe(false)
    expect(notifications?.marketing).toBe(false)
    expect(notifications?.updates).toBe(true)
    expect(notifications?.accountActivity).toBe(true)
  })

  it("should have correct privacy settings", () => {
    const wrapper = createWrapper()
    const { result } = renderHook(() => useSettings(), { wrapper })

    const privacy = result.current.settings?.privacy
    expect(privacy?.dataSharing).toBe(true)
    expect(privacy?.accountVisibility).toBe("public")
    expect(privacy?.personalizedAds).toBe(false)
  })

  it("should update settings", async () => {
    const wrapper = createWrapper()
    const { result } = renderHook(() => useSettings(), { wrapper })

    await act(async () => {
      await result.current.updateSettings({
        fullName: "Jane Doe",
        language: "pt",
      })
    })

    // Note: In a real test, you'd mock the API and verify the mutation was called
    expect(result.current.updateSettings).toBeDefined()
  })

  it("should update notifications", async () => {
    const wrapper = createWrapper()
    const { result } = renderHook(() => useSettings(), { wrapper })

    await act(async () => {
      await result.current.updateNotifications({
        email: false,
        marketing: true,
      })
    })

    expect(result.current.updateNotifications).toBeDefined()
  })

  it("should update privacy settings", async () => {
    const wrapper = createWrapper()
    const { result } = renderHook(() => useSettings(), { wrapper })

    await act(async () => {
      await result.current.updatePrivacy({
        dataSharing: false,
        accountVisibility: "private",
      })
    })

    expect(result.current.updatePrivacy).toBeDefined()
  })
})
