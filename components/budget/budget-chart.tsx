"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useBudget } from "@/contexts/budget-context"
import { useTranslation } from "@/hooks/use-translation"

export function BudgetChart() {
  const { categories, getTotalSpent, getTotalBudgeted } = useBudget()
  const { t } = useTranslation()

  const chartData = categories.map((category) => ({
    name: category.name,
    value: category.spent,
    color: category.color,
    budgeted: category.budgeted,
    percentage: category.budgeted > 0 ? Math.round((category.spent / category.budgeted) * 100) : 0,
  }))

  const totalSpent = getTotalSpent()
  const totalBudgeted = getTotalBudgeted()
  const overallProgress = totalBudgeted > 0 ? Math.round((totalSpent / totalBudgeted) * 100) : 0

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <p className="font-medium">{data.name}</p>
          <p className="text-sm text-muted-foreground">Spent: ${data.value.toLocaleString()}</p>
          <p className="text-sm text-muted-foreground">Budget: ${data.budgeted.toLocaleString()}</p>
          <p className="text-sm font-medium">{data.percentage}% of budget used</p>
        </div>
      )
    }
    return null
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("budget.spendingByCategory") || "Spending by Category"}</CardTitle>
        <CardDescription>
          {t("budget.totalSpent") || "Total spent"}: ${totalSpent.toLocaleString()} of ${totalBudgeted.toLocaleString()}{" "}
          ({overallProgress}%)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={120}
                paddingAngle={2}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend
                verticalAlign="bottom"
                height={36}
                formatter={(value, entry: any) => (
                  <span style={{ color: entry.color }}>
                    {value} (${entry.payload.value.toLocaleString()})
                  </span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
