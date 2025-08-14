import { type NextRequest, NextResponse } from "next/server"

let user = {
  id: "1",
  name: "João Silva",
  email: "joao@kawori.com",
  avatar: "/placeholder.svg?height=40&width=40",
  phone: "+55 11 99999-9999",
  address: "São Paulo, SP",
  company: "Kawori Financial",
  role: "admin",
  creditCards: [
    {
      id: "1",
      name: "Main Card",
      number: "**** **** **** 1234",
      expiryDate: "12/25",
      type: "visa",
      isDefault: true,
    },
    {
      id: "2",
      name: "Business Card",
      number: "**** **** **** 5678",
      expiryDate: "08/26",
      type: "mastercard",
      isDefault: false,
    },
  ],
  activeSessions: [
    {
      id: "1",
      device: "Chrome on Windows",
      location: "São Paulo, Brazil",
      lastActive: "2024-01-15T10:30:00Z",
      isActive: true,
    },
  ],
}

export async function GET() {
  return NextResponse.json(user)
}

export async function PUT(request: NextRequest) {
  const data = await request.json()

  user = { ...user, ...data }

  return NextResponse.json(user)
}
