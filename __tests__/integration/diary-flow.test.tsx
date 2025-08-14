import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { DiaryProvider } from "@/contexts/diary-context"
import { I18nProvider } from "@/contexts/i18n-context"
import DiaryPage from "@/app/diary/page"
import type { ReactNode } from "react"
import jest from "jest" // Import jest to declare the variable

// Mock window.confirm
global.confirm = jest.fn(() => true)

const createWrapper = () => {
  return ({ children }: { children: ReactNode }) => (
    <I18nProvider>
      <DiaryProvider>{children}</DiaryProvider>
    </I18nProvider>
  )
}

describe("Diary Flow Integration", () => {
  it("should complete full diary entry management flow", async () => {
    const user = userEvent.setup()
    const wrapper = createWrapper()
    render(<DiaryPage />, { wrapper })

    // Verify initial state
    expect(screen.getByText("Diary")).toBeInTheDocument()
    expect(screen.getByText("Great Day at Work")).toBeInTheDocument()

    // Add new entry
    await user.click(screen.getByRole("button", { name: /add entry/i }))

    // Fill out form
    await user.type(screen.getByLabelText(/title/i), "Integration Test Entry")
    await user.type(screen.getByLabelText(/content/i), "This is a test entry for integration testing")

    // Select mood
    await user.click(screen.getByRole("combobox", { name: /mood/i }))
    await user.click(screen.getByText("Happy"))

    // Select category
    await user.click(screen.getByRole("combobox", { name: /category/i }))
    await user.click(screen.getByText("Personal"))

    // Add tag
    await user.type(screen.getByPlaceholderText(/add a tag/i), "integration-test")
    await user.click(screen.getByRole("button", { name: /\+/i }))

    // Submit form
    await user.click(screen.getByRole("button", { name: /save entry/i }))

    // Verify entry was added
    await waitFor(() => {
      expect(screen.getByText("Integration Test Entry")).toBeInTheDocument()
    })

    // Test filtering
    await user.type(screen.getByPlaceholderText(/search entries/i), "integration")

    await waitFor(() => {
      expect(screen.getByText("Integration Test Entry")).toBeInTheDocument()
      expect(screen.queryByText("Great Day at Work")).not.toBeInTheDocument()
    })

    // Clear search
    await user.clear(screen.getByPlaceholderText(/search entries/i))

    // Test category filter
    await user.click(screen.getByRole("combobox", { name: /all categories/i }))
    await user.click(screen.getByText("Work"))

    await waitFor(() => {
      expect(screen.getByText("Great Day at Work")).toBeInTheDocument()
      expect(screen.queryByText("Integration Test Entry")).not.toBeInTheDocument()
    })

    // Reset filter
    await user.click(screen.getByRole("combobox", { name: /work/i }))
    await user.click(screen.getByText("All Categories"))

    // Test delete functionality
    const deleteButtons = screen.getAllByRole("button", { name: /delete/i })
    await user.click(deleteButtons[0])

    await waitFor(() => {
      expect(global.confirm).toHaveBeenCalled()
    })
  })

  it("should handle form validation", async () => {
    const user = userEvent.setup()
    const wrapper = createWrapper()
    render(<DiaryPage />, { wrapper })

    // Try to submit empty form
    await user.click(screen.getByRole("button", { name: /add entry/i }))
    await user.click(screen.getByRole("button", { name: /save entry/i }))

    // Form should not submit (required fields empty)
    expect(screen.getByText("Add New Entry")).toBeInTheDocument()
  })

  it("should handle edit functionality", async () => {
    const user = userEvent.setup()
    const wrapper = createWrapper()
    render(<DiaryPage />, { wrapper })

    // Click edit on first entry
    const editButtons = screen.getAllByRole("button", { name: /edit/i })
    await user.click(editButtons[0])

    // Verify form is populated
    expect(screen.getByDisplayValue("Great Day at Work")).toBeInTheDocument()

    // Modify title
    const titleInput = screen.getByDisplayValue("Great Day at Work")
    await user.clear(titleInput)
    await user.type(titleInput, "Updated Entry Title")

    // Save changes
    await user.click(screen.getByRole("button", { name: /save entry/i }))

    // Verify changes
    await waitFor(() => {
      expect(screen.getByText("Updated Entry Title")).toBeInTheDocument()
    })
  })
})
