"use client"

import { useEffect } from "react"
import { CanvasRoom } from "@/components/editor/canvas-room"
import { ShareDialog } from "@/components/editor/share-dialog"
import { useWorkspace } from "@/components/editor/workspace-context"
import type { Project } from "@/lib/projects"

interface WorkspaceShellProps {
  project: Project
}

export function WorkspaceShell({ project }: WorkspaceShellProps) {
  const { setProject, isShareOpen, closeShare } = useWorkspace()

  useEffect(() => {
    setProject(project)
    return () => setProject(null)
  }, [project, setProject])

  return (
    <>
      <div className="h-full">
        <CanvasRoom roomId={project.id} />
      </div>
      <ShareDialog project={project} open={isShareOpen} onClose={closeShare} />
    </>
  )
}
