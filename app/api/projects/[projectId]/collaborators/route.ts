import { auth, currentUser } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import { enrichEmailsWithClerkData } from "@/lib/clerk-user"
import { getProjectWithAccess } from "@/lib/project-access"
import { prisma } from "@/lib/prisma"

interface RouteContext {
  params: Promise<{ projectId: string }>
}

export async function GET(_request: Request, { params }: RouteContext) {
  const { userId } = await auth()
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { projectId } = await params
  const access = await getProjectWithAccess(projectId)
  if (!access) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  const records = await prisma.projectCollaborator.findMany({
    where: { projectId },
    orderBy: { createdAt: "asc" },
    select: { id: true, email: true },
  })

  const emails = records.map((r) => r.email)
  const enriched = await enrichEmailsWithClerkData(emails)

  const result = records.map((record, i) => ({
    id: record.id,
    ...enriched[i],
  }))

  return NextResponse.json(result)
}

export async function POST(request: Request, { params }: RouteContext) {
  const { userId } = await auth()
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { projectId } = await params

  const project = await prisma.project.findUnique({ where: { id: projectId } })
  if (!project) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }
  if (project.ownerId !== userId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  let body: { email?: string } = {}
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
  }

  const email = body.email?.trim().toLowerCase()
  if (!email || !email.includes("@")) {
    return NextResponse.json({ error: "Valid email is required" }, { status: 400 })
  }

  const owner = await currentUser()
  const ownerEmails =
    owner?.emailAddresses.map((e) => e.emailAddress.toLowerCase()) ?? []
  if (ownerEmails.includes(email)) {
    return NextResponse.json({ error: "Cannot invite yourself" }, { status: 400 })
  }

  const existing = await prisma.projectCollaborator.findUnique({
    where: { projectId_email: { projectId, email } },
  })
  if (existing) {
    return NextResponse.json({ error: "Already a collaborator" }, { status: 409 })
  }

  const record = await prisma.projectCollaborator.create({
    data: { projectId, email },
    select: { id: true, email: true },
  })

  const [enriched] = await enrichEmailsWithClerkData([record.email])

  return NextResponse.json({ id: record.id, ...enriched }, { status: 201 })
}
