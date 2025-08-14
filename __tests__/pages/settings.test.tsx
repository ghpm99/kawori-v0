import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { SettingsProvider } from "@/contexts/settings-context"
import { I18nProvider } from "@/contexts/i18n-context"
import SettingsPage from "@/app/settings/page"
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

describe("SettingsPage", () => {
  it("should render settings page", () => {
    const wrapper = createWrapper()
    render(<SettingsPage />, { wrapper })

    expect(screen.getByText("Settings")).toBeInTheDocument()
    expect(screen.getByText("Account")).toBeInTheDocument()
    expect(screen.getByText("Security")).toBeInTheDocument()
    expect(screen.getByText("Preferences")).toBeInTheDocument()
    expect(screen.getByText("Notifications")).toBeInTheDocument()
    expect(screen.getByText("Privacy")).toBeInTheDocument()
  })

  it("should display account settings by default", () => {
    const wrapper = createWrapper()
    render(<SettingsPage />, { wrapper })

    expect(screen.getByText("Account Information")).toBeInTheDocument()
    expect(screen.getByDisplayValue("John Doe")).toBeInTheDocument()
    expect(screen.getByDisplayValue("john.doe@example.com")).toBeInTheDocument()
  })

  it("should switch to security tab", async () => {
    const user = userEvent.setup()
    const wrapper = createWrapper()
    render(<SettingsPage />, { wrapper })

    await user.click(screen.getByText("Security"))

    expect(screen.getByText("Security Settings")).toBeInTheDocument()
    expect(screen.getByText("Change your password and security preferences")).toBeInTheDocument()
  })

  it("should switch to preferences tab", async () => {
    const user = userEvent.setup()
    const wrapper = createWrapper()
    render(<SettingsPage />, { wrapper })

    await user.click(screen.getByText("Preferences"))

    expect(screen.getByText("Application Preferences")).toBeInTheDocument()
    expect(screen.getByText("Language")).toBeInTheDocument()
    expect(screen.getByText("Currency")).toBeInTheDocument()
  })

  it("should switch to notifications tab", async () => {
    const user = userEvent.setup()
    const wrapper = createWrapper()
    render(<SettingsPage />, { wrapper })

    await user.click(screen.getByText("Notifications"))

    expect(screen.getByText("Notification Preferences")).toBeInTheDocument()
    expect(screen.getByText("Email Notifications")).toBeInTheDocument()
    expect(screen.getByText("Push Notifications")).toBeInTheDocument()
  })

  it("should switch to privacy tab", async () => {
    const user = userEvent.setup()
    const wrapper = createWrapper()
    render(<SettingsPage />, { wrapper })

    await user.click(screen.getByText("Privacy"))

    expect(screen.getByText("Privacy Settings")).toBeInTheDocument()
    expect(screen.getByText("Data Sharing")).toBeInTheDocument()
    expect(screen.getByText("Account Visibility")).toBeInTheDocument()
  })

  it("should update account information", async () => {
    const user = userEvent.setup()
    const wrapper = createWrapper()
    render(<SettingsPage />, { wrapper })

    const nameInput = screen.getByDisplayValue("John Doe")
    await user.clear(nameInput)
    await user.type(nameInput, "Jane Smith")

    const saveButton = screen.getByRole("button", { name: /save changes/i })
    await user.click(saveButton)

    expect(nameInput).toHaveValue("Jane Smith")
  })

  it("should toggle notification switches", async () => {
    const user = userEvent.setup()
    const wrapper = createWrapper()
    render(<SettingsPage />, { wrapper })

    await user.click(screen.getByText("Notifications"))

    const emailSwitch = screen.getByRole("switch", { name: /email notifications/i })
    expect(emailSwitch).toBeChecked()

    await user.click(emailSwitch)
    expect(emailSwitch).not.toBeChecked()
  })

  it("should change privacy settings", async () => {
    const user = userEvent.setup()
    const wrapper = createWrapper()
    render(<SettingsPage />, { wrapper })

    await user.click(screen.getByText("Privacy"))

    const dataSharingSwitch = screen.getByRole("switch", { name: /analytics sharing/i })
    expect(dataSharingSwitch).toBeChecked()

    await user.click(dataSharingSwitch)
    expect(dataSharingSwitch).not.toBeChecked()
  })
})
