"use client"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { useBudget } from "@/contexts/budget-context"
import { AlertCircle } from "lucide-react"

export function BudgetOverview() {
  const { getTotalAllocation, getRemainingPercentage } = useBudget()
  const totalAllocation = getTotalAllocation()
  const remainingPercentage = getRemainingPercentage()

  const isOverAllocated = totalAllocation > 100

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Total Allocation</span>
          <span className={`text-sm font-medium ${isOverAllocated ? "text-destructive" : ""}`}>{totalAllocation}%</span>
        </div>
        <Progress value={totalAllocation} className={isOverAllocated ? "bg-destructive/20" : ""} />
      </div>

      {isOverAllocated && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Over-allocated</AlertTitle>
          <AlertDescription>
            Your budget is over-allocated by {Math.abs(remainingPercentage)}%. Please adjust your categories to total
            100%.
          </AlertDescription>
        </Alert>
      )}

      {!isOverAllocated && remainingPercentage > 0 && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Unallocated Budget</AlertTitle>
          <AlertDescription>You have {remainingPercentage}% of your budget unallocated.</AlertDescription>
        </Alert>
      )}
    </div>
  )
}
