import { type NextRequest, NextResponse } from "next/server"

const payments = [
  {
    id: "1",
    invoiceId: "1",
    amount: 15000,
    date: "2024-01-15",
    method: "bank_transfer",
    status: "completed",
    description: "Pagamento Invoice INV-2024-001",
    reference: "INV-2024-001",
    type: "income",
  },
]

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params
  const data = await request.json()

  const index = payments.findIndex((payment) => payment.id === id)

  if (index === -1) {
    return NextResponse.json({ error: "Payment not found" }, { status: 404 })
  }

  payments[index] = { ...payments[index], ...data }

  return NextResponse.json(payments[index])
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params

  const index = payments.findIndex((payment) => payment.id === id)

  if (index === -1) {
    return NextResponse.json({ error: "Payment not found" }, { status: 404 })
  }

  payments.splice(index, 1)

  return NextResponse.json({ success: true })
}
