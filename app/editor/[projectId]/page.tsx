import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { AccessDenied } from "@/components/editor/access-denied"
import { WorkspaceShell } from "@/components/editor/workspace-shell"
import { getProjectWithAccess } from "@/lib/project-access"

interface WorkspacePageProps {
  params: Promise<{ projectId: string }>
}

export default async function WorkspacePage({ params }: WorkspacePageProps) {
  const { userId } = await auth()
  if (!userId) redirect("/sign-in")

  const { projectId } = await params
  const result = await getProjectWithAccess(projectId)

  if (!result) {
    return <AccessDenied />
  }

  return <WorkspaceShell project={result.project} />
}
