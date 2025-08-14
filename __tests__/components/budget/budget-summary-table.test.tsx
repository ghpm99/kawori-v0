import { render, screen } from "@testing-library/react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { BudgetProvider } from "@/contexts/budget-context"
import { BudgetSummaryTable } from "@/components/budget/budget-summary-table"
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
      <BudgetProvider>{children}</BudgetProvider>
    </QueryClientProvider>
  )
}

describe("BudgetSummaryTable", () => {
  it("should render budget summary table", () => {
    const wrapper = createWrapper()
    render(<BudgetSummaryTable />, { wrapper })

    expect(screen.getByText("Budget Summary")).toBeInTheDocument()
    expect(screen.getByText("Category")).toBeInTheDocument()
    expect(screen.getByText("Budgeted")).toBeInTheDocument()
    expect(screen.getByText("Spent")).toBeInTheDocument()
    expect(screen.getByText("Remaining")).toBeInTheDocument()
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
})
