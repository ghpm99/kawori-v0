"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Plus, Search, Edit, Trash2, Tag } from "lucide-react"
import { useFinancial } from "@/contexts/financial-context"

const colorOptions = [
  { name: "Blue", value: "bg-blue-500" },
  { name: "Green", value: "bg-green-500" },
  { name: "Red", value: "bg-red-500" },
  { name: "Yellow", value: "bg-yellow-500" },
  { name: "Purple", value: "bg-purple-500" },
  { name: "Pink", value: "bg-pink-500" },
  { name: "Indigo", value: "bg-indigo-500" },
  { name: "Orange", value: "bg-orange-500" },
]

export default function TagsPage() {
  const {
    filteredTags,
    tagSearchTerm,
    isTagModalOpen,
    editingTag,
    setTagSearchTerm,
    setIsTagModalOpen,
    setEditingTag,
    createTag,
    updateTag,
    deleteTag,
  } = useFinancial()

  const [formData, setFormData] = useState({
    name: "",
    color: "bg-blue-500",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (editingTag) {
      updateTag(editingTag.id, formData)
    } else {
      createTag(formData)
    }

    setIsTagModalOpen(false)
    setEditingTag(null)
    resetForm()
  }

  const resetForm = () => {
    setFormData({
      name: "",
      color: "bg-blue-500",
    })
  }

  const handleEdit = (tag: any) => {
    setEditingTag(tag)
    setFormData({ name: tag.name, color: tag.color })
    setIsTagModalOpen(true)
  }

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this tag?")) {
      deleteTag(id)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Tags</h1>
        <Button onClick={() => setIsTagModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New Tag
        </Button>
      </div>

      {/* Search */}
      <Card>
        <CardHeader>
          <CardTitle>Manage Tags</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search tags..."
                value={tagSearchTerm}
                onChange={(e) => setTagSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>

          {/* Tags Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTags.map((tag) => (
              <Card key={tag.id} className="relative">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <div className={`w-4 h-4 rounded-full ${tag.color}`} />
                      <span className="font-medium">{tag.name}</span>
                    </div>
                    <div className="flex space-x-1">
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(tag)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(tag.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">Used {tag.usageCount} times</div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredTags.length === 0 && (
            <div className="text-center py-8">
              <Tag className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No tags found</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tag Modal */}
      <Dialog open={isTagModalOpen} onOpenChange={setIsTagModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingTag ? "Edit Tag" : "Create New Tag"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Tag Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                required
              />
            </div>
            <div>
              <Label>Color</Label>
              <div className="grid grid-cols-4 gap-2 mt-2">
                {colorOptions.map((color) => (
                  <button
                    key={color.value}
                    type="button"
                    className={`w-full h-10 rounded-md border-2 ${color.value} ${
                      formData.color === color.value ? "border-gray-900" : "border-gray-300"
                    }`}
                    onClick={() => setFormData((prev) => ({ ...prev, color: color.value }))}
                    title={color.name}
                  />
                ))}
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => setIsTagModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">{editingTag ? "Update Tag" : "Create Tag"}</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
