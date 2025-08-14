"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Search, Edit, Trash2, Eye } from "lucide-react"
import { useFinancial } from "@/contexts/financial-context"
import { useTranslation } from "@/hooks/use-translation"

export default function InvoicesPage() {
  const { t } = useTranslation()

  const {
    filteredInvoices,
    invoiceSearchTerm,
    invoiceStatusFilter,
    isInvoiceModalOpen,
    editingInvoice,
    setInvoiceSearchTerm,
    setInvoiceStatusFilter,
    setIsInvoiceModalOpen,
    setEditingInvoice,
    createInvoice,
    updateInvoice,
    deleteInvoice,
    formatCurrency,
    formatDate,
    getInvoiceStats,
  } = useFinancial()

  const [formData, setFormData] = useState({
    clientName: "",
    clientEmail: "",
    clientAddress: "",
    date: new Date().toISOString().split("T")[0],
    dueDate: "",
    items: [{ id: "1", description: "", quantity: 1, price: 0, total: 0 }],
    subtotal: 0,
    tax: 0,
    total: 0,
    status: "draft" as const,
    tags: [] as string[],
  })

  const stats = getInvoiceStats()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (editingInvoice) {
      updateInvoice(editingInvoice.id, formData)
    } else {
      createInvoice(formData)
    }

    setIsInvoiceModalOpen(false)
    setEditingInvoice(null)
    resetForm()
  }

  const resetForm = () => {
    setFormData({
      clientName: "",
      clientEmail: "",
      clientAddress: "",
      date: new Date().toISOString().split("T")[0],
      dueDate: "",
      items: [{ id: "1", description: "", quantity: 1, price: 0, total: 0 }],
      subtotal: 0,
      tax: 0,
      total: 0,
      status: "draft",
      tags: [],
    })
  }

  const handleEdit = (invoice: any) => {
    setEditingInvoice(invoice)
    setFormData(invoice)
    setIsInvoiceModalOpen(true)
  }

  const handleDelete = (id: string) => {
    if (confirm(t("invoices.confirmDelete"))) {
      deleteInvoice(id)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800"
      case "sent":
        return "bg-blue-100 text-blue-800"
      case "overdue":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusTranslation = (status: string) => {
    switch (status) {
      case "paid":
        return t("invoices.status.paid")
      case "sent":
        return t("invoices.status.sent")
      case "overdue":
        return t("invoices.status.overdue")
      case "draft":
        return t("invoices.status.draft")
      default:
        return status
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">{t("invoices.title")}</h1>
        <Button onClick={() => setIsInvoiceModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          {t("invoices.create")}
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{t("invoices.stats.total")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{t("invoices.status.paid")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.paid}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{t("invoices.status.pending")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.pending}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{t("invoices.status.overdue")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.overdue}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>{t("invoices.title")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={t("invoices.searchPlaceholder")}
                  value={invoiceSearchTerm}
                  onChange={(e) => setInvoiceSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <Select value={invoiceStatusFilter} onValueChange={setInvoiceStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder={t("invoices.filterByStatus")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("invoices.allStatus")}</SelectItem>
                <SelectItem value="draft">{t("invoices.status.draft")}</SelectItem>
                <SelectItem value="sent">{t("invoices.status.sent")}</SelectItem>
                <SelectItem value="paid">{t("invoices.status.paid")}</SelectItem>
                <SelectItem value="overdue">{t("invoices.status.overdue")}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("invoices.table.number")}</TableHead>
                <TableHead>{t("invoices.table.client")}</TableHead>
                <TableHead>{t("invoices.table.date")}</TableHead>
                <TableHead>{t("invoices.table.dueDate")}</TableHead>
                <TableHead>{t("invoices.table.amount")}</TableHead>
                <TableHead>{t("invoices.table.status")}</TableHead>
                <TableHead>{t("common.actions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInvoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell className="font-medium">{invoice.number}</TableCell>
                  <TableCell>{invoice.clientName}</TableCell>
                  <TableCell>{formatDate(invoice.date)}</TableCell>
                  <TableCell>{formatDate(invoice.dueDate)}</TableCell>
                  <TableCell>{formatCurrency(invoice.total)}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(invoice.status)}>{getStatusTranslation(invoice.status)}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="sm" title={t("invoices.actions.view")}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(invoice)} title={t("common.edit")}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(invoice.id)}
                        title={t("common.delete")}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Invoice Modal */}
      <Dialog open={isInvoiceModalOpen} onOpenChange={setIsInvoiceModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingInvoice ? t("invoices.edit") : t("invoices.create")}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="clientName">{t("invoices.form.clientName")}</Label>
                <Input
                  id="clientName"
                  value={formData.clientName}
                  onChange={(e) => setFormData((prev) => ({ ...prev, clientName: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="clientEmail">{t("invoices.form.clientEmail")}</Label>
                <Input
                  id="clientEmail"
                  type="email"
                  value={formData.clientEmail}
                  onChange={(e) => setFormData((prev) => ({ ...prev, clientEmail: e.target.value }))}
                  required
                />
              </div>
            </div>
            <div>
              <Label htmlFor="clientAddress">{t("invoices.form.clientAddress")}</Label>
              <Textarea
                id="clientAddress"
                value={formData.clientAddress}
                onChange={(e) => setFormData((prev) => ({ ...prev, clientAddress: e.target.value }))}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="date">{t("invoices.form.date")}</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData((prev) => ({ ...prev, date: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="dueDate">{t("invoices.form.dueDate")}</Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData((prev) => ({ ...prev, dueDate: e.target.value }))}
                  required
                />
              </div>
            </div>
            <div>
              <Label>{t("invoices.form.status")}</Label>
              <Select
                value={formData.status}
                onValueChange={(value: any) => setFormData((prev) => ({ ...prev, status: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">{t("invoices.status.draft")}</SelectItem>
                  <SelectItem value="sent">{t("invoices.status.sent")}</SelectItem>
                  <SelectItem value="paid">{t("invoices.status.paid")}</SelectItem>
                  <SelectItem value="overdue">{t("invoices.status.overdue")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => setIsInvoiceModalOpen(false)}>
                {t("common.cancel")}
              </Button>
              <Button type="submit">
                {editingInvoice ? t("invoices.actions.update") : t("invoices.actions.create")}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
