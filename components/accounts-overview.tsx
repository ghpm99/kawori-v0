"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Wallet, Plus, Send, CreditCard, MoreHorizontal } from "lucide-react"
import { AddMoneyModal } from "./add-money-modal"
import { SendMoneyModal } from "./send-money-modal"
import { RequestMoneyModal } from "./request-money-modal"
import { useDashboard } from "@/contexts/dashboard-context"

export function AccountsOverview() {
  const { accounts, getTotalBalance, updateAccountBalance, modalStates, setModalState } = useDashboard()

  const totalBalance = getTotalBalance()

  const handleAddMoney = (amount: number) => {
    updateAccountBalance("Checking", amount)
  }

  const handleSendMoney = (amount: number, fromAccount: string) => {
    updateAccountBalance(fromAccount, -amount)
  }

  const handleRequestMoney = (amount: number, contact: any) => {
    console.log(`Requested $${amount} from ${contact.name}`)
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Accounts Overview</CardTitle>
        <Wallet className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">${totalBalance.toLocaleString()}</div>
        <p className="text-xs text-muted-foreground">Total balance across all accounts</p>
        <div className="mt-4 space-y-2">
          {accounts.map((account) => (
            <div key={account.name} className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">{account.name}</span>
              <span className="text-sm font-medium">${account.balance.toLocaleString()}</span>
            </div>
          ))}
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2">
          <Button size="sm" onClick={() => setModalState("addMoney", true)}>
            <Plus className="mr-2 h-4 w-4" /> Add
          </Button>
          <Button size="sm" onClick={() => setModalState("sendMoney", true)}>
            <Send className="mr-2 h-4 w-4" /> Send
          </Button>
          <Button size="sm" onClick={() => setModalState("requestMoney", true)}>
            <CreditCard className="mr-2 h-4 w-4" /> Request
          </Button>
          <Button size="sm" variant="outline">
            <MoreHorizontal className="mr-2 h-4 w-4" /> More
          </Button>
        </div>
      </CardContent>
      <AddMoneyModal
        isOpen={modalStates.addMoney}
        onClose={() => setModalState("addMoney", false)}
        onAddMoney={handleAddMoney}
      />
      <SendMoneyModal
        isOpen={modalStates.sendMoney}
        onClose={() => setModalState("sendMoney", false)}
        onSendMoney={handleSendMoney}
        accounts={accounts}
      />
      <RequestMoneyModal
        isOpen={modalStates.requestMoney}
        onClose={() => setModalState("requestMoney", false)}
        onRequestMoney={handleRequestMoney}
      />
    </Card>
  )
}
