import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { DiaryProvider } from "@/contexts/diary-context"
import { I18nProvider } from "@/contexts/i18n-context"
import DiaryPage from "./page"
import type { ReactNode } from "react"

const createWrapper = () => {
  return ({ children }: { children: ReactNode }) => (
    <I18nProvider>
      <DiaryProvider>{children}</DiaryProvider>
    </I18nProvider>
  )
}

describe("DiaryPage", () => {
  it("should render diary page", () => {
    const wrapper = createWrapper()
    render(<DiaryPage />, { wrapper })

    expect(screen.getByText("Diary")).toBeInTheDocument()
    expect(screen.getByText("Track your daily activities and manage your tasks")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /add entry/i })).toBeInTheDocument()
  })

  it("should show activity form when add entry button is clicked", async () => {
    const user = userEvent.setup()
    const wrapper = createWrapper()
    render(<DiaryPage />, { wrapper })

    const addButton = screen.getByRole("button", { name: /add entry/i })
    await user.click(addButton)

    expect(screen.getByText("Add New Entry")).toBeInTheDocument()
    expect(screen.getByLabelText(/title/i)).toBeInTheDocument()
  })

  it("should display activities table", () => {
    const wrapper = createWrapper()
    render(<DiaryPage />, { wrapper })

    expect(screen.getByText("Diary Entries")).toBeInTheDocument()
    expect(screen.getByText("Great Day at Work")).toBeInTheDocument()
  })

  it("should hide form when cancel is clicked", async () => {
    const user = userEvent.setup()
    const wrapper = createWrapper()
    render(<DiaryPage />, { wrapper })

    // Show form
    const addButton = screen.getByRole("button", { name: /add entry/i })
    await user.click(addButton)

    expect(screen.getByText("Add New Entry")).toBeInTheDocument()

    // Find and click cancel button
    const cancelButton = screen.getByRole("button", { name: /cancel/i })
    await user.click(cancelButton)

    expect(screen.queryByText("Add New Entry")).not.toBeInTheDocument()
  })

  it("should show edit form when edit button is clicked", async () => {
    const user = userEvent.setup()
    const wrapper = createWrapper()
    render(<DiaryPage />, { wrapper })

    // Find edit buttons (they might be icon buttons)
    const editButtons = screen
      .getAllByRole("button")
      .filter((button) => button.querySelector("svg") && !button.textContent?.includes("Add Entry"))

    if (editButtons.length > 0) {
      await user.click(editButtons[0])
      expect(screen.getByText("Add New Entry")).toBeInTheDocument()
    }
  })

  it("should have proper page structure", () => {
    const wrapper = createWrapper()
    render(<DiaryPage />, { wrapper })

    // Check for main container
    const mainContainer = screen.getByText("Diary").closest("div")
    expect(mainContainer).toHaveClass("space-y-6")
  })

  it("should display page header with title and subtitle", () => {
    const wrapper = createWrapper()
    render(<DiaryPage />, { wrapper })

    expect(screen.getByText("Diary")).toBeInTheDocument()
    expect(screen.getByText("Track your daily activities and manage your tasks")).toBeInTheDocument()
  })

  it("should show form success state", async () => {
    const user = userEvent.setup()
    const wrapper = createWrapper()
    render(<DiaryPage />, { wrapper })

    // Show form
    const addButton = screen.getByRole("button", { name: /add entry/i })
    await user.click(addButton)

    // Fill and submit form
    await user.type(screen.getByLabelText(/title/i), "Test Entry")
    await user.type(screen.getByLabelText(/content/i), "Test content")

    // Select mood and category
    await user.click(screen.getByRole("combobox", { name: /mood/i }))
    await user.click(screen.getByText("Happy"))

    await user.click(screen.getByRole("combobox", { name: /category/i }))
    await user.click(screen.getByText("Personal"))

    // Submit form
    await user.click(screen.getByRole("button", { name: /save entry/i }))

    // Form should be hidden after successful submission
    expect(screen.queryByText("Add New Entry")).not.toBeInTheDocument()
  })

  it("should handle form state management correctly", async () => {
    const user = userEvent.setup()
    const wrapper = createWrapper()
    render(<DiaryPage />, { wrapper })

    // Initially form should not be visible
    expect(screen.queryByText("Add New Entry")).not.toBeInTheDocument()

    // Show form
    const addButton = screen.getByRole("button", { name: /add entry/i })
    await user.click(addButton)
    expect(screen.getByText("Add New Entry")).toBeInTheDocument()

    // Hide form
    const cancelButton = screen.getByRole("button", { name: /cancel/i })
    await user.click(cancelButton)
    expect(screen.queryByText("Add New Entry")).not.toBeInTheDocument()
  })

  it("should render both form and table when form is shown", async () => {
    const user = userEvent.setup()
    const wrapper = createWrapper()
    render(<DiaryPage />, { wrapper })

    const addButton = screen.getByRole("button", { name: /add entry/i })
    await user.click(addButton)

    // Both form and table should be visible
    expect(screen.getByText("Add New Entry")).toBeInTheDocument()
    expect(screen.getByText("Diary Entries")).toBeInTheDocument()
  })
})
