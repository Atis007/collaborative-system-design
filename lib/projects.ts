import { auth, currentUser } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"

export interface Project {
  id: string
  name: string
  owned: boolean
}

export async function getProjectsForUser(): Promise<{
  owned: Project[]
  shared: Project[]
}> {
  const { userId } = await auth()
  if (!userId) return { owned: [], shared: [] }

  const user = await currentUser()
  const userEmail = user?.emailAddresses[0]?.emailAddress

  const [ownedRaw, sharedRaw] = await Promise.all([
    prisma.project.findMany({
      where: { ownerId: userId },
      orderBy: { createdAt: "desc" },
      select: { id: true, name: true },
    }),
    userEmail
      ? prisma.projectCollaborator.findMany({
          where: { email: userEmail },
          include: { project: { select: { id: true, name: true } } },
          orderBy: { createdAt: "desc" },
        })
      : Promise.resolve([]),
  ])

  const owned: Project[] = ownedRaw.map((p) => ({
    id: p.id,
    name: p.name,
    owned: true,
  }))

  const shared: Project[] = sharedRaw.map((c) => ({
    id: c.project.id,
    name: c.project.name,
    owned: false,
  }))

  return { owned, shared }
}
