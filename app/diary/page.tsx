"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { ActivityForm } from "@/components/diary/activity-form"
import { ActivitiesTable } from "@/components/diary/activities-table"
import { useDiary, type DiaryEntry } from "@/contexts/diary-context"
import { useTranslation } from "@/hooks/use-translation"

export default function DiaryPage() {
  const { entries } = useDiary()
  const { t } = useTranslation()
  const [showForm, setShowForm] = useState(false)
  const [editingEntry, setEditingEntry] = useState<DiaryEntry | undefined>()

  const handleAddEntry = () => {
    setEditingEntry(undefined)
    setShowForm(true)
  }

  const handleEditEntry = (entry: DiaryEntry) => {
    setEditingEntry(entry)
    setShowForm(true)
  }

  const handleFormSuccess = () => {
    setShowForm(false)
    setEditingEntry(undefined)
  }

  const handleFormCancel = () => {
    setShowForm(false)
    setEditingEntry(undefined)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t("diary.title")}</h1>
          <p className="text-muted-foreground">{t("diary.subtitle")}</p>
        </div>
        <Button onClick={handleAddEntry}>
          <Plus className="h-4 w-4 mr-2" />
          {t("diary.addEntry")}
        </Button>
      </div>

      {showForm && <ActivityForm entry={editingEntry} onSuccess={handleFormSuccess} onCancel={handleFormCancel} />}

      <ActivitiesTable onEditEntry={handleEditEntry} />
    </div>
  )
}
