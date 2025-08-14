"use client"

import { createContext, useContext, useState, type ReactNode } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { api } from "@/lib/api"

export interface User {
  id: string
  name: string
  email: string
  avatar: string
  phone?: string
  address?: string
  company?: string
  role: "admin" | "user" | "manager"
  creditCards: CreditCard[]
  activeSessions: Session[]
}

export interface CreditCard {
  id: string
  name: string
  number: string
  expiryDate: string
  type: "visa" | "mastercard" | "amex"
  isDefault: boolean
}

export interface Session {
  id: string
  device: string
  location: string
  lastActive: string
  isActive: boolean
}

interface UserContextType {
  // User data
  user: User | undefined
  isLoadingUser: boolean
  isAuthenticated: boolean

  // Credit cards
  creditCards: CreditCard[]
  defaultCard: CreditCard | null

  // Sessions
  activeSessions: Session[]

  // Profile modal state
  isProfileModalOpen: boolean
  setIsProfileModalOpen: (open: boolean) => void

  // Auth actions
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  updateProfile: (userData: Partial<User>) => void

  // Credit card actions
  addCreditCard: (card: Omit<CreditCard, "id">) => void
  updateCreditCard: (id: string, card: Partial<CreditCard>) => void
  deleteCreditCard: (id: string) => void
  setDefaultCard: (id: string) => void

  // Session actions
  terminateSession: (sessionId: string) => void
  terminateAllSessions: () => void
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient()
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false)

  // Query for user data
  const { data: user, isLoading: isLoadingUser } = useQuery({
    queryKey: ["user"],
    queryFn: api.getUser,
    retry: false,
  })

  // Mutations
  const updateUserMutation = useMutation({
    mutationFn: api.updateUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] })
    },
  })

  const loginMutation = useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) => api.login(email, password),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] })
    },
  })

  // Computed values
  const isAuthenticated = !!user
  const creditCards = user?.creditCards || []
  const activeSessions = user?.activeSessions || []
  const defaultCard = creditCards.find((card) => card.isDefault) || null

  // Auth actions
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      await loginMutation.mutateAsync({ email, password })
      return true
    } catch (error) {
      console.error("Login error:", error)
      return false
    }
  }

  const logout = () => {
    queryClient.setQueryData(["user"], null)
    queryClient.invalidateQueries({ queryKey: ["user"] })
  }

  const updateProfile = (userData: Partial<User>) => {
    updateUserMutation.mutate(userData)
  }

  // Credit card actions (these would be API calls in a real app)
  const addCreditCard = (cardData: Omit<CreditCard, "id">) => {
    console.log("Adding credit card:", cardData)
  }

  const updateCreditCard = (id: string, cardData: Partial<CreditCard>) => {
    console.log("Updating credit card:", id, cardData)
  }

  const deleteCreditCard = (id: string) => {
    console.log("Deleting credit card:", id)
  }

  const setDefaultCard = (id: string) => {
    console.log("Setting default card:", id)
  }

  // Session actions (these would be API calls in a real app)
  const terminateSession = (sessionId: string) => {
    console.log("Terminating session:", sessionId)
  }

  const terminateAllSessions = () => {
    console.log("Terminating all sessions")
  }

  const value: UserContextType = {
    // User data
    user,
    isLoadingUser,
    isAuthenticated,

    // Credit cards
    creditCards,
    defaultCard,

    // Sessions
    activeSessions,

    // Profile modal
    isProfileModalOpen,
    setIsProfileModalOpen,

    // Auth actions
    login,
    logout,
    updateProfile,

    // Credit card actions
    addCreditCard,
    updateCreditCard,
    deleteCreditCard,
    setDefaultCard,

    // Session actions
    terminateSession,
    terminateAllSessions,
  }

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}

export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider")
  }
  return context
}
