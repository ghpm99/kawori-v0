import { NextResponse } from "next/server"

// Mock data for budget
let budgetData = {
  totalIncome: 8500,
  totalExpenses: 6200,
  totalBudget: 7000,
  categories: [
    {
      id: "1",
      name: "Housing",
      budgeted: 2500,
      spent: 2400,
      remaining: 100,
      color: "#3b82f6",
      icon: "home",
      type: "expense" as const,
    },
    {
      id: "2",
      name: "Food",
      budgeted: 800,
      spent: 750,
      remaining: 50,
      color: "#10b981",
      icon: "utensils",
      type: "expense" as const,
    },
    {
      id: "3",
      name: "Transportation",
      budgeted: 600,
      spent: 580,
      remaining: 20,
      color: "#f59e0b",
      icon: "car",
      type: "expense" as const,
    },
    {
      id: "4",
      name: "Entertainment",
      budgeted: 400,
      spent: 320,
      remaining: 80,
      color: "#8b5cf6",
      icon: "gamepad-2",
      type: "expense" as const,
    },
    {
      id: "5",
      name: "Salary",
      budgeted: 7000,
      spent: 7000,
      remaining: 0,
      color: "#06b6d4",
      icon: "dollar-sign",
      type: "income" as const,
    },
    {
      id: "6",
      name: "Freelance",
      budgeted: 1500,
      spent: 1500,
      remaining: 0,
      color: "#84cc16",
      icon: "briefcase",
      type: "income" as const,
    },
  ],
  goals: [
    {
      id: "1",
      title: "Emergency Fund",
      targetAmount: 10000,
      currentAmount: 6500,
      deadline: "2024-12-31",
      category: "savings",
      priority: "high" as const,
    },
    {
      id: "2",
      title: "Vacation",
      targetAmount: 3000,
      currentAmount: 1200,
      deadline: "2024-08-15",
      category: "travel",
      priority: "medium" as const,
    },
    {
      id: "3",
      title: "New Laptop",
      targetAmount: 2500,
      currentAmount: 800,
      deadline: "2024-06-30",
      category: "technology",
      priority: "low" as const,
    },
  ],
  monthlyData: [
    { month: "Jan", income: 8000, expenses: 5800, savings: 2200 },
    { month: "Feb", income: 8200, expenses: 6000, savings: 2200 },
    { month: "Mar", income: 8500, expenses: 6200, savings: 2300 },
    { month: "Apr", income: 8300, expenses: 5900, savings: 2400 },
    { month: "May", income: 8600, expenses: 6100, savings: 2500 },
    { month: "Jun", income: 8500, expenses: 6200, savings: 2300 },
  ],
}

export async function GET() {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  return NextResponse.json(budgetData)
}

export async function PUT(request: Request) {
  const body = await request.json()

  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  // Update budget data
  budgetData = {
    ...budgetData,
    ...body,
  }

  return NextResponse.json(budgetData)
}
