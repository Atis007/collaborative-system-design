import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const { userId } = await auth()
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const projects = await prisma.project.findMany({
    where: { ownerId: userId },
    orderBy: { createdAt: "desc" },
  })

  return NextResponse.json(projects)
}

export async function POST(request: Request) {
  const { userId } = await auth()
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  let body: { name?: string; description?: string; roomId?: string } = {}
  try {
    body = await request.json()
  } catch {
    // empty body is fine
  }

  const roomId = body.roomId?.trim()
  const project = await prisma.project.create({
    data: {
      ...(roomId ? { id: roomId } : {}),
      ownerId: userId,
      name: body.name?.trim() || "Untitled Project",
      description: body.description?.trim() ?? null,
    },
  })

  return NextResponse.json(project, { status: 201 })
}
