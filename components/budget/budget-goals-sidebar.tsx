"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Skeleton } from "@/components/ui/skeleton"
import { Target, Plus } from "lucide-react"
import { useBudget } from "@/contexts/budget-context"
import { useTranslation } from "@/hooks/use-translation"
import { useState } from "react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

export function BudgetGoalsSidebar() {
  const { goals, loading, addGoal, getGoalProgress } = useBudget()
  const { t } = useTranslation()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newGoal, setNewGoal] = useState({
    name: "",
    target: 0,
    current: 0,
    deadline: "",
  })

  const handleAddGoal = async () => {
    try {
      await addGoal(newGoal)
      setNewGoal({ name: "", target: 0, current: 0, deadline: "" })
      setIsDialogOpen(false)
    } catch (error) {
      console.error("Failed to add goal:", error)
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            {t("budget.financialGoals")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-2 w-full" />
                <Skeleton className="h-3 w-20" />
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
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            {t("budget.financialGoals")}
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" variant="outline">
                <Plus className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{t("budget.addGoal")}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="goalName">{t("budget.goalName")}</Label>
                  <Input
                    id="goalName"
                    value={newGoal.name}
                    onChange={(e) => setNewGoal({ ...newGoal, name: e.target.value })}
                    placeholder={t("budget.goalNamePlaceholder")}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="target">{t("budget.targetAmount")}</Label>
                    <Input
                      id="target"
                      type="number"
                      value={newGoal.target}
                      onChange={(e) => setNewGoal({ ...newGoal, target: Number(e.target.value) })}
                      placeholder="0.00"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="current">{t("budget.currentAmount")}</Label>
                    <Input
                      id="current"
                      type="number"
                      value={newGoal.current}
                      onChange={(e) => setNewGoal({ ...newGoal, current: Number(e.target.value) })}
                      placeholder="0.00"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="deadline">{t("budget.deadline")}</Label>
                  <Input
                    id="deadline"
                    type="date"
                    value={newGoal.deadline}
                    onChange={(e) => setNewGoal({ ...newGoal, deadline: e.target.value })}
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    {t("common.cancel")}
                  </Button>
                  <Button onClick={handleAddGoal} disabled={!newGoal.name || !newGoal.target}>
                    {t("budget.addGoal")}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {goals.length === 0 ? (
            <p className="text-center text-muted-foreground py-4">{t("budget.noGoals")}</p>
          ) : (
            goals.map((goal) => {
              const progress = getGoalProgress(goal.id)
              const deadline = new Date(goal.deadline)
              const isOverdue = deadline < new Date()

              return (
                <div key={goal.id} className="space-y-2">
                  <div className="flex justify-between items-start">
                    <h4 className="font-medium">{goal.name}</h4>
                    <span className="text-sm text-muted-foreground">{progress.toFixed(1)}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>
                      {t("common.currency", { amount: goal.current })} / {t("common.currency", { amount: goal.target })}
                    </span>
                    <span className={isOverdue ? "text-red-600" : ""}>
                      {format(deadline, "dd/MM/yyyy", { locale: ptBR })}
                    </span>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </CardContent>
    </Card>
  )
}
