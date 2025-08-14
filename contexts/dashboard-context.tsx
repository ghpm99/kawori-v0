"use client"

import { createContext, useContext, useState, type ReactNode } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { api } from "@/lib/api"

export interface Account {
  name: string
  balance: number
}

export interface Transaction {
  id: string
  description: string
  amount: number
  date: string
  type: "income" | "expense"
  category: string
}

export interface Bill {
  id: number
  name: string
  amount: number
  dueDate: string
}

export interface Metric {
  title: string
  value: string
  icon: string
  change: string
  description: string
}

export interface CarouselState {
  currentIndex: number
  isAnimating: boolean
  cardWidth: number
}

interface DashboardData {
  accounts: Account[]
  transactions: Transaction[]
  bills: Bill[]
  metrics: Metric[]
}

interface DashboardContextType {
  // Data
  dashboardData: DashboardData | undefined
  isLoadingDashboard: boolean
  accounts: Account[]
  transactions: Transaction[]
  recentTransactions: Transaction[]
  bills: Bill[]
  metrics: Metric[]

  // Actions
  getTotalBalance: () => number
  updateAccountBalance: (accountName: string, amount: number) => void
  addTransaction: (transaction: Omit<Transaction, "id">) => void
  payBill: (billId: number) => void

  // Carousel state and actions
  carouselState: CarouselState
  nextSlide: () => void
  prevSlide: () => void
  setIsAnimating: (animating: boolean) => void

  // Modal states
  modalStates: {
    addMoney: boolean
    sendMoney: boolean
    requestMoney: boolean
    selectedBill: Bill | null
  }
  setModalState: (modal: keyof DashboardContextType["modalStates"], state: any) => void
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined)

export function DashboardProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient()

  // Query for dashboard data
  const { data: dashboardData, isLoading: isLoadingDashboard } = useQuery({
    queryKey: ["dashboard"],
    queryFn: api.getDashboardData,
  })

  // Local UI state
  const [carouselState, setCarouselState] = useState<CarouselState>({
    currentIndex: 0,
    isAnimating: false,
    cardWidth: 100 / 3.5,
  })

  const [modalStates, setModalStatesState] = useState({
    addMoney: false,
    sendMoney: false,
    requestMoney: false,
    selectedBill: null as Bill | null,
  })

  // Extract data with fallbacks
  const accounts = dashboardData?.accounts || []
  const transactions = dashboardData?.transactions || []
  const bills = dashboardData?.bills || []
  const metrics = dashboardData?.metrics || []
  const recentTransactions = transactions.slice(0, 5)

  // Mutations
  const updateAccountMutation = useMutation({
    mutationFn: ({ accountName, amount }: { accountName: string; amount: number }) =>
      api.updateAccount(accountName, amount),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dashboard"] })
    },
  })

  // Action functions
  const getTotalBalance = (): number => {
    return accounts.reduce((sum, account) => sum + account.balance, 0)
  }

  const updateAccountBalance = (accountName: string, amount: number) => {
    updateAccountMutation.mutate({ accountName, amount })
  }

  const addTransaction = (transactionData: Omit<Transaction, "id">) => {
    // In a real app, this would be an API call
    console.log("Adding transaction:", transactionData)
  }

  const payBill = (billId: number) => {
    // In a real app, this would be an API call
    console.log("Paying bill:", billId)
  }

  // Carousel actions
  const nextSlide = () => {
    if (!carouselState.isAnimating && metrics.length > 0) {
      setCarouselState((prev) => ({
        ...prev,
        isAnimating: true,
        currentIndex: (prev.currentIndex + 1) % metrics.length,
      }))

      setTimeout(() => {
        setCarouselState((prev) => ({ ...prev, isAnimating: false }))
      }, 300)
    }
  }

  const prevSlide = () => {
    if (!carouselState.isAnimating && metrics.length > 0) {
      setCarouselState((prev) => ({
        ...prev,
        isAnimating: true,
        currentIndex: (prev.currentIndex - 1 + metrics.length) % metrics.length,
      }))

      setTimeout(() => {
        setCarouselState((prev) => ({ ...prev, isAnimating: false }))
      }, 300)
    }
  }

  const setIsAnimating = (animating: boolean) => {
    setCarouselState((prev) => ({
      ...prev,
      isAnimating: animating,
    }))
  }

  // Modal actions
  const setModalState = (modal: keyof typeof modalStates, state: any) => {
    setModalStatesState((prev) => ({
      ...prev,
      [modal]: state,
    }))
  }

  const value: DashboardContextType = {
    // Data
    dashboardData,
    isLoadingDashboard,
    accounts,
    transactions,
    recentTransactions,
    bills,
    metrics,

    // Actions
    getTotalBalance,
    updateAccountBalance,
    addTransaction,
    payBill,

    // Carousel
    carouselState,
    nextSlide,
    prevSlide,
    setIsAnimating,

    // Modals
    modalStates,
    setModalState,
  }

  return <DashboardContext.Provider value={value}>{children}</DashboardContext.Provider>
}

export function useDashboard() {
  const context = useContext(DashboardContext)
  if (context === undefined) {
    throw new Error("useDashboard must be used within a DashboardProvider")
  }
  return context
}
