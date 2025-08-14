"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { X, Plus } from "lucide-react"
import { useDiary } from "@/contexts/diary-context"
import { useTranslation } from "@/hooks/use-translation"

const moodOptions = [
  { value: "happy", label: "Happy", emoji: "😊" },
  { value: "sad", label: "Sad", emoji: "😢" },
  { value: "excited", label: "Excited", emoji: "🎉" },
  { value: "calm", label: "Calm", emoji: "😌" },
  { value: "anxious", label: "Anxious", emoji: "😰" },
  { value: "grateful", label: "Grateful", emoji: "🙏" },
  { value: "frustrated", label: "Frustrated", emoji: "😤" },
  { value: "energetic", label: "Energetic", emoji: "⚡" },
]

const categoryOptions = [
  "Work",
  "Personal",
  "Health",
  "Family",
  "Travel",
  "Learning",
  "Hobbies",
  "Wellness",
  "Relationships",
  "Goals",
]

export function ActivityForm() {
  const { addEntry, getCategories } = useDiary()
  const { t } = useTranslation()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    mood: "",
    category: "",
    tags: [] as string[],
    date: new Date().toISOString().split("T")[0],
  })
  const [newTag, setNewTag] = useState("")

  const existingCategories = getCategories()
  const allCategories = Array.from(new Set([...categoryOptions, ...existingCategories]))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.title || !formData.content || !formData.mood || !formData.category) {
      return
    }

    setIsSubmitting(true)
    try {
      await addEntry({
        title: formData.title,
        content: formData.content,
        mood: formData.mood as any,
        category: formData.category,
        tags: formData.tags,
        date: formData.date,
      })

      // Reset form
      setFormData({
        title: "",
        content: "",
        mood: "",
        category: "",
        tags: [],
        date: new Date().toISOString().split("T")[0],
      })
    } catch (error) {
      console.error("Failed to add entry:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()],
      }))
      setNewTag("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }))
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      addTag()
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("diary.addNewEntry") || "Add New Entry"}</CardTitle>
        <CardDescription>
          {t("diary.addEntryDescription") || "Record your thoughts, feelings, and experiences"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">{t("diary.title") || "Title"}</Label>
              <Input
                id="title"
                placeholder={t("diary.titlePlaceholder") || "Enter a title for your entry"}
                value={formData.title}
                onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="date">{t("diary.date") || "Date"}</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData((prev) => ({ ...prev, date: e.target.value }))}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">{t("diary.content") || "Content"}</Label>
            <Textarea
              id="content"
              placeholder={t("diary.contentPlaceholder") || "Write about your day, thoughts, or experiences..."}
              value={formData.content}
              onChange={(e) => setFormData((prev) => ({ ...prev, content: e.target.value }))}
              rows={6}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{t("diary.mood") || "Mood"}</Label>
              <Select
                value={formData.mood}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, mood: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t("diary.selectMood") || "Select your mood"} />
                </SelectTrigger>
                <SelectContent>
                  {moodOptions.map((mood) => (
                    <SelectItem key={mood.value} value={mood.value}>
                      <div className="flex items-center gap-2">
                        <span>{mood.emoji}</span>
                        <span>{mood.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>{t("diary.category") || "Category"}</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, category: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t("diary.selectCategory") || "Select a category"} />
                </SelectTrigger>
                <SelectContent>
                  {allCategories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>{t("diary.tags") || "Tags"}</Label>
            <div className="flex gap-2">
              <Input
                placeholder={t("diary.addTag") || "Add a tag"}
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={handleKeyPress}
              />
              <Button type="button" variant="outline" onClick={addTag}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                    {tag}
                    <button type="button" onClick={() => removeTag(tag)} className="ml-1 hover:text-destructive">
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? t("common.saving") || "Saving..." : t("diary.saveEntry") || "Save Entry"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
