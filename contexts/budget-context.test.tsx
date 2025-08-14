import { renderHook, act } from "@testing-library/react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { BudgetProvider, useBudget } from "./budget-context"
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

describe("BudgetContext", () => {
  it("should provide initial budget data", () => {
    const wrapper = createWrapper()
    const { result } = renderHook(() => useBudget(), { wrapper })

    expect(result.current.categories).toHaveLength(6)
    expect(result.current.goals).toHaveLength(3)
    expect(result.current.salary).toBe(5000)
    expect(result.current.selectedMonth).toBe(new Date().getMonth())
    expect(result.current.selectedYear).toBe(new Date().getFullYear())
  })

  it("should calculate total budgeted correctly", () => {
    const wrapper = createWrapper()
    const { result } = renderHook(() => useBudget(), { wrapper })

    const totalBudgeted = result.current.getTotalBudgeted()
    expect(totalBudgeted).toBe(3250) // Sum of all category budgets
  })

  it("should calculate total spent correctly", () => {
    const wrapper = createWrapper()
    const { result } = renderHook(() => useBudget(), { wrapper })

    const totalSpent = result.current.getTotalSpent()
    expect(totalSpent).toBe(2530) // Sum of all category spent amounts
  })

  it("should calculate remaining budget correctly", () => {
    const wrapper = createWrapper()
    const { result } = renderHook(() => useBudget(), { wrapper })

    const remaining = result.current.getRemainingBudget()
    expect(remaining).toBe(2470) // 5000 - 2530
  })

  it("should get monthly stats correctly", () => {
    const wrapper = createWrapper()
    const { result } = renderHook(() => useBudget(), { wrapper })

    const stats = result.current.getMonthlyStats()
    expect(stats.income).toBe(5000)
    expect(stats.expenses).toBe(2530)
    expect(stats.savings).toBe(2470)
    expect(stats.savingsRate).toBeCloseTo(49.4)
  })

  it("should update selected month and year", () => {
    const wrapper = createWrapper()
    const { result } = renderHook(() => useBudget(), { wrapper })

    act(() => {
      result.current.setSelectedMonth(5)
      result.current.setSelectedYear(2025)
    })

    expect(result.current.selectedMonth).toBe(5)
    expect(result.current.selectedYear).toBe(2025)
  })

  it("should get budget health status", () => {
    const wrapper = createWrapper()
    const { result } = renderHook(() => useBudget(), { wrapper })

    const health = result.current.getBudgetHealth()
    expect(health).toBe("good") // 2530/5000 = 50.6% which is <= 70%
  })

  it("should get category progress", () => {
    const wrapper = createWrapper()
    const { result } = renderHook(() => useBudget(), { wrapper })

    const progress = result.current.getCategoryProgress("1") // Housing: 1200/1500 = 80%
    expect(progress).toBe(80)
  })

  it("should get goal progress", () => {
    const wrapper = createWrapper()
    const { result } = renderHook(() => useBudget(), { wrapper })

    const progress = result.current.getGoalProgress("1") // Emergency Fund: 6500/10000 = 65%
    expect(progress).toBe(65)
  })

  it("should add new category", async () => {
    const wrapper = createWrapper()
    const { result } = renderHook(() => useBudget(), { wrapper })

    const newCategory = {
      name: "Test Category",
      budgeted: 500,
      spent: 0,
      color: "#ff0000",
    }

    await act(async () => {
      await result.current.addCategory(newCategory)
    })

    expect(result.current.categories).toHaveLength(7)
    expect(result.current.categories.find((cat) => cat.name === "Test Category")).toBeDefined()
  })

  it("should update category", async () => {
    const wrapper = createWrapper()
    const { result } = renderHook(() => useBudget(), { wrapper })

    await act(async () => {
      await result.current.updateCategory("1", { budgeted: 2000 })
    })

    const updatedCategory = result.current.categories.find((cat) => cat.id === "1")
    expect(updatedCategory?.budgeted).toBe(2000)
  })

  it("should delete category", async () => {
    const wrapper = createWrapper()
    const { result } = renderHook(() => useBudget(), { wrapper })

    await act(async () => {
      await result.current.deleteCategory("1")
    })

    expect(result.current.categories).toHaveLength(5)
    expect(result.current.categories.find((cat) => cat.id === "1")).toBeUndefined()
  })

  it("should add new goal", async () => {
    const wrapper = createWrapper()
    const { result } = renderHook(() => useBudget(), { wrapper })

    const newGoal = {
      name: "Test Goal",
      target: 1000,
      current: 0,
      deadline: "2024-12-31",
    }

    await act(async () => {
      await result.current.addGoal(newGoal)
    })

    expect(result.current.goals).toHaveLength(4)
    expect(result.current.goals.find((goal) => goal.name === "Test Goal")).toBeDefined()
  })

  it("should update goal", async () => {
    const wrapper = createWrapper()
    const { result } = renderHook(() => useBudget(), { wrapper })

    await act(async () => {
      await result.current.updateGoal("1", { current: 7000 })
    })

    const updatedGoal = result.current.goals.find((goal) => goal.id === "1")
    expect(updatedGoal?.current).toBe(7000)
  })

  it("should delete goal", async () => {
    const wrapper = createWrapper()
    const { result } = renderHook(() => useBudget(), { wrapper })

    await act(async () => {
      await result.current.deleteGoal("1")
    })

    expect(result.current.goals).toHaveLength(2)
    expect(result.current.goals.find((goal) => goal.id === "1")).toBeUndefined()
  })
})
