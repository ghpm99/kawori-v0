import { type NextRequest, NextResponse } from "next/server"

const tags = [
  {
    id: "1",
    name: "Cliente",
    color: "bg-blue-500",
    usageCount: 15,
  },
  {
    id: "2",
    name: "Investimento",
    color: "bg-green-500",
    usageCount: 8,
  },
  {
    id: "3",
    name: "Reunião",
    color: "bg-yellow-500",
    usageCount: 12,
  },
  {
    id: "4",
    name: "Pagamento",
    color: "bg-red-500",
    usageCount: 23,
  },
]

export async function GET() {
  return NextResponse.json(tags)
}

export async function POST(request: NextRequest) {
  const data = await request.json()

  const newTag = {
    ...data,
    id: Date.now().toString(),
    usageCount: 0,
  }

  tags.push(newTag)

  return NextResponse.json(newTag, { status: 201 })
}
