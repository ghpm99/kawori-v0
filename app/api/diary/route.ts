import { NextResponse } from "next/server"

// Mock data for diary activities
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
    title: "Team Meeting",
    description: "Weekly team sync and project updates",
    category: "work" as const,
    priority: "high" as const,
    status: "completed" as const,
    date: "2024-01-15",
    startTime: "10:00",
    endTime: "11:00",
    tags: ["meeting", "team", "project"],
    notes: "Discussed Q1 goals and upcoming deadlines.",
    createdAt: "2024-01-15T09:00:00Z",
    updatedAt: "2024-01-15T11:00:00Z",
  },
  {
    id: "3",
    title: "Budget Review",
    description: "Review monthly expenses and update budget",
    category: "finance" as const,
    priority: "high" as const,
    status: "in-progress" as const,
    date: "2024-01-15",
    startTime: "14:00",
    endTime: "15:00",
    tags: ["budget", "finance", "planning"],
    notes: "Need to categorize last week's expenses.",
    createdAt: "2024-01-15T13:00:00Z",
    updatedAt: "2024-01-15T14:30:00Z",
  },
  {
    id: "4",
    title: "Grocery Shopping",
    description: "Weekly grocery shopping for meal prep",
    category: "personal" as const,
    priority: "medium" as const,
    status: "pending" as const,
    date: "2024-01-16",
    tags: ["shopping", "food", "meal-prep"],
    notes: "Don't forget to buy ingredients for the new recipe.",
    createdAt: "2024-01-15T20:00:00Z",
    updatedAt: "2024-01-15T20:00:00Z",
  },
]

export async function GET() {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300))

  return NextResponse.json(activities)
}

export async function POST(request: Request) {
  const body = await request.json()

  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  const newActivity = {
    id: (activities.length + 1).toString(),
    ...body,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  activities.push(newActivity)

  return NextResponse.json(newActivity, { status: 201 })
}
