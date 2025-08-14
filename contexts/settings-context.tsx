"use client"

import { createContext, useContext, type ReactNode } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { api } from "@/lib/api"

export interface NotificationSettings {
  email: boolean
  push: boolean
  sms: boolean
  marketing: boolean
  updates: boolean
  accountActivity: boolean
}

export interface PrivacySettings {
  dataSharing: boolean
  accountVisibility: "public" | "private" | "friends"
  personalizedAds: boolean
}

export interface Settings {
  avatar: string
  fullName: string
  email: string
  phone: string
  timezone: string
  language: string
  currency: string
  dateFormat: string
  theme: "light" | "dark" | "system"
  notifications: NotificationSettings
  privacy: PrivacySettings
}

interface SettingsContextType {
  settings: Settings | null
  isLoading: boolean
  error: Error | null
  updateSettings: (updates: Partial<Settings>) => Promise<void>
  updateNotifications: (notifications: Partial<NotificationSettings>) => Promise<void>
  updatePrivacy: (privacy: Partial<PrivacySettings>) => Promise<void>
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined)

export function SettingsProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient()

  const {
    data: settings,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["settings"],
    queryFn: api.settings.get,
    initialData: {
      avatar: "/placeholder.svg?height=100&width=100",
      fullName: "John Doe",
      email: "john.doe@example.com",
      phone: "+1 (555) 123-4567",
      timezone: "utc-5",
      language: "en",
      currency: "usd",
      dateFormat: "mm-dd-yyyy",
      theme: "system" as const,
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
        accountVisibility: "public" as const,
        personalizedAds: false,
      },
    },
  })

  const updateSettingsMutation = useMutation({
    mutationFn: api.settings.update,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings"] })
    },
  })

  const updateSettings = async (updates: Partial<Settings>) => {
    await updateSettingsMutation.mutateAsync(updates)
  }

  const updateNotifications = async (notifications: Partial<NotificationSettings>) => {
    await updateSettingsMutation.mutateAsync({
      notifications: {
        ...settings?.notifications,
        ...notifications,
      },
    })
  }

  const updatePrivacy = async (privacy: Partial<PrivacySettings>) => {
    await updateSettingsMutation.mutateAsync({
      privacy: {
        ...settings?.privacy,
        ...privacy,
      },
    })
  }

  const value: SettingsContextType = {
    settings,
    isLoading,
    error,
    updateSettings,
    updateNotifications,
    updatePrivacy,
  }

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>
}

export function useSettings() {
  const context = useContext(SettingsContext)
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider")
  }
  return context
}
