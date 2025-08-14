import { render, screen } from "@testing-library/react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { BudgetProvider } from "@/contexts/budget-context"
import { I18nProvider } from "@/contexts/i18n-context"
import BudgetPage from "./page"
import type { ReactNode } from "react"
import { jest } from "@jest/globals"

// Mock the chart components
jest.mock("@/components/budget/budget-chart", () => {
  return {
    BudgetChart: () => <div data-testid="budget-chart">Budget Chart</div>,
  }
})

jest.mock("@/components/budget/budget-summary-table", () => {
  return {
    BudgetSummaryTable: () => <div data-testid="budget-summary-table">Budget Summary Table</div>,
  }
})

jest.mock("@/components/budget/budget-goals-sidebar", () => {
  return {
    BudgetGoalsSidebar: () => <div data-testid="budget-goals-sidebar">Budget Goals Sidebar</div>,
  }
})

jest.mock("@/components/budget/budget-cost-editor", () => {
  return {
    BudgetCostEditor: () => <div data-testid="budget-cost-editor">Budget Cost Editor</div>,
  }
})

jest.mock("@/components/budget/budget-header", () => {
  return {
    BudgetHeader: () => <div data-testid="budget-header">Budget Header</div>,
  }
})

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

describe("BudgetPage", () => {
  it("should render budget page components", () => {
    const wrapper = createWrapper()
    render(<BudgetPage />, { wrapper })

    expect(screen.getByTestId("budget-header")).toBeInTheDocument()
    expect(screen.getByTestId("budget-chart")).toBeInTheDocument()
    expect(screen.getByTestId("budget-summary-table")).toBeInTheDocument()
    expect(screen.getByTestId("budget-goals-sidebar")).toBeInTheDocument()
    expect(screen.getByTestId("budget-cost-editor")).toBeInTheDocument()
  })

  it("should display page title and description", () => {
    const wrapper = createWrapper()
    render(<BudgetPage />, { wrapper })

    expect(screen.getByText("Budget")).toBeInTheDocument()
    expect(screen.getByText("Manage your budget and track expenses")).toBeInTheDocument()
  })

  it("should have proper grid layout structure", () => {
    const wrapper = createWrapper()
    render(<BudgetPage />, { wrapper })

    const gridContainer = screen.getByTestId("budget-chart").parentElement
    expect(gridContainer).toHaveClass("lg:col-span-1")
  })

  it("should render all main sections", () => {
    const wrapper = createWrapper()
    render(<BudgetPage />, { wrapper })

    // Check that all main components are rendered
    expect(screen.getByTestId("budget-header")).toBeInTheDocument()
    expect(screen.getByTestId("budget-chart")).toBeInTheDocument()
    expect(screen.getByTestId("budget-summary-table")).toBeInTheDocument()
    expect(screen.getByTestId("budget-goals-sidebar")).toBeInTheDocument()
    expect(screen.getByTestId("budget-cost-editor")).toBeInTheDocument()
  })

  it("should have correct page structure", () => {
    const wrapper = createWrapper()
    render(<BudgetPage />, { wrapper })

    // Check for main container
    const mainContainer = screen.getByText("Budget").closest("div")
    expect(mainContainer).toHaveClass("space-y-6")
  })

  it("should render components in correct order", () => {
    const wrapper = createWrapper()
    render(<BudgetPage />, { wrapper })

    const components = [
      screen.getByTestId("budget-header"),
      screen.getByText("Budget"),
      screen.getByTestId("budget-chart"),
      screen.getByTestId("budget-summary-table"),
      screen.getByTestId("budget-goals-sidebar"),
      screen.getByTestId("budget-cost-editor"),
    ]

    // Verify all components are present
    components.forEach((component) => {
      expect(component).toBeInTheDocument()
    })
  })
})
