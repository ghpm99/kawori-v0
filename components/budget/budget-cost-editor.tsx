"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { ChevronDown, ChevronUp, Plus, Trash2 } from "lucide-react"
import { useBudget } from "@/contexts/budget-context"
import { useTranslation } from "@/hooks/use-translation"

export function BudgetCostEditor() {
  const { categories, expenses, addCategory, addExpense, deleteExpense, updateCategory } = useBudget()
  const { t } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)
  const [newCategory, setNewCategory] = useState({
    name: "",
    budgeted: 0,
    color: "#3b82f6",
  })
  const [newExpense, setNewExpense] = useState({
    categoryId: "",
    name: "",
    amount: 0,
    description: "",
  })

  const handleAddCategory = async () => {
    try {
      await addCategory({ ...newCategory, spent: 0 })
      setNewCategory({ name: "", budgeted: 0, color: "#3b82f6" })
    } catch (error) {
      console.error("Failed to add category:", error)
    }
  }

  const handleAddExpense = async () => {
    try {
      await addExpense({
        ...newExpense,
        date: new Date().toISOString(),
      })
      setNewExpense({ categoryId: "", name: "", amount: 0, description: "" })
    } catch (error) {
      console.error("Failed to add expense:", error)
    }
  }

  const colorOptions = [
    "#ef4444",
    "#f97316",
    "#eab308",
    "#22c55e",
    "#3b82f6",
    "#8b5cf6",
    "#ec4899",
    "#06b6d4",
    "#84cc16",
    "#f59e0b",
  ]

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold mb-4">{t("budget.editCosts")}</h2>

      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <Card>
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
              <CardTitle className="flex items-center justify-between">
                {t("budget.manageCategories")}
                {isOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
              </CardTitle>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="space-y-6">
              {/* Add Category Form */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border rounded-lg">
                <div className="space-y-2">
                  <Label htmlFor="categoryName">{t("budget.categoryName")}</Label>
                  <Input
                    id="categoryName"
                    value={newCategory.name}
                    onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                    placeholder={t("budget.categoryNamePlaceholder")}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="budgetAmount">{t("budget.budgetAmount")}</Label>
                  <Input
                    id="budgetAmount"
                    type="number"
                    value={newCategory.budgeted}
                    onChange={(e) => setNewCategory({ ...newCategory, budgeted: Number(e.target.value) })}
                    placeholder="0.00"
                  />
                </div>
                <div className="space-y-2">
                  <Label>{t("budget.color")}</Label>
                  <div className="flex gap-1 flex-wrap">
                    {colorOptions.map((color) => (
                      <button
                        key={color}
                        type="button"
                        className={`w-6 h-6 rounded-full border-2 ${
                          newCategory.color === color ? "border-gray-900" : "border-gray-300"
                        }`}
                        style={{ backgroundColor: color }}
                        onClick={() => setNewCategory({ ...newCategory, color })}
                      />
                    ))}
                  </div>
                </div>
                <div className="flex items-end">
                  <Button
                    onClick={handleAddCategory}
                    disabled={!newCategory.name || !newCategory.budgeted}
                    className="w-full"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    {t("budget.addCategory")}
                  </Button>
                </div>
              </div>

              {/* Add Expense Form */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4 border rounded-lg">
                <div className="space-y-2">
                  <Label htmlFor="expenseCategory">{t("budget.category")}</Label>
                  <Select
                    value={newExpense.categoryId}
                    onValueChange={(value) => setNewExpense({ ...newExpense, categoryId: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t("budget.selectCategory")} />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: category.color }} />
                            {category.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="expenseName">{t("budget.expenseName")}</Label>
                  <Input
                    id="expenseName"
                    value={newExpense.name}
                    onChange={(e) => setNewExpense({ ...newExpense, name: e.target.value })}
                    placeholder={t("budget.expenseNamePlaceholder")}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="expenseAmount">{t("budget.amount")}</Label>
                  <Input
                    id="expenseAmount"
                    type="number"
                    value={newExpense.amount}
                    onChange={(e) => setNewExpense({ ...newExpense, amount: Number(e.target.value) })}
                    placeholder="0.00"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="expenseDescription">{t("budget.description")}</Label>
                  <Input
                    id="expenseDescription"
                    value={newExpense.description}
                    onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
                    placeholder={t("budget.descriptionPlaceholder")}
                  />
                </div>
                <div className="flex items-end">
                  <Button
                    onClick={handleAddExpense}
                    disabled={!newExpense.categoryId || !newExpense.name || !newExpense.amount}
                    className="w-full"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    {t("budget.addExpense")}
                  </Button>
                </div>
              </div>

              {/* Expenses Table */}
              {expenses.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-4">{t("budget.recentExpenses")}</h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>{t("budget.category")}</TableHead>
                        <TableHead>{t("budget.name")}</TableHead>
                        <TableHead>{t("budget.amount")}</TableHead>
                        <TableHead>{t("budget.date")}</TableHead>
                        <TableHead>{t("budget.description")}</TableHead>
                        <TableHead>{t("common.actions")}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {expenses.slice(0, 10).map((expense) => {
                        const category = categories.find((cat) => cat.id === expense.categoryId)
                        return (
                          <TableRow key={expense.id}>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <div
                                  className="w-3 h-3 rounded-full"
                                  style={{ backgroundColor: category?.color || "#gray" }}
                                />
                                {category?.name || t("budget.unknownCategory")}
                              </div>
                            </TableCell>
                            <TableCell className="font-medium">{expense.name}</TableCell>
                            <TableCell>
                              <Badge variant="secondary">{t("common.currency", { amount: expense.amount })}</Badge>
                            </TableCell>
                            <TableCell>{new Date(expense.date).toLocaleDateString()}</TableCell>
                            <TableCell className="max-w-xs truncate">{expense.description || "-"}</TableCell>
                            <TableCell>
                              <Button variant="ghost" size="sm" onClick={() => deleteExpense(expense.id)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      {categories
        .filter((cat) => cat.subcategories && cat.subcategories.length > 0)
        .map((category) => (
          <Card key={category.id}>
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                <CardTitle className="flex items-center justify-between">
                  <span>{category.name}</span>
                  <ChevronDown className="h-4 w-4" />
                </CardTitle>
              </CardHeader>
            </CollapsibleTrigger>

            <CollapsibleContent>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground font-medium">
                  <span>{t("budget.costs")}</span>
                  <span>{t("budget.spentAmount")}</span>
                </div>

                {category.subcategories?.map((subcategory) => (
                  <div key={subcategory.id} className="grid grid-cols-2 gap-4 items-center">
                    <span>{subcategory.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">R$</span>
                      <Input
                        type="number"
                        value={subcategory.spentAmount}
                        onChange={(e) =>
                          updateCategory(category.id, {
                            ...category,
                            subcategories: category.subcategories.map((subcat) =>
                              subcat.id === subcategory.id
                                ? { ...subcategory, spentAmount: Number(e.target.value) }
                                : subcat,
                            ),
                          })
                        }
                        step="0.01"
                        min="0"
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </CollapsibleContent>
          </Card>
        ))}
    </div>
  )
}
