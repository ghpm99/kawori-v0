import { renderHook, act } from "@testing-library/react"
import { DiaryProvider, useDiary } from "@/contexts/diary-context"
import type { ReactNode } from "react"

const createWrapper = () => {
  return ({ children }: { children: ReactNode }) => <DiaryProvider>{children}</DiaryProvider>
}

describe("DiaryContext", () => {
  it("should provide initial diary entries", () => {
    const wrapper = createWrapper()
    const { result } = renderHook(() => useDiary(), { wrapper })

    expect(result.current.entries).toHaveLength(4)
    expect(result.current.entries[0].title).toBe("Great Day at Work")
  })

  it("should add new entry", async () => {
    const wrapper = createWrapper()
    const { result } = renderHook(() => useDiary(), { wrapper })

    const newEntry = {
      title: "Test Entry",
      content: "Test content",
      mood: "happy" as const,
      category: "Test",
      tags: ["test"],
      date: "2024-01-16",
    }

    await act(async () => {
      await result.current.addEntry(newEntry)
    })

    expect(result.current.entries).toHaveLength(5)
    expect(result.current.entries[0].title).toBe("Test Entry")
  })

  it("should update entry", async () => {
    const wrapper = createWrapper()
    const { result } = renderHook(() => useDiary(), { wrapper })

    const entryId = result.current.entries[0].id

    await act(async () => {
      await result.current.updateEntry(entryId, { title: "Updated Title" })
    })

    const updatedEntry = result.current.entries.find((e) => e.id === entryId)
    expect(updatedEntry?.title).toBe("Updated Title")
  })

  it("should delete entry", async () => {
    const wrapper = createWrapper()
    const { result } = renderHook(() => useDiary(), { wrapper })

    const initialCount = result.current.entries.length
    const entryId = result.current.entries[0].id

    await act(async () => {
      await result.current.deleteEntry(entryId)
    })

    expect(result.current.entries).toHaveLength(initialCount - 1)
    expect(result.current.entries.find((e) => e.id === entryId)).toBeUndefined()
  })

  it("should filter entries by search term", () => {
    const wrapper = createWrapper()
    const { result } = renderHook(() => useDiary(), { wrapper })

    act(() => {
      result.current.setSearchTerm("work")
    })

    const filtered = result.current.getFilteredEntries()
    expect(filtered).toHaveLength(1)
    expect(filtered[0].title).toBe("Great Day at Work")
  })

  it("should filter entries by category", () => {
    const wrapper = createWrapper()
    const { result } = renderHook(() => useDiary(), { wrapper })

    act(() => {
      result.current.setSelectedCategory("Work")
    })

    const filtered = result.current.getFilteredEntries()
    expect(filtered).toHaveLength(1)
    expect(filtered[0].category).toBe("Work")
  })

  it("should filter entries by mood", () => {
    const wrapper = createWrapper()
    const { result } = renderHook(() => useDiary(), { wrapper })

    act(() => {
      result.current.setSelectedMood("excited")
    })

    const filtered = result.current.getFilteredEntries()
    expect(filtered).toHaveLength(1)
    expect(filtered[0].mood).toBe("excited")
  })

  it("should get unique categories", () => {
    const wrapper = createWrapper()
    const { result } = renderHook(() => useDiary(), { wrapper })

    const categories = result.current.getCategories()
    expect(categories).toContain("Work")
    expect(categories).toContain("Health")
    expect(categories).toContain("Family")
    expect(categories).toContain("Wellness")
  })

  it("should get unique moods", () => {
    const wrapper = createWrapper()
    const { result } = renderHook(() => useDiary(), { wrapper })

    const moods = result.current.getMoods()
    expect(moods).toContain("excited")
    expect(moods).toContain("energetic")
    expect(moods).toContain("grateful")
    expect(moods).toContain("calm")
  })

  it("should get entry by id", () => {
    const wrapper = createWrapper()
    const { result } = renderHook(() => useDiary(), { wrapper })

    const firstEntry = result.current.entries[0]
    const foundEntry = result.current.getEntryById(firstEntry.id)

    expect(foundEntry).toEqual(firstEntry)
  })
})
