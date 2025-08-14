"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

export interface BudgetCategory {
  id: string
  name: string
  budgeted: number
  spent: number
  color: string
}

export interface BudgetGoal {
  id: string
  name: string
  target: number
  current: number
  deadline: string
}

export interface BudgetExpense {
  id: string
  categoryId: string
  name: string
  amount: number
  date: string
  description?: string
}

interface BudgetContextType {
  // State
  categories: BudgetCategory[]
  goals: BudgetGoal[]
  expenses: BudgetExpense[]
  salary: number
  selectedMonth: number
  selectedYear: number
  loading: boolean
  error: string | null

  // Actions
  setSalary: (amount: number) => Promise<void>
  setSelectedMonth: (month: number) => void
  setSelectedYear: (year: number) => void
  addCategory: (category: Omit<BudgetCategory, "id">) => Promise<void>
  updateCategory: (id: string, updates: Partial<BudgetCategory>) => Promise<void>
  deleteCategory: (id: string) => Promise<void>
  addGoal: (goal: Omit<BudgetGoal, "id">) => Promise<void>
  updateGoal: (id: string, updates: Partial<BudgetGoal>) => Promise<void>
  deleteGoal: (id: string) => Promise<void>
  addExpense: (expense: Omit<BudgetExpense, "id">) => Promise<void>
  updateExpense: (id: string, updates: Partial<BudgetExpense>) => Promise<void>
  deleteExpense: (id: string) => Promise<void>

  // Computed values
  getTotalBudgeted: () => number
  getTotalSpent: () => number
  getRemainingBudget: () => number
  getCategoryProgress: (categoryId: string) => number
  getGoalProgress: (goalId: string) => number
  getBudgetHealth: () => "good" | "warning" | "danger"
  getMonthlyStats: () => {
    income: number
    expenses: number
    savings: number
    savingsRate: number
  }
}

const BudgetContext = createContext<BudgetContextType | undefined>(undefined)

export function useBudget() {
  const context = useContext(BudgetContext)
  if (context === undefined) {
    throw new Error("useBudget must be used within a BudgetProvider")
  }
  return context
}

export function BudgetProvider({ children }: { children: ReactNode }) {
  const [categories, setCategories] = useState<BudgetCategory[]>([])
  const [goals, setGoals] = useState<BudgetGoal[]>([])
  const [expenses, setExpenses] = useState<BudgetExpense[]>([])
  const [salary, setSalaryState] = useState(5000)
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth())
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Initialize with mock data
  useEffect(() => {
    const mockCategories: BudgetCategory[] = [
      {
        id: "1",
        name: "Housing",
        budgeted: 1500,
        spent: 1200,
        color: "#3b82f6",
      },
      {
        id: "2",
        name: "Food",
        budgeted: 600,
        spent: 450,
        color: "#10b981",
      },
      {
        id: "3",
        name: "Transportation",
        budgeted: 400,
        spent: 320,
        color: "#f59e0b",
      },
      {
        id: "4",
        name: "Entertainment",
        budgeted: 300,
        spent: 180,
        color: "#ef4444",
      },
      {
        id: "5",
        name: "Utilities",
        budgeted: 250,
        spent: 230,
        color: "#8b5cf6",
      },
      {
        id: "6",
        name: "Healthcare",
        budgeted: 200,
        spent: 150,
        color: "#06b6d4",
      },
    ]

    const mockGoals: BudgetGoal[] = [
      {
        id: "1",
        name: "Emergency Fund",
        target: 10000,
        current: 6500,
        deadline: "2024-12-31",
      },
      {
        id: "2",
        name: "Vacation",
        target: 3000,
        current: 1200,
        deadline: "2024-08-15",
      },
      {
        id: "3",
        name: "New Car",
        target: 25000,
        current: 8500,
        deadline: "2025-06-30",
      },
    ]

    setCategories(mockCategories)
    setGoals(mockGoals)
  }, [])

  const setSalary = async (amount: number) => {
    try {
      setSalaryState(amount)
      // Here you would normally make an API call
      // await api.budget.updateSalary(amount)
    } catch (err) {
      setError("Failed to update salary")
      throw err
    }
  }

  const addCategory = async (categoryData: Omit<BudgetCategory, "id">) => {
    try {
      const newCategory = {
        ...categoryData,
        id: Date.now().toString(),
      }
      setCategories((prev) => [...prev, newCategory])
    } catch (err) {
      setError("Failed to add category")
      throw err
    }
  }

  const updateCategory = async (id: string, updates: Partial<BudgetCategory>) => {
    try {
      setCategories((prev) => prev.map((cat) => (cat.id === id ? { ...cat, ...updates } : cat)))
    } catch (err) {
      setError("Failed to update category")
      throw err
    }
  }

  const deleteCategory = async (id: string) => {
    try {
      setCategories((prev) => prev.filter((cat) => cat.id !== id))
    } catch (err) {
      setError("Failed to delete category")
      throw err
    }
  }

  const addGoal = async (goalData: Omit<BudgetGoal, "id">) => {
    try {
      const newGoal = {
        ...goalData,
        id: Date.now().toString(),
      }
      setGoals((prev) => [...prev, newGoal])
    } catch (err) {
      setError("Failed to add goal")
      throw err
    }
  }

  const updateGoal = async (id: string, updates: Partial<BudgetGoal>) => {
    try {
      setGoals((prev) => prev.map((goal) => (goal.id === id ? { ...goal, ...updates } : goal)))
    } catch (err) {
      setError("Failed to update goal")
      throw err
    }
  }

  const deleteGoal = async (id: string) => {
    try {
      setGoals((prev) => prev.filter((goal) => goal.id !== id))
    } catch (err) {
      setError("Failed to delete goal")
      throw err
    }
  }

  const addExpense = async (expenseData: Omit<BudgetExpense, "id">) => {
    try {
      const newExpense = {
        ...expenseData,
        id: Date.now().toString(),
      }
      setExpenses((prev) => [...prev, newExpense])

      // Update category spent amount
      const category = categories.find((cat) => cat.id === expenseData.categoryId)
      if (category) {
        await updateCategory(category.id, { spent: category.spent + expenseData.amount })
      }
    } catch (err) {
      setError("Failed to add expense")
      throw err
    }
  }

  const updateExpense = async (id: string, updates: Partial<BudgetExpense>) => {
    try {
      setExpenses((prev) => prev.map((exp) => (exp.id === id ? { ...exp, ...updates } : exp)))
    } catch (err) {
      setError("Failed to update expense")
      throw err
    }
  }

  const deleteExpense = async (id: string) => {
    try {
      const expense = expenses.find((exp) => exp.id === id)
      setExpenses((prev) => prev.filter((exp) => exp.id !== id))

      // Update category spent amount
      if (expense) {
        const category = categories.find((cat) => cat.id === expense.categoryId)
        if (category) {
          await updateCategory(category.id, { spent: Math.max(0, category.spent - expense.amount) })
        }
      }
    } catch (err) {
      setError("Failed to delete expense")
      throw err
    }
  }

  const getTotalBudgeted = () => {
    return categories.reduce((total, category) => total + category.budgeted, 0)
  }

  const getTotalSpent = () => {
    return categories.reduce((total, category) => total + category.spent, 0)
  }

  const getRemainingBudget = () => {
    return salary - getTotalSpent()
  }

  const getCategoryProgress = (categoryId: string) => {
    const category = categories.find((cat) => cat.id === categoryId)
    if (!category || category.budgeted === 0) return 0
    return Math.min((category.spent / category.budgeted) * 100, 100)
  }

  const getGoalProgress = (goalId: string) => {
    const goal = goals.find((g) => g.id === goalId)
    if (!goal || goal.target === 0) return 0
    return Math.min((goal.current / goal.target) * 100, 100)
  }

  const getBudgetHealth = (): "good" | "warning" | "danger" => {
    const spentPercentage = (getTotalSpent() / salary) * 100
    if (spentPercentage <= 70) return "good"
    if (spentPercentage <= 90) return "warning"
    return "danger"
  }

  const getMonthlyStats = () => {
    const totalSpent = getTotalSpent()
    const savings = salary - totalSpent
    const savingsRate = salary > 0 ? (savings / salary) * 100 : 0

    return {
      income: salary,
      expenses: totalSpent,
      savings,
      savingsRate,
    }
  }

  const value: BudgetContextType = {
    categories,
    goals,
    expenses,
    salary,
    selectedMonth,
    selectedYear,
    loading,
    error,
    setSalary,
    setSelectedMonth,
    setSelectedYear,
    addCategory,
    updateCategory,
    deleteCategory,
    addGoal,
    updateGoal,
    deleteGoal,
    addExpense,
    updateExpense,
    deleteExpense,
    getTotalBudgeted,
    getTotalSpent,
    getRemainingBudget,
    getCategoryProgress,
    getGoalProgress,
    getBudgetHealth,
    getMonthlyStats,
  }

  return <BudgetContext.Provider value={value}>{children}</BudgetContext.Provider>
}
