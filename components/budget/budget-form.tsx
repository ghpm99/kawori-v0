"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useBudget } from "@/contexts/budget-context"
import { formatCurrency } from "@/lib/utils"

export function BudgetForm() {
  const { budget, updateMonthlyIncome } = useBudget()
  const [income, setIncome] = useState(budget?.monthlyIncome.toString() || "")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const numericIncome = Number.parseFloat(income)
    if (!isNaN(numericIncome) && numericIncome > 0) {
      updateMonthlyIncome(numericIncome)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Income</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center space-x-2">
            <Input
              type="number"
              value={income}
              onChange={(e) => setIncome(e.target.value)}
              placeholder="Enter your monthly income"
              className="flex-1"
              min="0"
              step="100"
            />
            <Button type="submit">Update</Button>
          </div>
          {budget && (
            <p className="text-sm text-muted-foreground">
              Current monthly income: {formatCurrency(budget.monthlyIncome)}
            </p>
          )}
        </form>
      </CardContent>
    </Card>
  )
}
