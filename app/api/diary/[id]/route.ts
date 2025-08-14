import { type NextRequest, NextResponse } from "next/server"

interface RouteParams {
  params: {
    id: string
  }
}

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

// GET /api/diary/[id] - Get a specific diary entry
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = params

    // Mock data - replace with actual database query
    const mockEntry = {
      id,
      date: new Date().toISOString(),
      title: "Sample Entry",
      content: "This is a sample diary entry",
      mood: "happy",
      tags: ["work", "productivity"],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    return NextResponse.json(mockEntry)
  } catch (error) {
    console.error("Error fetching diary entry:", error)
    return NextResponse.json({ error: "Failed to fetch diary entry" }, { status: 500 })
  }
}

// PUT /api/diary/[id] - Update a specific diary entry
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = params
    const body = await request.json()

    // Mock update - replace with actual database update
    const updatedEntry = {
      id,
      ...body,
      updatedAt: new Date().toISOString(),
    }

    return NextResponse.json(updatedEntry)
  } catch (error) {
    console.error("Error updating diary entry:", error)
    return NextResponse.json({ error: "Failed to update diary entry" }, { status: 500 })
  }
}

// DELETE /api/diary/[id] - Delete a specific diary entry
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = params

    // Mock deletion - replace with actual database deletion
    console.log(`Deleting diary entry with id: ${id}`)

    return NextResponse.json({ message: "Activity deleted successfully" })
  } catch (error) {
    console.error("Error deleting diary entry:", error)
    return NextResponse.json({ error: "Failed to delete diary entry" }, { status: 500 })
  }
}
