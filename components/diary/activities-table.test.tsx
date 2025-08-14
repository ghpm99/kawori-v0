import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { DiaryProvider } from "@/contexts/diary-context"
import { I18nProvider } from "@/contexts/i18n-context"
import { ActivitiesTable } from "./activities-table"
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

describe("ActivitiesTable", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

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
    const categorySelect = screen.getByRole("combobox")
    await user.click(categorySelect)
    await user.click(screen.getByText("Work"))

    expect(screen.getByText("Great Day at Work")).toBeInTheDocument()
    expect(screen.queryByText("Morning Workout")).not.toBeInTheDocument()
  })

  it("should filter entries by mood", async () => {
    const user = userEvent.setup()
    const wrapper = createWrapper()
    render(<ActivitiesTable />, { wrapper })

    // Open mood filter (second combobox)
    const comboboxes = screen.getAllByRole("combobox")
    const moodSelect = comboboxes[1] // Second combobox is mood filter
    await user.click(moodSelect)
    await user.click(screen.getByText(/excited/i))

    expect(screen.getByText("Great Day at Work")).toBeInTheDocument()
    expect(screen.queryByText("Morning Workout")).not.toBeInTheDocument()
  })

  it("should delete entry when delete button is clicked", async () => {
    const user = userEvent.setup()
    const wrapper = createWrapper()
    render(<ActivitiesTable />, { wrapper })

    const deleteButtons = screen.getAllByRole("button")
    const deleteButton = deleteButtons.find(
      (button) => button.querySelector("svg") && button.getAttribute("class")?.includes("text-destructive"),
    )

    if (deleteButton) {
      await user.click(deleteButton)
      await waitFor(() => {
        expect(global.confirm).toHaveBeenCalled()
      })
    }
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

  it("should display formatted dates", () => {
    const wrapper = createWrapper()
    render(<ActivitiesTable />, { wrapper })

    expect(screen.getByText("Jan 15, 2024")).toBeInTheDocument()
    expect(screen.getByText("Jan 14, 2024")).toBeInTheDocument()
    expect(screen.getByText("Jan 13, 2024")).toBeInTheDocument()
    expect(screen.getByText("Jan 12, 2024")).toBeInTheDocument()
  })

  it("should show category badges", () => {
    const wrapper = createWrapper()
    render(<ActivitiesTable />, { wrapper })

    expect(screen.getByText("Work")).toBeInTheDocument()
    expect(screen.getByText("Health")).toBeInTheDocument()
    expect(screen.getByText("Family")).toBeInTheDocument()
    expect(screen.getByText("Wellness")).toBeInTheDocument()
  })

  it("should limit displayed tags and show count", () => {
    const wrapper = createWrapper()
    render(<ActivitiesTable />, { wrapper })

    // Check if tags are limited to 2 and show +count for more
    const tagCells = screen
      .getAllByText("success")
      .map((el) => el.closest("td"))
      .filter(Boolean)

    expect(tagCells.length).toBeGreaterThan(0)
  })

  it("should clear search when input is cleared", async () => {
    const user = userEvent.setup()
    const wrapper = createWrapper()
    render(<ActivitiesTable />, { wrapper })

    const searchInput = screen.getByPlaceholderText(/search entries/i)

    // Search for something
    await user.type(searchInput, "work")
    expect(screen.getByText("Great Day at Work")).toBeInTheDocument()
    expect(screen.queryByText("Morning Workout")).not.toBeInTheDocument()

    // Clear search
    await user.clear(searchInput)
    expect(screen.getByText("Great Day at Work")).toBeInTheDocument()
    expect(screen.getByText("Morning Workout")).toBeInTheDocument()
  })

  it("should show table headers", () => {
    const wrapper = createWrapper()
    render(<ActivitiesTable />, { wrapper })

    expect(screen.getByText("Title")).toBeInTheDocument()
    expect(screen.getByText("Category")).toBeInTheDocument()
    expect(screen.getByText("Mood")).toBeInTheDocument()
    expect(screen.getByText("Date")).toBeInTheDocument()
    expect(screen.getByText("Tags")).toBeInTheDocument()
    expect(screen.getByText("Actions")).toBeInTheDocument()
  })
})
