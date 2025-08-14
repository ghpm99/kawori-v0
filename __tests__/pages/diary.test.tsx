import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { DiaryProvider } from "@/contexts/diary-context"
import { I18nProvider } from "@/contexts/i18n-context"
import DiaryPage from "@/app/diary/page"
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

    // Hide form
    const cancelButton = screen.getByRole("button", { name: /cancel/i })
    await user.click(cancelButton)

    expect(screen.queryByText("Add New Entry")).not.toBeInTheDocument()
  })

  it("should show edit form when edit button is clicked", async () => {
    const user = userEvent.setup()
    const wrapper = createWrapper()
    render(<DiaryPage />, { wrapper })

    const editButtons = screen.getAllByRole("button", { name: /edit/i })
    await user.click(editButtons[0])

    expect(screen.getByText("Add New Entry")).toBeInTheDocument()
    expect(screen.getByDisplayValue("Great Day at Work")).toBeInTheDocument()
  })
})
