import { type NextRequest, NextResponse } from "next/server"

const tags = [
  {
    id: "1",
    name: "Cliente",
    color: "bg-blue-500",
    usageCount: 15,
  },
]

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params
  const data = await request.json()

  const index = tags.findIndex((tag) => tag.id === id)

  if (index === -1) {
    return NextResponse.json({ error: "Tag not found" }, { status: 404 })
  }

  tags[index] = { ...tags[index], ...data }

  return NextResponse.json(tags[index])
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params

  const index = tags.findIndex((tag) => tag.id === id)

  if (index === -1) {
    return NextResponse.json({ error: "Tag not found" }, { status: 404 })
  }

  tags.splice(index, 1)

  return NextResponse.json({ success: true })
}
