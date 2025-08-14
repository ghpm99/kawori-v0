"use client"

import { createContext, useContext, useState, type ReactNode } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { api } from "@/lib/api"

export interface Invoice {
  id: string
  number: string
  clientName: string
  clientEmail: string
  clientAddress: string
  date: string
  dueDate: string
  items: InvoiceItem[]
  subtotal: number
  tax: number
  total: number
  status: "draft" | "sent" | "paid" | "overdue"
  tags: string[]
}

export interface InvoiceItem {
  id: string
  description: string
  quantity: number
  price: number
  total: number
}

export interface Payment {
  id: string
  invoiceId?: string
  amount: number
  date: string
  method: "credit_card" | "bank_transfer" | "cash" | "pix"
  status: "pending" | "completed" | "failed" | "cancelled"
  description: string
  reference?: string
  type: "income" | "expense"
}

export interface Tag {
  id: string
  name: string
  color: string
  usageCount: number
}

interface FinancialContextType {
  // Invoices
  invoices: Invoice[]
  isLoadingInvoices: boolean
  filteredInvoices: Invoice[]
  invoiceSearchTerm: string
  invoiceStatusFilter: string
  isInvoiceModalOpen: boolean
  editingInvoice: Invoice | null

  // Payments
  payments: Payment[]
  isLoadingPayments: boolean
  filteredPayments: Payment[]
  paymentSearchTerm: string
  paymentStatusFilter: string
  paymentTypeFilter: string
  isPaymentModalOpen: boolean
  editingPayment: Payment | null

  // Tags
  tags: Tag[]
  isLoadingTags: boolean
  filteredTags: Tag[]
  tagSearchTerm: string
  isTagModalOpen: boolean
  editingTag: Tag | null

  // Invoice actions
  setInvoiceSearchTerm: (term: string) => void
  setInvoiceStatusFilter: (status: string) => void
  setIsInvoiceModalOpen: (open: boolean) => void
  setEditingInvoice: (invoice: Invoice | null) => void
  createInvoice: (invoice: Omit<Invoice, "id" | "number">) => void
  updateInvoice: (id: string, invoice: Partial<Invoice>) => void
  deleteInvoice: (id: string) => void

  // Payment actions
  setPaymentSearchTerm: (term: string) => void
  setPaymentStatusFilter: (status: string) => void
  setPaymentTypeFilter: (type: string) => void
  setIsPaymentModalOpen: (open: boolean) => void
  setEditingPayment: (payment: Payment | null) => void
  createPayment: (payment: Omit<Payment, "id">) => void
  updatePayment: (id: string, payment: Partial<Payment>) => void
  deletePayment: (id: string) => void

  // Tag actions
  setTagSearchTerm: (term: string) => void
  setIsTagModalOpen: (open: boolean) => void
  setEditingTag: (tag: Tag | null) => void
  createTag: (tag: Omit<Tag, "id" | "usageCount">) => void
  updateTag: (id: string, tag: Partial<Tag>) => void
  deleteTag: (id: string) => void

  // Utility functions
  formatCurrency: (amount: number) => string
  formatDate: (date: string) => string
  generateInvoiceNumber: () => string
  getInvoiceStats: () => {
    total: number
    paid: number
    pending: number
    overdue: number
  }
  getPaymentStats: () => {
    totalIncome: number
    totalExpenses: number
    balance: number
  }
}

const FinancialContext = createContext<FinancialContextType | undefined>(undefined)

export function FinancialProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient()

  // Local UI state
  const [invoiceSearchTerm, setInvoiceSearchTerm] = useState("")
  const [invoiceStatusFilter, setInvoiceStatusFilter] = useState("all")
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false)
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null)

  const [paymentSearchTerm, setPaymentSearchTerm] = useState("")
  const [paymentStatusFilter, setPaymentStatusFilter] = useState("all")
  const [paymentTypeFilter, setPaymentTypeFilter] = useState("all")
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)
  const [editingPayment, setEditingPayment] = useState<Payment | null>(null)

  const [tagSearchTerm, setTagSearchTerm] = useState("")
  const [isTagModalOpen, setIsTagModalOpen] = useState(false)
  const [editingTag, setEditingTag] = useState<Tag | null>(null)

  // Queries
  const { data: invoices = [], isLoading: isLoadingInvoices } = useQuery({
    queryKey: ["invoices"],
    queryFn: api.getInvoices,
  })

  const { data: payments = [], isLoading: isLoadingPayments } = useQuery({
    queryKey: ["payments"],
    queryFn: api.getPayments,
  })

  const { data: tags = [], isLoading: isLoadingTags } = useQuery({
    queryKey: ["tags"],
    queryFn: api.getTags,
  })

  // Mutations
  const createInvoiceMutation = useMutation({
    mutationFn: api.createInvoice,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invoices"] })
      setIsInvoiceModalOpen(false)
      setEditingInvoice(null)
    },
  })

  const updateInvoiceMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => api.updateInvoice(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invoices"] })
      setIsInvoiceModalOpen(false)
      setEditingInvoice(null)
    },
  })

  const deleteInvoiceMutation = useMutation({
    mutationFn: api.deleteInvoice,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invoices"] })
    },
  })

  const createPaymentMutation = useMutation({
    mutationFn: api.createPayment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payments"] })
      setIsPaymentModalOpen(false)
      setEditingPayment(null)
    },
  })

  const updatePaymentMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => api.updatePayment(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payments"] })
      setIsPaymentModalOpen(false)
      setEditingPayment(null)
    },
  })

  const deletePaymentMutation = useMutation({
    mutationFn: api.deletePayment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payments"] })
    },
  })

  const createTagMutation = useMutation({
    mutationFn: api.createTag,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tags"] })
      setIsTagModalOpen(false)
      setEditingTag(null)
    },
  })

  const updateTagMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => api.updateTag(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tags"] })
      setIsTagModalOpen(false)
      setEditingTag(null)
    },
  })

  const deleteTagMutation = useMutation({
    mutationFn: api.deleteTag,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tags"] })
    },
  })

  // Filtered data
  const filteredInvoices = invoices.filter((invoice: Invoice) => {
    const matchesSearch =
      invoice.clientName.toLowerCase().includes(invoiceSearchTerm.toLowerCase()) ||
      invoice.number.toLowerCase().includes(invoiceSearchTerm.toLowerCase())
    const matchesStatus = invoiceStatusFilter === "all" || invoice.status === invoiceStatusFilter
    return matchesSearch && matchesStatus
  })

  const filteredPayments = payments.filter((payment: Payment) => {
    const matchesSearch = payment.description.toLowerCase().includes(paymentSearchTerm.toLowerCase())
    const matchesStatus = paymentStatusFilter === "all" || payment.status === paymentStatusFilter
    const matchesType = paymentTypeFilter === "all" || payment.type === paymentTypeFilter
    return matchesSearch && matchesStatus && matchesType
  })

  const filteredTags = tags.filter((tag: Tag) => tag.name.toLowerCase().includes(tagSearchTerm.toLowerCase()))

  // Action functions
  const createInvoice = (invoiceData: Omit<Invoice, "id" | "number">) => {
    createInvoiceMutation.mutate(invoiceData)
  }

  const updateInvoice = (id: string, invoiceData: Partial<Invoice>) => {
    updateInvoiceMutation.mutate({ id, data: invoiceData })
  }

  const deleteInvoice = (id: string) => {
    deleteInvoiceMutation.mutate(id)
  }

  const createPayment = (paymentData: Omit<Payment, "id">) => {
    createPaymentMutation.mutate(paymentData)
  }

  const updatePayment = (id: string, paymentData: Partial<Payment>) => {
    updatePaymentMutation.mutate({ id, data: paymentData })
  }

  const deletePayment = (id: string) => {
    deletePaymentMutation.mutate(id)
  }

  const createTag = (tagData: Omit<Tag, "id" | "usageCount">) => {
    createTagMutation.mutate(tagData)
  }

  const updateTag = (id: string, tagData: Partial<Tag>) => {
    updateTagMutation.mutate({ id, data: tagData })
  }

  const deleteTag = (id: string) => {
    deleteTagMutation.mutate(id)
  }

  // Utility functions
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(amount)
  }

  const formatDate = (date: string): string => {
    return new Date(date).toLocaleDateString("pt-BR")
  }

  const generateInvoiceNumber = (): string => {
    const year = new Date().getFullYear()
    const count = invoices.length + 1
    return `INV-${year}-${count.toString().padStart(4, "0")}`
  }

  const getInvoiceStats = () => {
    const total = invoices.length
    const paid = invoices.filter((inv: Invoice) => inv.status === "paid").length
    const pending = invoices.filter((inv: Invoice) => inv.status === "sent").length
    const overdue = invoices.filter((inv: Invoice) => inv.status === "overdue").length
    return { total, paid, pending, overdue }
  }

  const getPaymentStats = () => {
    const totalIncome = payments
      .filter((p: Payment) => p.type === "income" && p.status === "completed")
      .reduce((sum: number, p: Payment) => sum + p.amount, 0)
    const totalExpenses = payments
      .filter((p: Payment) => p.type === "expense" && p.status === "completed")
      .reduce((sum: number, p: Payment) => sum + p.amount, 0)
    const balance = totalIncome - totalExpenses
    return { totalIncome, totalExpenses, balance }
  }

  const value: FinancialContextType = {
    // Invoices
    invoices,
    isLoadingInvoices,
    filteredInvoices,
    invoiceSearchTerm,
    invoiceStatusFilter,
    isInvoiceModalOpen,
    editingInvoice,

    // Payments
    payments,
    isLoadingPayments,
    filteredPayments,
    paymentSearchTerm,
    paymentStatusFilter,
    paymentTypeFilter,
    isPaymentModalOpen,
    editingPayment,

    // Tags
    tags,
    isLoadingTags,
    filteredTags,
    tagSearchTerm,
    isTagModalOpen,
    editingTag,

    // Invoice actions
    setInvoiceSearchTerm,
    setInvoiceStatusFilter,
    setIsInvoiceModalOpen,
    setEditingInvoice,
    createInvoice,
    updateInvoice,
    deleteInvoice,

    // Payment actions
    setPaymentSearchTerm,
    setPaymentStatusFilter,
    setPaymentTypeFilter,
    setIsPaymentModalOpen,
    setEditingPayment,
    createPayment,
    updatePayment,
    deletePayment,

    // Tag actions
    setTagSearchTerm,
    setIsTagModalOpen,
    setEditingTag,
    createTag,
    updateTag,
    deleteTag,

    // Utility functions
    formatCurrency,
    formatDate,
    generateInvoiceNumber,
    getInvoiceStats,
    getPaymentStats,
  }

  return <FinancialContext.Provider value={value}>{children}</FinancialContext.Provider>
}

export function useFinancial() {
  const context = useContext(FinancialContext)
  if (context === undefined) {
    throw new Error("useFinancial must be used within a FinancialProvider")
  }
  return context
}
