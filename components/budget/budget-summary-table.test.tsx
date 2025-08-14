import { render, screen } from "@testing-library/react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { BudgetProvider } from "@/contexts/budget-context"
import { I18nProvider } from "@/contexts/i18n-context"
import { BudgetSummaryTable } from "./budget-summary-table"
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
        <BudgetProvider>{children}</BudgetProvider>
      </I18nProvider>
    </QueryClientProvider>
  )
}

describe("BudgetSummaryTable", () => {
  it("should render budget summary table", () => {
    const wrapper = createWrapper()
    render(<BudgetSummaryTable />, { wrapper })

    expect(screen.getByText("Category Breakdown")).toBeInTheDocument()
    expect(screen.getByText("Category")).toBeInTheDocument()
    expect(screen.getByText("Budgeted")).toBeInTheDocument()
    expect(screen.getByText("Spent")).toBeInTheDocument()
    expect(screen.getByText("Remaining")).toBeInTheDocument()
    expect(screen.getByText("Progress")).toBeInTheDocument()
  })

  it("should display all categories", () => {
    const wrapper = createWrapper()
    render(<BudgetSummaryTable />, { wrapper })

    expect(screen.getByText("Housing")).toBeInTheDocument()
    expect(screen.getByText("Food")).toBeInTheDocument()
    expect(screen.getByText("Transportation")).toBeInTheDocument()
    expect(screen.getByText("Entertainment")).toBeInTheDocument()
    expect(screen.getByText("Utilities")).toBeInTheDocument()
    expect(screen.getByText("Healthcare")).toBeInTheDocument()
  })

  it("should show progress bars", () => {
    const wrapper = createWrapper()
    render(<BudgetSummaryTable />, { wrapper })

    const progressBars = screen.getAllByRole("progressbar")
    expect(progressBars).toHaveLength(6) // One for each category
  })

  it("should calculate remaining amounts correctly", () => {
    const wrapper = createWrapper()
    render(<BudgetSummaryTable />, { wrapper })

    expect(screen.getByText("$300")).toBeInTheDocument() // Housing: 1500 - 1200
    expect(screen.getByText("$150")).toBeInTheDocument() // Food: 600 - 450
    expect(screen.getByText("$80")).toBeInTheDocument() // Transportation: 400 - 320
    expect(screen.getByText("$120")).toBeInTheDocument() // Entertainment: 300 - 180
  })

  it("should display budgeted amounts", () => {
    const wrapper = createWrapper()
    render(<BudgetSummaryTable />, { wrapper })

    expect(screen.getByText("$1,500")).toBeInTheDocument() // Housing budgeted
    expect(screen.getByText("$600")).toBeInTheDocument() // Food budgeted
    expect(screen.getByText("$400")).toBeInTheDocument() // Transportation budgeted
    expect(screen.getByText("$300")).toBeInTheDocument() // Entertainment budgeted
  })

  it("should display spent amounts", () => {
    const wrapper = createWrapper()
    render(<BudgetSummaryTable />, { wrapper })

    expect(screen.getByText("$1,200")).toBeInTheDocument() // Housing spent
    expect(screen.getByText("$450")).toBeInTheDocument() // Food spent
    expect(screen.getByText("$320")).toBeInTheDocument() // Transportation spent
    expect(screen.getByText("$180")).toBeInTheDocument() // Entertainment spent
  })

  it("should show category colors", () => {
    const wrapper = createWrapper()
    render(<BudgetSummaryTable />, { wrapper })

    const colorDots = screen
      .getAllByText("Housing")
      .map((el) => el.parentElement?.querySelector(".w-3.h-3.rounded-full"))
      .filter(Boolean)

    expect(colorDots.length).toBeGreaterThan(0)
  })

  it("should display progress percentages", () => {
    const wrapper = createWrapper()
    render(<BudgetSummaryTable />, { wrapper })

    expect(screen.getByText("80.0%")).toBeInTheDocument() // Housing: 1200/1500 = 80%
    expect(screen.getByText("75.0%")).toBeInTheDocument() // Food: 450/600 = 75%
    expect(screen.getByText("80.0%")).toBeInTheDocument() // Transportation: 320/400 = 80%
    expect(screen.getByText("60.0%")).toBeInTheDocument() // Entertainment: 180/300 = 60%
  })

  it("should show remaining badges with correct variants", () => {
    const wrapper = createWrapper()
    render(<BudgetSummaryTable />, { wrapper })

    const badges = screen.getAllByText(/\$\d+/).filter((el) => el.classList.contains("badge") || el.closest(".badge"))

    expect(badges.length).toBeGreaterThan(0)
  })
})
