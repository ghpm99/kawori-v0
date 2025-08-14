"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

export interface DiaryEntry {
  id: string
  title: string
  content: string
  mood: "happy" | "sad" | "excited" | "calm" | "anxious" | "grateful" | "frustrated" | "energetic"
  category: string
  tags: string[]
  date: string
  createdAt: string
  updatedAt: string
}

interface DiaryContextType {
  entries: DiaryEntry[]
  loading: boolean
  error: string | null
  searchTerm: string
  selectedCategory: string
  selectedMood: string
  setSearchTerm: (term: string) => void
  setSelectedCategory: (category: string) => void
  setSelectedMood: (mood: string) => void
  addEntry: (entry: Omit<DiaryEntry, "id" | "createdAt" | "updatedAt">) => Promise<void>
  updateEntry: (id: string, updates: Partial<DiaryEntry>) => Promise<void>
  deleteEntry: (id: string) => Promise<void>
  getFilteredEntries: () => DiaryEntry[]
  getCategories: () => string[]
  getMoods: () => string[]
  getEntryById: (id: string) => DiaryEntry | undefined
}

const DiaryContext = createContext<DiaryContextType | undefined>(undefined)

export function useDiary() {
  const context = useContext(DiaryContext)
  if (context === undefined) {
    throw new Error("useDiary must be used within a DiaryProvider")
  }
  return context
}

export function DiaryProvider({ children }: { children: ReactNode }) {
  const [entries, setEntries] = useState<DiaryEntry[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [selectedMood, setSelectedMood] = useState("")

  // Initialize with mock data
  useEffect(() => {
    const mockEntries: DiaryEntry[] = [
      {
        id: "1",
        title: "Great Day at Work",
        content:
          "Had an amazing presentation today. The client loved our proposal and we secured the deal! Feeling really proud of the team's hard work.",
        mood: "excited",
        category: "Work",
        tags: ["success", "presentation", "teamwork"],
        date: "2024-01-15",
        createdAt: "2024-01-15T10:30:00Z",
        updatedAt: "2024-01-15T10:30:00Z",
      },
      {
        id: "2",
        title: "Morning Workout",
        content:
          "Started the day with a 5km run in the park. The weather was perfect and I felt so energized afterwards. Need to keep this routine going!",
        mood: "energetic",
        category: "Health",
        tags: ["exercise", "running", "morning"],
        date: "2024-01-14",
        createdAt: "2024-01-14T07:00:00Z",
        updatedAt: "2024-01-14T07:00:00Z",
      },
      {
        id: "3",
        title: "Family Dinner",
        content:
          "Had a wonderful dinner with the family. Mom made her famous lasagna and we all shared stories from our week. These moments are precious.",
        mood: "grateful",
        category: "Family",
        tags: ["family", "dinner", "gratitude"],
        date: "2024-01-13",
        createdAt: "2024-01-13T19:30:00Z",
        updatedAt: "2024-01-13T19:30:00Z",
      },
      {
        id: "4",
        title: "Meditation Session",
        content:
          "Spent 20 minutes in quiet meditation this evening. Feeling much more centered and peaceful. The stress from this week is finally melting away.",
        mood: "calm",
        category: "Wellness",
        tags: ["meditation", "peace", "mindfulness"],
        date: "2024-01-12",
        createdAt: "2024-01-12T20:00:00Z",
        updatedAt: "2024-01-12T20:00:00Z",
      },
    ]

    setEntries(mockEntries)
  }, [])

  const addEntry = async (entryData: Omit<DiaryEntry, "id" | "createdAt" | "updatedAt">) => {
    try {
      setLoading(true)
      setError(null)
      const newEntry: DiaryEntry = {
        ...entryData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      setEntries((prev) => [newEntry, ...prev])
    } catch (err) {
      setError("Failed to add entry")
      throw err
    } finally {
      setLoading(false)
    }
  }

  const updateEntry = async (id: string, updates: Partial<DiaryEntry>) => {
    try {
      setLoading(true)
      setError(null)
      setEntries((prev) =>
        prev.map((entry) =>
          entry.id === id
            ? {
                ...entry,
                ...updates,
                updatedAt: new Date().toISOString(),
              }
            : entry,
        ),
      )
    } catch (err) {
      setError("Failed to update entry")
      throw err
    } finally {
      setLoading(false)
    }
  }

  const deleteEntry = async (id: string) => {
    try {
      setLoading(true)
      setError(null)
      setEntries((prev) => prev.filter((entry) => entry.id !== id))
    } catch (err) {
      setError("Failed to delete entry")
      throw err
    } finally {
      setLoading(false)
    }
  }

  const getFilteredEntries = () => {
    if (!Array.isArray(entries)) return []

    return entries
      .filter((entry) => {
        const matchesSearch =
          !searchTerm ||
          entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          entry.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
          entry.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))

        const matchesCategory = !selectedCategory || entry.category === selectedCategory
        const matchesMood = !selectedMood || entry.mood === selectedMood

        return matchesSearch && matchesCategory && matchesMood
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }

  const getCategories = () => {
    if (!Array.isArray(entries)) return []
    return Array.from(new Set(entries.map((entry) => entry.category)))
  }

  const getMoods = () => {
    if (!Array.isArray(entries)) return []
    return Array.from(new Set(entries.map((entry) => entry.mood)))
  }

  const getEntryById = (id: string) => {
    return entries.find((entry) => entry.id === id)
  }

  const value: DiaryContextType = {
    entries,
    loading,
    error,
    searchTerm,
    selectedCategory,
    selectedMood,
    setSearchTerm,
    setSelectedCategory,
    setSelectedMood,
    addEntry,
    updateEntry,
    deleteEntry,
    getFilteredEntries,
    getCategories,
    getMoods,
    getEntryById,
  }

  return <DiaryContext.Provider value={value}>{children}</DiaryContext.Provider>
}
