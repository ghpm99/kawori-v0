"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { useBudget } from "@/contexts/budget-context"
import { formatCurrency } from "@/lib/utils"

interface BudgetCategoryProps {
  id: string
  name: string
  color: string
}

export function BudgetCategory({ id, name, color }: BudgetCategoryProps) {
  const { budget, updateCategoryPercentage, getCategoryAmount } = useBudget()
  const category = budget?.categories.find((c) => c.id === id)
  const [localPercentage, setLocalPercentage] = useState(category?.percentage || 0)

  const handleSliderChange = (value: number[]) => {
    const newPercentage = value[0]
    setLocalPercentage(newPercentage)
  }

  const handleSliderCommit = (value: number[]) => {
    const newPercentage = value[0]
    updateCategoryPercentage(id, newPercentage)
  }

  const amount = getCategoryAmount(id)

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">{name}</CardTitle>
          <span className="h-4 w-4 rounded-full" style={{ backgroundColor: color }} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-2">
          <span className="text-2xl font-bold">{localPercentage}%</span>
          <span className="text-sm text-muted-foreground">{formatCurrency(amount)}</span>
        </div>
        <Slider
          defaultValue={[category?.percentage || 0]}
          max={100}
          step={1}
          value={[localPercentage]}
          onValueChange={handleSliderChange}
          onValueCommit={handleSliderCommit}
          className="mt-2"
        />
      </CardContent>
    </Card>
  )
}
