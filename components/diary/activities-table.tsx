"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, Edit, Trash2, Plus } from "lucide-react"
import { useDiary } from "@/contexts/diary-context"
import { useTranslation } from "@/hooks/use-translation"

const moodEmojis = {
  happy: "😊",
  sad: "😢",
  excited: "🎉",
  calm: "😌",
  anxious: "😰",
  grateful: "🙏",
  frustrated: "😤",
  energetic: "⚡",
}

export function ActivitiesTable() {
  const {
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    selectedMood,
    setSelectedMood,
    getFilteredEntries,
    getCategories,
    getMoods,
    deleteEntry,
  } = useDiary()
  const { t } = useTranslation()
  const [editingEntry, setEditingEntry] = useState<string | null>(null)

  const filteredEntries = getFilteredEntries()
  const categories = getCategories()
  const moods = getMoods()

  const handleDelete = async (id: string) => {
    if (window.confirm(t("diary.confirmDelete") || "Are you sure you want to delete this entry?")) {
      try {
        await deleteEntry(id)
      } catch (error) {
        console.error("Failed to delete entry:", error)
      }
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          {t("diary.entries") || "Diary Entries"}
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            {t("diary.addEntry") || "Add Entry"}
          </Button>
        </CardTitle>
        <CardDescription>{t("diary.entriesDescription") || "Manage and view your diary entries"}</CardDescription>
      </CardHeader>
      <CardContent>
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder={t("diary.searchEntries") || "Search entries..."}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={selectedCategory || "all"} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder={t("diary.allCategories") || "All Categories"} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("diary.allCategories") || "All Categories"}</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedMood || "all"} onValueChange={setSelectedMood}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder={t("diary.allMoods") || "All Moods"} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("diary.allMoods") || "All Moods"}</SelectItem>
              {moods.map((mood) => (
                <SelectItem key={mood} value={mood}>
                  {moodEmojis[mood as keyof typeof moodEmojis]} {mood}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("diary.title") || "Title"}</TableHead>
                <TableHead>{t("diary.category") || "Category"}</TableHead>
                <TableHead>{t("diary.mood") || "Mood"}</TableHead>
                <TableHead>{t("diary.date") || "Date"}</TableHead>
                <TableHead>{t("diary.tags") || "Tags"}</TableHead>
                <TableHead className="text-right">{t("common.actions") || "Actions"}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEntries.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    {t("diary.noEntries") || "No entries found"}
                  </TableCell>
                </TableRow>
              ) : (
                filteredEntries.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell className="font-medium">
                      <div>
                        <div className="font-medium">{entry.title}</div>
                        <div className="text-sm text-muted-foreground line-clamp-2">{entry.content}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{entry.category}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span>{moodEmojis[entry.mood as keyof typeof moodEmojis]}</span>
                        <span className="capitalize">{entry.mood}</span>
                      </div>
                    </TableCell>
                    <TableCell>{formatDate(entry.date)}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {entry.tags.slice(0, 2).map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {entry.tags.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{entry.tags.length - 2}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="sm" onClick={() => setEditingEntry(entry.id)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(entry.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
