import { auth, currentUser } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"
import type { Project } from "@/lib/projects"

interface UserIdentity {
  userId: string
  email: string | null
}

export async function getCurrentUserIdentity(): Promise<UserIdentity | null> {
  const { userId } = await auth()
  if (!userId) return null
  const user = await currentUser()
  const email = user?.emailAddresses[0]?.emailAddress ?? null
  return { userId, email }
}

export async function getProjectWithAccess(
  projectId: string,
): Promise<{ project: Project; isOwner: boolean } | null> {
  const identity = await getCurrentUserIdentity()
  if (!identity) return null

  const record = await prisma.project.findUnique({
    where: { id: projectId },
    select: { id: true, name: true, ownerId: true },
  })

  if (!record) return null

  if (record.ownerId === identity.userId) {
    return {
      project: { id: record.id, name: record.name, owned: true },
      isOwner: true,
    }
  }

  if (identity.email) {
    const collaborator = await prisma.projectCollaborator.findFirst({
      where: { projectId, email: identity.email },
    })
    if (collaborator) {
      return {
        project: { id: record.id, name: record.name, owned: false },
        isOwner: false,
      }
    }
  }

  return null
}
