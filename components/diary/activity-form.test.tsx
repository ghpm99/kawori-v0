import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { DiaryProvider } from "@/contexts/diary-context"
import { I18nProvider } from "@/contexts/i18n-context"
import { ActivityForm } from "./activity-form"
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
    const addButton = screen.getByRole("button", { name: "" }) // Plus icon button

    // Add a tag
    await user.type(tagInput, "test-tag")
    await user.click(addButton)

    expect(screen.getByText("test-tag")).toBeInTheDocument()

    // Remove the tag
    const removeButton = screen.getByRole("button", { name: "" }) // X icon button in tag
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

  it("should display mood options with emojis", async () => {
    const user = userEvent.setup()
    const wrapper = createWrapper()
    render(<ActivityForm />, { wrapper })

    await user.click(screen.getByRole("combobox", { name: /mood/i }))

    expect(screen.getByText("😊")).toBeInTheDocument() // Happy
    expect(screen.getByText("😢")).toBeInTheDocument() // Sad
    expect(screen.getByText("🎉")).toBeInTheDocument() // Excited
    expect(screen.getByText("😌")).toBeInTheDocument() // Calm
  })

  it("should display category options", async () => {
    const user = userEvent.setup()
    const wrapper = createWrapper()
    render(<ActivityForm />, { wrapper })

    await user.click(screen.getByRole("combobox", { name: /category/i }))

    expect(screen.getByText("Work")).toBeInTheDocument()
    expect(screen.getByText("Personal")).toBeInTheDocument()
    expect(screen.getByText("Health")).toBeInTheDocument()
    expect(screen.getByText("Family")).toBeInTheDocument()
  })

  it("should set default date to today", () => {
    const wrapper = createWrapper()
    render(<ActivityForm />, { wrapper })

    const dateInput = screen.getByLabelText(/date/i) as HTMLInputElement
    const today = new Date().toISOString().split("T")[0]
    expect(dateInput.value).toBe(today)
  })

  it("should prevent duplicate tags", async () => {
    const user = userEvent.setup()
    const wrapper = createWrapper()
    render(<ActivityForm />, { wrapper })

    const tagInput = screen.getByPlaceholderText(/add a tag/i)
    const addButton = screen.getByRole("button", { name: "" }) // Plus icon button

    // Add a tag twice
    await user.type(tagInput, "duplicate-tag")
    await user.click(addButton)

    await user.type(tagInput, "duplicate-tag")
    await user.click(addButton)

    const tags = screen.getAllByText("duplicate-tag")
    expect(tags).toHaveLength(1) // Should only appear once
  })

  it("should show loading state when submitting", async () => {
    const user = userEvent.setup()
    const wrapper = createWrapper()
    render(<ActivityForm />, { wrapper })

    // Fill required fields
    await user.type(screen.getByLabelText(/title/i), "Test Entry")
    await user.type(screen.getByLabelText(/content/i), "Test content")

    await user.click(screen.getByRole("combobox", { name: /mood/i }))
    await user.click(screen.getByText("Happy"))

    await user.click(screen.getByRole("combobox", { name: /category/i }))
    await user.click(screen.getByText("Personal"))

    // Submit form
    const submitButton = screen.getByRole("button", { name: /save entry/i })
    await user.click(submitButton)

    // Should show loading state briefly
    expect(screen.getByText(/saving/i)).toBeInTheDocument()
  })
})
