// Mock API helper for development
export const api = {
  // Dashboard endpoints
  dashboard: {
    get: async () => {
      await new Promise((resolve) => setTimeout(resolve, 500))
      return {
        totalBalance: 12450.75,
        monthlyIncome: 5000,
        monthlyExpenses: 3200,
        savingsGoal: 10000,
        currentSavings: 7500,
        recentTransactions: [
          { id: "1", description: "Salary", amount: 5000, date: "2024-01-15", type: "income" },
          { id: "2", description: "Rent", amount: -1200, date: "2024-01-14", type: "expense" },
          { id: "3", description: "Groceries", amount: -150, date: "2024-01-13", type: "expense" },
        ],
      }
    },
  },

  // Budget endpoints
  budget: {
    get: async () => {
      await new Promise((resolve) => setTimeout(resolve, 300))
      return {
        categories: [
          { id: "1", name: "Housing", budgeted: 1500, spent: 1200, color: "#3b82f6" },
          { id: "2", name: "Food", budgeted: 600, spent: 450, color: "#10b981" },
          { id: "3", name: "Transportation", budgeted: 400, spent: 320, color: "#f59e0b" },
          { id: "4", name: "Entertainment", budgeted: 300, spent: 180, color: "#ef4444" },
        ],
        goals: [
          { id: "1", name: "Emergency Fund", target: 10000, current: 6500, deadline: "2024-12-31" },
          { id: "2", name: "Vacation", target: 3000, current: 1200, deadline: "2024-08-15" },
        ],
        salary: 5000,
      }
    },
    update: async (data: any) => {
      await new Promise((resolve) => setTimeout(resolve, 300))
      return data
    },
    createCategory: async (category: any) => {
      await new Promise((resolve) => setTimeout(resolve, 300))
      return { ...category, id: Date.now().toString() }
    },
    updateCategory: async (id: string, data: any) => {
      await new Promise((resolve) => setTimeout(resolve, 300))
      return { ...data, id }
    },
    deleteCategory: async (id: string) => {
      await new Promise((resolve) => setTimeout(resolve, 300))
      return { success: true }
    },
  },

  // Diary endpoints
  diary: {
    getAll: async () => {
      await new Promise((resolve) => setTimeout(resolve, 300))
      return [
        {
          id: "1",
          title: "Great Day at Work",
          content: "Had an amazing presentation today...",
          mood: "excited",
          category: "Work",
          tags: ["success", "presentation"],
          date: "2024-01-15",
          createdAt: "2024-01-15T10:30:00Z",
          updatedAt: "2024-01-15T10:30:00Z",
        },
      ]
    },
    create: async (entry: any) => {
      await new Promise((resolve) => setTimeout(resolve, 300))
      return {
        ...entry,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
    },
    update: async (id: string, data: any) => {
      await new Promise((resolve) => setTimeout(resolve, 300))
      return { ...data, id, updatedAt: new Date().toISOString() }
    },
    delete: async (id: string) => {
      await new Promise((resolve) => setTimeout(resolve, 300))
      return { success: true }
    },
  },

  // Settings endpoints
  settings: {
    get: async () => {
      await new Promise((resolve) => setTimeout(resolve, 200))
      return {
        avatar: "/placeholder.svg?height=100&width=100",
        fullName: "John Doe",
        email: "john.doe@example.com",
        phone: "+1 (555) 123-4567",
        timezone: "utc-5",
        language: "en",
        currency: "usd",
        dateFormat: "mm-dd-yyyy",
        theme: "system",
        notifications: {
          email: true,
          push: true,
          sms: false,
          marketing: false,
          updates: true,
          accountActivity: true,
        },
        privacy: {
          dataSharing: true,
          accountVisibility: "public",
          personalizedAds: false,
        },
      }
    },
    update: async (settings: any) => {
      await new Promise((resolve) => setTimeout(resolve, 200))
      return {
        avatar: "/placeholder.svg?height=100&width=100",
        fullName: "John Doe",
        email: "john.doe@example.com",
        phone: "+1 (555) 123-4567",
        timezone: "utc-5",
        language: "en",
        currency: "usd",
        dateFormat: "mm-dd-yyyy",
        theme: "system",
        notifications: {
          email: true,
          push: true,
          sms: false,
          marketing: false,
          updates: true,
          accountActivity: true,
        },
        privacy: {
          dataSharing: true,
          accountVisibility: "public",
          personalizedAds: false,
        },
        ...settings,
      }
    },
  },

  // Other endpoints...
  invoices: {
    getAll: async () => {
      await new Promise((resolve) => setTimeout(resolve, 300))
      return []
    },
  },
  payments: {
    getAll: async () => {
      await new Promise((resolve) => setTimeout(resolve, 300))
      return []
    },
  },
  tags: {
    getAll: async () => {
      await new Promise((resolve) => setTimeout(resolve, 300))
      return []
    },
  },
  notifications: {
    getAll: async () => {
      await new Promise((resolve) => setTimeout(resolve, 300))
      return []
    },
  },
  user: {
    get: async () => {
      await new Promise((resolve) => setTimeout(resolve, 200))
      return {
        id: "1",
        name: "John Doe",
        email: "john@example.com",
      }
    },
  },
}
