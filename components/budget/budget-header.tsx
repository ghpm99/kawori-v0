"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { DollarSign, Settings } from "lucide-react"
import { MonthYearSelector } from "./month-year-selector"
import { useBudget } from "@/contexts/budget-context"
import { useTranslation } from "@/hooks/use-translation"
import { useState } from "react"

export function BudgetHeader() {
  const { salary, setSalary, getMonthlyStats } = useBudget()
  const { t } = useTranslation()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newSalary, setNewSalary] = useState(salary)

  const stats = getMonthlyStats()

  const handleSalaryUpdate = async () => {
    try {
      await setSalary(newSalary)
      setIsDialogOpen(false)
    } catch (error) {
      console.error("Failed to update salary:", error)
    }
  }

  return (
    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
      <MonthYearSelector />

      <div className="flex gap-4">
        <Card className="min-w-[200px]">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              {t("budget.salary")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{t("common.currency", { amount: salary })}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {t("budget.remaining")}: {t("common.currency", { amount: stats.savings })}
            </p>
          </CardContent>
        </Card>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="icon">
              <Settings className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t("budget.updateSalary")}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="salary">{t("budget.monthlySalary")}</Label>
                <Input
                  id="salary"
                  type="number"
                  value={newSalary}
                  onChange={(e) => setNewSalary(Number(e.target.value))}
                  placeholder="0.00"
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  {t("common.cancel")}
                </Button>
                <Button onClick={handleSalaryUpdate}>{t("common.save")}</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
