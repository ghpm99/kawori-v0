import { type NextRequest, NextResponse } from "next/server"

const notifications = [
  {
    id: 1,
    title: "New Feature",
    message: "Check out our new budget tracking tool!",
    date: "2023-07-15",
    icon: "Info",
    color: "text-blue-500",
    read: false,
    type: "info",
  },
]

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const id = Number.parseInt(params.id)

  const notification = notifications.find((n) => n.id === id)

  if (!notification) {
    return NextResponse.json({ error: "Notification not found" }, { status: 404 })
  }

  notification.read = true

  return NextResponse.json(notification)
}
