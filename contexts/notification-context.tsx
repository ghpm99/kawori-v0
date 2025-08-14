"use client"

import { createContext, useContext, useState, type ReactNode } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { api } from "@/lib/api"

export interface Notification {
  id: number
  title: string
  message: string
  date: string
  icon: string
  color: string
  read: boolean
  type: "info" | "warning" | "success" | "error"
}

interface NotificationContextType {
  notifications: Notification[]
  isLoadingNotifications: boolean
  unreadCount: number
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  addNotification: (notification: Omit<Notification, "id" | "read">) => void
  markAsRead: (id: number) => void
  markAllAsRead: () => void
  deleteNotification: (id: number) => void
  clearAllNotifications: () => void
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export function NotificationProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient()
  const [isOpen, setIsOpen] = useState(false)

  // Query for notifications
  const { data: notifications = [], isLoading: isLoadingNotifications } = useQuery({
    queryKey: ["notifications"],
    queryFn: api.getNotifications,
  })

  // Mutations
  const markAsReadMutation = useMutation({
    mutationFn: api.markNotificationRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] })
    },
  })

  const markAllAsReadMutation = useMutation({
    mutationFn: api.markAllNotificationsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] })
    },
  })

  // Computed values
  const unreadCount = notifications.filter((n: Notification) => !n.read).length

  // Action functions
  const addNotification = (notificationData: Omit<Notification, "id" | "read">) => {
    // In a real app, this would be an API call
    console.log("Adding notification:", notificationData)
  }

  const markAsRead = (id: number) => {
    markAsReadMutation.mutate(id)
  }

  const markAllAsRead = () => {
    markAllAsReadMutation.mutate()
  }

  const deleteNotification = (id: number) => {
    // In a real app, this would be an API call
    console.log("Deleting notification:", id)
  }

  const clearAllNotifications = () => {
    // In a real app, this would be an API call
    console.log("Clearing all notifications")
  }

  const value: NotificationContextType = {
    notifications,
    isLoadingNotifications,
    unreadCount,
    isOpen,
    setIsOpen,
    addNotification,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAllNotifications,
  }

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>
}

export function useNotification() {
  const context = useContext(NotificationContext)
  if (context === undefined) {
    throw new Error("useNotification must be used within a NotificationProvider")
  }
  return context
}
