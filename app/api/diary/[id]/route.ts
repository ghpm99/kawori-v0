import { NextResponse } from "next/server"

// This would normally come from a database
const activities = [
  {
    id: "1",
    title: "Morning Workout",
    description: "30-minute cardio session at the gym",
    category: "health" as const,
    priority: "medium" as const,
    status: "completed" as const,
    date: "2024-01-15",
    startTime: "07:00",
    endTime: "07:30",
    tags: ["fitness", "cardio", "gym"],
    notes: "Felt great after the workout. Increased intensity today.",
    createdAt: "2024-01-15T06:00:00Z",
    updatedAt: "2024-01-15T07:30:00Z",
  },
  {
    id: "2",
    title: "Team meeting",
    description: "Weekly team sync to discuss project progress and blockers",
    category: "work" as const,
    priority: "medium" as const,
    status: "in-progress" as const,
    date: "2024-01-16",
    startTime: "10:00",
    endTime: "11:00",
    tags: ["meeting", "team"],
    notes: "Discussed Q1 goals and project timeline.",
    createdAt: "2024-01-16T09:00:00Z",
    updatedAt: "2024-01-16T10:30:00Z",
  },
]

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const { id } = params

  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300))

  const activity = activities.find((a) => a.id === id)

  if (!activity) {
    return NextResponse.json({ error: "Activity not found" }, { status: 404 })
  }

  return NextResponse.json(activity)
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const { id } = params
  const body = await request.json()

  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  const activityIndex = activities.findIndex((a) => a.id === id)

  if (activityIndex === -1) {
    return NextResponse.json({ error: "Activity not found" }, { status: 404 })
  }

  activities[activityIndex] = {
    ...activities[activityIndex],
    ...body,
    updatedAt: new Date().toISOString(),
  }

  return NextResponse.json(activities[activityIndex])
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const { id } = params

  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  const activityIndex = activities.findIndex((a) => a.id === id)

  if (activityIndex === -1) {
    return NextResponse.json({ error: "Activity not found" }, { status: 404 })
  }

  activities.splice(activityIndex, 1)

  return NextResponse.json({ message: "Activity deleted successfully" })
}
