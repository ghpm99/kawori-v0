import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { DiaryProvider } from "@/contexts/diary-context"
import { I18nProvider } from "@/contexts/i18n-context"
import { ActivitiesTable } from "@/components/diary/activities-table"
import type { ReactNode } from "react"
import jest from "jest" // Import jest to fix the undeclared variable error

// Mock window.confirm
global.confirm = jest.fn(() => true)

const createWrapper = () => {
  return ({ children }: { children: ReactNode }) => (
    <I18nProvider>
      <DiaryProvider>{children}</DiaryProvider>
    </I18nProvider>
  )
}

describe("ActivitiesTable", () => {
  it("should render table with entries", () => {
    const wrapper = createWrapper()
    render(<ActivitiesTable />, { wrapper })

    expect(screen.getByText("Diary Entries")).toBeInTheDocument()
    expect(screen.getByText("Great Day at Work")).toBeInTheDocument()
    expect(screen.getByText("Morning Workout")).toBeInTheDocument()
    expect(screen.getByText("Family Dinner")).toBeInTheDocument()
    expect(screen.getByText("Meditation Session")).toBeInTheDocument()
  })

  it("should filter entries by search term", async () => {
    const user = userEvent.setup()
    const wrapper = createWrapper()
    render(<ActivitiesTable />, { wrapper })

    const searchInput = screen.getByPlaceholderText(/search entries/i)
    await user.type(searchInput, "work")

    expect(screen.getByText("Great Day at Work")).toBeInTheDocument()
    expect(screen.queryByText("Morning Workout")).not.toBeInTheDocument()
  })

  it("should filter entries by category", async () => {
    const user = userEvent.setup()
    const wrapper = createWrapper()
    render(<ActivitiesTable />, { wrapper })

    // Open category filter
    const categorySelect = screen.getByRole("combobox", { name: /all categories/i })
    await user.click(categorySelect)
    await user.click(screen.getByText("Work"))

    expect(screen.getByText("Great Day at Work")).toBeInTheDocument()
    expect(screen.queryByText("Morning Workout")).not.toBeInTheDocument()
  })

  it("should filter entries by mood", async () => {
    const user = userEvent.setup()
    const wrapper = createWrapper()
    render(<ActivitiesTable />, { wrapper })

    // Open mood filter
    const moodSelect = screen.getByRole("combobox", { name: /all moods/i })
    await user.click(moodSelect)
    await user.click(screen.getByText(/excited/i))

    expect(screen.getByText("Great Day at Work")).toBeInTheDocument()
    expect(screen.queryByText("Morning Workout")).not.toBeInTheDocument()
  })

  it("should delete entry when delete button is clicked", async () => {
    const user = userEvent.setup()
    const wrapper = createWrapper()
    render(<ActivitiesTable />, { wrapper })

    const deleteButtons = screen.getAllByRole("button", { name: /delete/i })
    await user.click(deleteButtons[0])

    await waitFor(() => {
      expect(global.confirm).toHaveBeenCalled()
    })
  })

  it("should show no entries message when filtered results are empty", async () => {
    const user = userEvent.setup()
    const wrapper = createWrapper()
    render(<ActivitiesTable />, { wrapper })

    const searchInput = screen.getByPlaceholderText(/search entries/i)
    await user.type(searchInput, "nonexistent")

    expect(screen.getByText(/no entries found/i)).toBeInTheDocument()
  })

  it("should display mood emojis correctly", () => {
    const wrapper = createWrapper()
    render(<ActivitiesTable />, { wrapper })

    expect(screen.getByText("🎉")).toBeInTheDocument() // excited
    expect(screen.getByText("⚡")).toBeInTheDocument() // energetic
    expect(screen.getByText("🙏")).toBeInTheDocument() // grateful
    expect(screen.getByText("😌")).toBeInTheDocument() // calm
  })

  it("should display tags correctly", () => {
    const wrapper = createWrapper()
    render(<ActivitiesTable />, { wrapper })

    expect(screen.getByText("success")).toBeInTheDocument()
    expect(screen.getByText("presentation")).toBeInTheDocument()
    expect(screen.getByText("teamwork")).toBeInTheDocument()
    expect(screen.getByText("exercise")).toBeInTheDocument()
  })
})
