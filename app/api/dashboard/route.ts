import { NextResponse } from "next/server"

const dashboardData = {
  accounts: [
    { name: "Checking", balance: 7500 },
    { name: "Savings", balance: 560000 },
    { name: "Investment", balance: 5879000 },
  ],
  transactions: [
    {
      id: "1",
      description: "Salary Payment",
      amount: 5000,
      date: "2024-01-15",
      type: "income",
      category: "Salary",
    },
    {
      id: "2",
      description: "Grocery Shopping",
      amount: -150,
      date: "2024-01-14",
      type: "expense",
      category: "Food",
    },
    {
      id: "3",
      description: "Freelance Project",
      amount: 1200,
      date: "2024-01-13",
      type: "income",
      category: "Freelance",
    },
  ],
  bills: [
    { id: 1, name: "Electricity Bill", amount: 85, dueDate: "2023-07-15" },
    { id: 2, name: "Internet Service", amount: 60, dueDate: "2023-07-18" },
    { id: 3, name: "Credit Card Payment", amount: 500, dueDate: "2023-07-25" },
    { id: 4, name: "Water Bill", amount: 45, dueDate: "2023-07-30" },
  ],
  metrics: [
    {
      title: "Total Revenue",
      value: "$1,234,567",
      icon: "DollarSign",
      change: "+12.3%",
      description: "Overall earnings this quarter",
    },
    {
      title: "Active Users",
      value: "45,678",
      icon: "Users",
      change: "+5.7%",
      description: "Users engaged in the last 30 days",
    },
    {
      title: "New Accounts",
      value: "1,234",
      icon: "CreditCard",
      change: "+3.2%",
      description: "Fresh sign-ups this month",
    },
    {
      title: "Growth Rate",
      value: "8.9%",
      icon: "TrendingUp",
      change: "+1.5%",
      description: "Year-over-year expansion",
    },
  ],
}

export async function GET() {
  return NextResponse.json(dashboardData)
}
