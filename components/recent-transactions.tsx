import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowUpRight, ArrowDownRight, CreditCard, ShoppingCart, Wallet } from "lucide-react"
import { useDashboard } from "@/contexts/dashboard-context"

const iconMap = {
  ShoppingCart,
  CreditCard,
  Wallet,
}

export function RecentTransactions() {
  const { recentTransactions } = useDashboard()
  const transactions = recentTransactions.slice(0, 3)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-medium">Recent Transactions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {transactions.map((transaction) => {
            const IconComponent = iconMap[transaction.icon as keyof typeof iconMap] || CreditCard
            return (
              <div key={transaction.id} className="flex items-center">
                <div className="flex-1">
                  <p className="text-sm font-medium">{transaction.name}</p>
                  <p className="text-xs text-muted-foreground">{transaction.date}</p>
                </div>
                <div className="flex items-center">
                  <span
                    className={`text-sm font-medium ${
                      transaction.type === "income"
                        ? "text-green-600 dark:text-green-400"
                        : "text-red-600 dark:text-red-400"
                    }`}
                  >
                    {transaction.type === "income" ? "+" : ""}${Math.abs(transaction.amount).toFixed(2)}
                  </span>
                  {transaction.type === "income" ? (
                    <ArrowUpRight className="h-4 w-4 text-green-600 dark:text-green-400 ml-1" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4 text-red-600 dark:text-red-400 ml-1" />
                  )}
                </div>
              </div>
            )
          })}
        </div>
        <Button className="w-full mt-4 bg-transparent" variant="outline">
          View All Transactions
        </Button>
      </CardContent>
    </Card>
  )
}
