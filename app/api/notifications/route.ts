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
  {
    id: 2,
    title: "Account Alert",
    message: "Unusual activity detected on your account.",
    date: "2023-07-14",
    icon: "AlertTriangle",
    color: "text-yellow-500",
    read: false,
    type: "warning",
  },
  {
    id: 3,
    title: "Payment Due",
    message: "Your credit card payment is due in 3 days.",
    date: "2023-07-13",
    icon: "CreditCard",
    color: "text-red-500",
    read: true,
    type: "error",
  },
]

export async function GET() {
  return NextResponse.json(notifications)
}

export async function POST(request: NextRequest) {
  const data = await request.json()

  const newNotification = {
    ...data,
    id: Date.now(),
    read: false,
  }

  notifications.unshift(newNotification)

  return NextResponse.json(newNotification, { status: 201 })
}
