import { render, screen } from "@testing-library/react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { BudgetProvider } from "@/contexts/budget-context"
import { BudgetChart } from "@/components/budget/budget-chart"
import type { ReactNode } from "react"
import jest from "jest" // Import jest to fix the undeclared variable error

// Mock Recharts
jest.mock("recharts", () => ({
  PieChart: ({ children }: { children: ReactNode }) => <div data-testid="pie-chart">{children}</div>,
  Pie: () => <div data-testid="pie" />,
  Cell: () => <div data-testid="cell" />,
  ResponsiveContainer: ({ children }: { children: ReactNode }) => (
    <div data-testid="responsive-container">{children}</div>
  ),
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
      <BudgetProvider>{children}</BudgetProvider>
    </QueryClientProvider>
  )
}

describe("BudgetChart", () => {
  it("should render budget chart", () => {
    const wrapper = createWrapper()
    render(<BudgetChart />, { wrapper })

    expect(screen.getByText("Expenses by Category")).toBeInTheDocument()
    expect(screen.getByTestId("pie-chart")).toBeInTheDocument()
  })

  it("should display category legend", () => {
    const wrapper = createWrapper()
    render(<BudgetChart />, { wrapper })

    expect(screen.getByText("Housing")).toBeInTheDocument()
    expect(screen.getByText("Food")).toBeInTheDocument()
    expect(screen.getByText("Transportation")).toBeInTheDocument()
    expect(screen.getByText("Entertainment")).toBeInTheDocument()
  })

  it("should show spent amounts", () => {
    const wrapper = createWrapper()
    render(<BudgetChart />, { wrapper })

    expect(screen.getByText("$1,200")).toBeInTheDocument() // Housing spent
    expect(screen.getByText("$450")).toBeInTheDocument() // Food spent
    expect(screen.getByText("$320")).toBeInTheDocument() // Transportation spent
    expect(screen.getByText("$180")).toBeInTheDocument() // Entertainment spent
  })
})
