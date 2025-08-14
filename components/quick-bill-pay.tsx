"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PaymentModal } from "./payment-modal"
import { useDashboard } from "@/contexts/dashboard-context"

export function QuickBillPay() {
  const { bills, payBill, modalStates, setModalState } = useDashboard()

  const handlePaymentSuccess = (paidBillId: number) => {
    payBill(paidBillId)
    setModalState("selectedBill", null)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Bill Pay</CardTitle>
      </CardHeader>
      <CardContent>
        {bills.length > 0 ? (
          <div className="space-y-4">
            {bills.map((bill) => (
              <div key={bill.id} className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{bill.name}</p>
                  <p className="text-sm text-muted-foreground">Due: {bill.dueDate}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="font-bold">${bill.amount}</span>
                  <Button variant="outline" size="sm" onClick={() => setModalState("selectedBill", bill)}>
                    Pay
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground">No pending bills</p>
        )}
      </CardContent>
      {modalStates.selectedBill && (
        <PaymentModal
          bill={modalStates.selectedBill}
          isOpen={!!modalStates.selectedBill}
          onClose={() => setModalState("selectedBill", null)}
          onPaymentSuccess={() => handlePaymentSuccess(modalStates.selectedBill!.id)}
        />
      )}
    </Card>
  )
}
