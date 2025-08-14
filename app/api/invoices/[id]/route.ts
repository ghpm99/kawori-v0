import { type NextRequest, NextResponse } from "next/server"

// This would be imported from a shared data store in a real app
const invoices = [
  {
    id: "1",
    number: "INV-2024-001",
    clientName: "Empresa ABC Ltda",
    clientEmail: "contato@empresaabc.com",
    clientAddress: "Rua das Flores, 123 - São Paulo, SP",
    date: "2024-01-15",
    dueDate: "2024-02-15",
    items: [
      { id: "1", description: "Consultoria estratégica", quantity: 20, price: 500, total: 10000 },
      { id: "2", description: "Análise de investimentos", quantity: 10, price: 500, total: 5000 },
    ],
    subtotal: 15000,
    tax: 0,
    total: 15000,
    status: "sent",
    tags: ["cliente", "consultoria"],
  },
]

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params
  const data = await request.json()

  const index = invoices.findIndex((invoice) => invoice.id === id)

  if (index === -1) {
    return NextResponse.json({ error: "Invoice not found" }, { status: 404 })
  }

  invoices[index] = { ...invoices[index], ...data }

  return NextResponse.json(invoices[index])
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params

  const index = invoices.findIndex((invoice) => invoice.id === id)

  if (index === -1) {
    return NextResponse.json({ error: "Invoice not found" }, { status: 404 })
  }

  invoices.splice(index, 1)

  return NextResponse.json({ success: true })
}
