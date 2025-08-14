import { type NextRequest, NextResponse } from "next/server"

// In-memory storage (in production, use a database)
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
  {
    id: "2",
    number: "INV-2024-002",
    clientName: "Tech Solutions Inc",
    clientEmail: "finance@techsolutions.com",
    clientAddress: "123 Tech Street - New York, NY",
    date: "2024-01-10",
    dueDate: "2024-02-10",
    items: [{ id: "1", description: "Auditoria completa", quantity: 1, price: 8500, total: 8500 }],
    subtotal: 8500,
    tax: 0,
    total: 8500,
    status: "paid",
    tags: ["auditoria"],
  },
  {
    id: "3",
    number: "INV-2024-003",
    clientName: "Startup XYZ",
    clientEmail: "admin@startupxyz.com",
    clientAddress: "456 Innovation Ave - San Francisco, CA",
    date: "2024-01-05",
    dueDate: "2024-01-20",
    items: [
      { id: "1", description: "Plano de negócios", quantity: 1, price: 2000, total: 2000 },
      { id: "2", description: "Projeções financeiras", quantity: 1, price: 1200, total: 1200 },
    ],
    subtotal: 3200,
    tax: 0,
    total: 3200,
    status: "overdue",
    tags: ["startup", "planejamento"],
  },
]

export async function GET() {
  return NextResponse.json(invoices)
}

export async function POST(request: NextRequest) {
  const data = await request.json()

  const newInvoice = {
    ...data,
    id: Date.now().toString(),
    number: `INV-${new Date().getFullYear()}-${(invoices.length + 1).toString().padStart(3, "0")}`,
  }

  invoices.push(newInvoice)

  return NextResponse.json(newInvoice, { status: 201 })
}
