import { NextResponse } from "next/server"

// Mock data for settings
let settings = {
  avatar: "/placeholder.svg?height=100&width=100",
  fullName: "John Doe",
  email: "john.doe@example.com",
  phone: "+1 (555) 123-4567",
  timezone: "utc-5",
  language: "en",
  currency: "usd",
  dateFormat: "mm-dd-yyyy",
  theme: "system",
  notifications: {
    email: true,
    push: true,
    sms: false,
    marketing: false,
    updates: true,
    accountActivity: true,
  },
  privacy: {
    dataSharing: true,
    accountVisibility: "public",
    personalizedAds: false,
  },
}

export async function GET() {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  return NextResponse.json(settings)
}

export async function PUT(request: Request) {
  const body = await request.json()

  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  // Update settings
  settings = {
    ...settings,
    ...body,
  }

  return NextResponse.json(settings)
}
