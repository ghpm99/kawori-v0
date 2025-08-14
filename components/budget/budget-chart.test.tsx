import { render, screen } from "@testing-library/react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { BudgetProvider } from "@/contexts/budget-context"
import { I18nProvider } from "@/contexts/i18n-context"
import { BudgetChart } from "./budget-chart"
import type { ReactNode } from "react"
import { jest } from "@jest/globals"

// Mock Recharts
jest.mock("recharts", () => ({
  PieChart: ({ children }: { children: ReactNode }) => <div data-testid="pie-chart">{children}</div>,
  Pie: () => <div data-testid="pie" />,
  Cell: () => <div data-testid="cell" />,
  ResponsiveContainer: ({ children }: { children: ReactNode }) => (
    <div data-testid="responsive-container">{children}</div>
  ),
  Tooltip: () => <div data-testid="tooltip" />,
  Legend: () => <div data-testid="legend" />,
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

describe("BudgetChart", () => {
  it("should render budget chart", () => {
    const wrapper = createWrapper()
    render(<BudgetChart />, { wrapper })

    expect(screen.getByText("Spending by Category")).toBeInTheDocument()
    expect(screen.getByTestId("pie-chart")).toBeInTheDocument()
  })

  it("should display total spent information", () => {
    const wrapper = createWrapper()
    render(<BudgetChart />, { wrapper })

    expect(screen.getByText(/Total spent/)).toBeInTheDocument()
    expect(screen.getByText(/\$2,530/)).toBeInTheDocument()
    expect(screen.getByText(/\$3,250/)).toBeInTheDocument()
  })

  it("should render responsive container", () => {
    const wrapper = createWrapper()
    render(<BudgetChart />, { wrapper })

    expect(screen.getByTestId("responsive-container")).toBeInTheDocument()
  })

  it("should render pie chart components", () => {
    const wrapper = createWrapper()
    render(<BudgetChart />, { wrapper })

    expect(screen.getByTestId("pie")).toBeInTheDocument()
    expect(screen.getByTestId("tooltip")).toBeInTheDocument()
    expect(screen.getByTestId("legend")).toBeInTheDocument()
  })

  it("should calculate overall progress correctly", () => {
    const wrapper = createWrapper()
    render(<BudgetChart />, { wrapper })

    // 2530 / 3250 = 77.8% rounded to 78%
    expect(screen.getByText(/78%/)).toBeInTheDocument()
  })

  it("should have proper card structure", () => {
    const wrapper = createWrapper()
    render(<BudgetChart />, { wrapper })

    const card = screen.getByText("Spending by Category").closest(".card")
    expect(card).toBeInTheDocument()
  })

  it("should display chart with correct height", () => {
    const wrapper = createWrapper()
    render(<BudgetChart />, { wrapper })

    const chartContainer = screen.getByTestId("responsive-container").parentElement
    expect(chartContainer).toHaveClass("h-[300px]")
  })
})
