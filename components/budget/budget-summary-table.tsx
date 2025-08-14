"use client"

import type React from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { useBudget } from "@/contexts/budget-context"
import { useTranslation } from "@/hooks/use-translation"

export function BudgetSummaryTable() {
  const { categories, loading, getCategoryProgress } = useBudget()
  const { t } = useTranslation()

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t("budget.categoryBreakdown")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-2 w-full" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("budget.categoryBreakdown")}</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("budget.category")}</TableHead>
              <TableHead>{t("budget.budgeted")}</TableHead>
              <TableHead>{t("budget.spent")}</TableHead>
              <TableHead>{t("budget.remaining")}</TableHead>
              <TableHead>{t("budget.progress")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.map((category) => {
              const remaining = category.budgeted - category.spent
              const progress = getCategoryProgress(category.id)
              const isOverBudget = category.spent > category.budgeted

              return (
                <TableRow key={category.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: category.color }} />
                      {category.name}
                    </div>
                  </TableCell>
                  <TableCell>{t("common.currency", { amount: category.budgeted })}</TableCell>
                  <TableCell>
                    <span className={isOverBudget ? "text-red-600" : ""}>
                      {t("common.currency", { amount: category.spent })}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge variant={remaining >= 0 ? "default" : "destructive"}>
                      {t("common.currency", { amount: remaining })}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <Progress
                        value={progress}
                        className="h-2"
                        style={
                          {
                            "--progress-background": isOverBudget ? "#ef4444" : category.color,
                          } as React.CSSProperties
                        }
                      />
                      <span className="text-xs text-muted-foreground">{progress.toFixed(1)}%</span>
                    </div>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
