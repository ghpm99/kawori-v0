import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { BudgetProvider } from "@/contexts/budget-context"
import { I18nProvider } from "@/contexts/i18n-context"
import BudgetPage from "@/app/budget/page"
import type { ReactNode } from "react"
import jest from "jest" // Import jest to fix the undeclared variable error

// Mock chart components
jest.mock("recharts", () => ({
  PieChart: ({ children }: { children: ReactNode }) => <div data-testid="pie-chart">{children}</div>,
  Pie: () => <div data-testid="pie" />,
  Cell: () => <div data-testid="cell" />,
  ResponsiveContainer: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  Tooltip: () => <div data-testid="tooltip" />,
}))

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

describe("Budget Flow Integration", () => {
  it("should complete full budget management flow", async () => {
    const user = userEvent.setup()
    const wrapper = createWrapper()
    render(<BudgetPage />, { wrapper })

    // Verify initial state
    expect(screen.getByText("Budget")).toBeInTheDocument()
    expect(screen.getByText("Housing")).toBeInTheDocument()
    expect(screen.getByText("$1,200")).toBeInTheDocument()

    // Check if month/year selector works
    const monthSelector = screen.getByDisplayValue(
      /january|february|march|april|may|june|july|august|september|october|november|december/i,
    )
    expect(monthSelector).toBeInTheDocument()

    // Verify chart is rendered
    expect(screen.getByTestId("pie-chart")).toBeInTheDocument()

    // Check budget summary table
    expect(screen.getByText("Budget Summary")).toBeInTheDocument()
    expect(screen.getByText("Category")).toBeInTheDocument()
    expect(screen.getByText("Budgeted")).toBeInTheDocument()
    expect(screen.getByText("Spent")).toBeInTheDocument()

    // Verify goals sidebar
    expect(screen.getByText("Financial Goals")).toBeInTheDocument()
    expect(screen.getByText("Emergency Fund")).toBeInTheDocument()

    // Check cost editor
    expect(screen.getByText("Add Expense")).toBeInTheDocument()
  })

  it("should handle month/year changes", async () => {
    const user = userEvent.setup()
    const wrapper = createWrapper()
    render(<BudgetPage />, { wrapper })

    // Change month
    const monthSelector = screen.getByRole("combobox", { name: /month/i })
    await user.click(monthSelector)
    await user.click(screen.getByText("March"))

    // Change year
    const yearSelector = screen.getByRole("combobox", { name: /year/i })
    await user.click(yearSelector)
    await user.click(screen.getByText("2025"))

    // Verify changes are reflected
    await waitFor(() => {
      expect(screen.getByDisplayValue("March")).toBeInTheDocument()
      expect(screen.getByDisplayValue("2025")).toBeInTheDocument()
    })
  })
})
