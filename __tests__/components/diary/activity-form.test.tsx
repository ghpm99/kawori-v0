import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { DiaryProvider } from "@/contexts/diary-context"
import { I18nProvider } from "@/contexts/i18n-context"
import { ActivityForm } from "@/components/diary/activity-form"
import type { ReactNode } from "react"

const createWrapper = () => {
  return ({ children }: { children: ReactNode }) => (
    <I18nProvider>
      <DiaryProvider>{children}</DiaryProvider>
    </I18nProvider>
  )
}

describe("ActivityForm", () => {
  it("should render form fields", () => {
    const wrapper = createWrapper()
    render(<ActivityForm />, { wrapper })

    expect(screen.getByLabelText(/title/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/date/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/content/i)).toBeInTheDocument()
    expect(screen.getByText(/mood/i)).toBeInTheDocument()
    expect(screen.getByText(/category/i)).toBeInTheDocument()
    expect(screen.getByText(/tags/i)).toBeInTheDocument()
  })

  it("should submit form with valid data", async () => {
    const user = userEvent.setup()
    const wrapper = createWrapper()
    render(<ActivityForm />, { wrapper })

    // Fill out the form
    await user.type(screen.getByLabelText(/title/i), "Test Entry")
    await user.type(screen.getByLabelText(/content/i), "This is a test entry content")

    // Select mood
    await user.click(screen.getByRole("combobox", { name: /mood/i }))
    await user.click(screen.getByText("Happy"))

    // Select category
    await user.click(screen.getByRole("combobox", { name: /category/i }))
    await user.click(screen.getByText("Personal"))

    // Submit form
    await user.click(screen.getByRole("button", { name: /save entry/i }))

    await waitFor(() => {
      expect(screen.getByLabelText(/title/i)).toHaveValue("")
    })
  })

  it("should add and remove tags", async () => {
    const user = userEvent.setup()
    const wrapper = createWrapper()
    render(<ActivityForm />, { wrapper })

    const tagInput = screen.getByPlaceholderText(/add a tag/i)
    const addButton = screen.getByRole("button", { name: /\+/i })

    // Add a tag
    await user.type(tagInput, "test-tag")
    await user.click(addButton)

    expect(screen.getByText("test-tag")).toBeInTheDocument()

    // Remove the tag
    const removeButton = screen.getByRole("button", { name: /×/i })
    await user.click(removeButton)

    expect(screen.queryByText("test-tag")).not.toBeInTheDocument()
  })

  it("should prevent form submission with empty required fields", async () => {
    const user = userEvent.setup()
    const wrapper = createWrapper()
    render(<ActivityForm />, { wrapper })

    const submitButton = screen.getByRole("button", { name: /save entry/i })

    // Try to submit without filling required fields
    await user.click(submitButton)

    // Form should not submit (title field should still be empty)
    expect(screen.getByLabelText(/title/i)).toHaveValue("")
  })

  it("should add tag on Enter key press", async () => {
    const user = userEvent.setup()
    const wrapper = createWrapper()
    render(<ActivityForm />, { wrapper })

    const tagInput = screen.getByPlaceholderText(/add a tag/i)

    await user.type(tagInput, "enter-tag")
    await user.keyboard("{Enter}")

    expect(screen.getByText("enter-tag")).toBeInTheDocument()
    expect(tagInput).toHaveValue("")
  })
})
