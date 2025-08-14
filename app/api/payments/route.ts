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
  {
    id: "2",
    amount: 2500,
    date: "2024-01-12",
    method: "pix",
    status: "completed",
    description: "Pagamento de Fornecedor - Material de Escritório",
    reference: "SUPP-001",
    type: "expense",
  },
  {
    id: "3",
    amount: 8500,
    date: "2024-01-10",
    method: "bank_transfer",
    status: "pending",
    description: "Aluguel do Escritório - Janeiro 2024",
    reference: "RENT-JAN-2024",
    type: "expense",
  },
]

export async function GET() {
  return NextResponse.json(payments)
}

export async function POST(request: NextRequest) {
  const data = await request.json()

  const newPayment = {
    ...data,
    id: Date.now().toString(),
  }

  payments.push(newPayment)

  return NextResponse.json(newPayment, { status: 201 })
}
